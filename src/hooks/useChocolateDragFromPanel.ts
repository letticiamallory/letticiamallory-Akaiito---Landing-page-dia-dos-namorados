"use client";

import { useCallback, useRef } from "react";
import { isInsideCanvas, screenToCanvas } from "@/lib/chocolate-canvas-utils";

export type ChocolatePanelPayload = {
  type: "chocolate";
  chocolateIndex: number;
};

export function useChocolateDragFromPanel({
  canvasRef,
  scale,
  onDrop,
}: {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  scale: number;
  onDrop: (payload: ChocolatePanelPayload, x: number, y: number) => void;
}) {
  const ghostRef = useRef<HTMLDivElement | null>(null);

  const cleanup = useCallback(() => {
    ghostRef.current?.remove();
    ghostRef.current = null;
    document.body.style.cursor = "";
  }, []);

  const startDrag = useCallback(
    (e: React.MouseEvent | React.TouchEvent, payload: ChocolatePanelPayload) => {
      e.preventDefault();

      const point =
        "touches" in e
          ? { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }
          : { clientX: e.clientX, clientY: e.clientY };

      const source = e.currentTarget as HTMLElement;
      const ghost = document.createElement("div");
      ghost.style.cssText = [
        "position:fixed",
        "pointer-events:none",
        "z-index:10000",
        "width:56px",
        "height:56px",
        "opacity:0.92",
        "transform:translate(-50%,-50%)",
        `left:${point.clientX}px`,
        `top:${point.clientY}px`,
        "border:2px solid #b03739",
        "border-radius:10px",
        "background:rgba(96,60,44,0.95)",
        "overflow:hidden",
        "padding:6px",
      ].join(";");
      ghost.innerHTML =
        source.querySelector("img")?.outerHTML ??
        source.querySelector("svg")?.outerHTML ??
        "";
      document.body.appendChild(ghost);
      ghostRef.current = ghost;
      document.body.style.cursor = "grabbing";

      const onMove = (ev: MouseEvent | TouchEvent) => {
        const p =
          "touches" in ev
            ? { clientX: ev.touches[0]?.clientX ?? 0, clientY: ev.touches[0]?.clientY ?? 0 }
            : { clientX: ev.clientX, clientY: ev.clientY };
        if (ghostRef.current) {
          ghostRef.current.style.left = `${p.clientX}px`;
          ghostRef.current.style.top = `${p.clientY}px`;
        }
      };

      const onEnd = (ev: MouseEvent | TouchEvent) => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onEnd);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onEnd);

        const p =
          "changedTouches" in ev
            ? { clientX: ev.changedTouches[0]?.clientX ?? 0, clientY: ev.changedTouches[0]?.clientY ?? 0 }
            : { clientX: ev.clientX, clientY: ev.clientY };

        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          if (isInsideCanvas(p.clientX, p.clientY, rect)) {
            const { x, y } = screenToCanvas(p.clientX, p.clientY, rect, scale);
            onDrop(payload, x, y);
          }
        }
        cleanup();
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onEnd);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onEnd);
    },
    [canvasRef, scale, onDrop, cleanup]
  );

  return { startDrag };
}
