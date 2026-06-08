"use client";

import { useCallback, useRef } from "react";
import { isInsideCanvas, screenToCanvas } from "@/lib/museum-canvas-utils";

export type PanelDragPayload =
  | { type: "frame"; frameIndex: number; thumbSrc: string }
  | { type: "spectator"; spectatorIndex: number; thumbSrc: string };

const MIN_DRAG_PX = 10;

function isOverPlacedElement(clientX: number, clientY: number, canvas: HTMLElement) {
  const hit = document.elementFromPoint(clientX, clientY);
  if (!hit || !canvas.contains(hit)) return false;
  return hit.closest(".museum-element") !== null;
}

export function useDragFromPanel({
  canvasRef,
  scale,
  onDrop,
}: {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  scale: number;
  onDrop: (payload: PanelDragPayload, x: number, y: number) => void;
}) {
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const sessionRef = useRef<{ end: () => void } | null>(null);

  const cleanup = useCallback(() => {
    ghostRef.current?.remove();
    ghostRef.current = null;
    document.body.style.cursor = "";
  }, []);

  const cancelDrag = useCallback(() => {
    sessionRef.current?.end();
    sessionRef.current = null;
  }, []);

  const startDrag = useCallback(
    (e: React.MouseEvent | React.TouchEvent, payload: PanelDragPayload) => {
      e.preventDefault();

      sessionRef.current?.end();
      sessionRef.current = null;

      const point =
        "touches" in e
          ? { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }
          : { clientX: e.clientX, clientY: e.clientY };

      const startX = point.clientX;
      const startY = point.clientY;
      let movedEnough = false;
      let ended = false;

      const ghost = document.createElement("div");
      ghost.style.cssText = [
        "position:fixed",
        "pointer-events:none",
        "z-index:10000",
        "width:72px",
        "height:72px",
        "opacity:0.85",
        "transform:translate(-50%,-50%)",
        `left:${point.clientX}px`,
        `top:${point.clientY}px`,
        "border:2px solid #e8748a",
        "border-radius:8px",
        "background:rgba(26,15,10,0.9)",
        "overflow:hidden",
      ].join(";");
      ghost.innerHTML = `<img src="${payload.thumbSrc}" style="width:100%;height:100%;object-fit:contain" alt="" />`;
      document.body.appendChild(ghost);
      ghostRef.current = ghost;
      document.body.style.cursor = "grabbing";

      const onMove = (ev: MouseEvent | TouchEvent) => {
        const p =
          "touches" in ev
            ? { clientX: ev.touches[0]?.clientX ?? 0, clientY: ev.touches[0]?.clientY ?? 0 }
            : { clientX: ev.clientX, clientY: ev.clientY };
        if (!movedEnough) {
          const dx = p.clientX - startX;
          const dy = p.clientY - startY;
          if (Math.hypot(dx, dy) >= MIN_DRAG_PX) movedEnough = true;
        }
        if (ghostRef.current) {
          ghostRef.current.style.left = `${p.clientX}px`;
          ghostRef.current.style.top = `${p.clientY}px`;
        }
      };

      const endSession = (ev?: MouseEvent | TouchEvent) => {
        if (ended) return;
        ended = true;

        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", endSession);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", endSession);
        sessionRef.current = null;

        if (ev && movedEnough) {
          const p =
            "changedTouches" in ev
              ? { clientX: ev.changedTouches[0]?.clientX ?? 0, clientY: ev.changedTouches[0]?.clientY ?? 0 }
              : { clientX: ev.clientX, clientY: ev.clientY };

          const canvas = canvasRef.current;
          if (canvas) {
            const rect = canvas.getBoundingClientRect();
            if (
              isInsideCanvas(p.clientX, p.clientY, rect) &&
              !isOverPlacedElement(p.clientX, p.clientY, canvas)
            ) {
              const { x, y } = screenToCanvas(p.clientX, p.clientY, rect, scale);
              onDrop(payload, x, y);
            }
          }
        }

        cleanup();
      };

      sessionRef.current = { end: () => endSession() };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", endSession);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", endSession);
    },
    [canvasRef, scale, onDrop, cleanup]
  );

  return { startDrag, cancelDrag };
}
