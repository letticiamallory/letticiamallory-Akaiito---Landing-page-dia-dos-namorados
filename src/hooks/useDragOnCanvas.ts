"use client";

import { useCallback, useRef } from "react";
import { clampElementPosition, getPointerPoint } from "@/lib/museum-canvas-utils";
import type { MuseumElement } from "@/lib/gift-types";

export function useDragOnCanvas({
  scale,
  onMove,
}: {
  scale: number;
  onMove: (id: string, x: number, y: number) => void;
}) {
  const dragRef = useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
  } | null>(null);

  const startDrag = useCallback(
    (e: React.MouseEvent | React.TouchEvent, element: MuseumElement, canvasRect: DOMRect) => {
      e.stopPropagation();
      const point = getPointerPoint(e.nativeEvent);
      if (!point) return;

      const canvasX = (point.clientX - canvasRect.left) / scale;
      const canvasY = (point.clientY - canvasRect.top) / scale;

      dragRef.current = {
        id: element.id,
        offsetX: canvasX - element.x,
        offsetY: canvasY - element.y,
        width: element.width,
        height: element.height,
      };

      const onPointerMove = (ev: MouseEvent | TouchEvent) => {
        const p = getPointerPoint(ev);
        if (!p || !dragRef.current) return;
        const x = (p.clientX - canvasRect.left) / scale - dragRef.current.offsetX;
        const y = (p.clientY - canvasRect.top) / scale - dragRef.current.offsetY;
        const clamped = clampElementPosition(x, y, dragRef.current.width, dragRef.current.height);
        onMove(dragRef.current.id, clamped.x, clamped.y);
      };

      const onPointerUp = () => {
        dragRef.current = null;
        document.removeEventListener("mousemove", onPointerMove);
        document.removeEventListener("mouseup", onPointerUp);
        document.removeEventListener("touchmove", onPointerMove);
        document.removeEventListener("touchend", onPointerUp);
      };

      document.addEventListener("mousemove", onPointerMove);
      document.addEventListener("mouseup", onPointerUp);
      document.addEventListener("touchmove", onPointerMove, { passive: false });
      document.addEventListener("touchend", onPointerUp);
    },
    [scale, onMove]
  );

  return { startDrag };
}
