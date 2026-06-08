"use client";

import { useCallback, useRef } from "react";
import { getPointerPoint } from "@/lib/museum-canvas-utils";
import type { MuseumElement } from "@/lib/gift-types";

export function useResize({
  scale,
  onResize,
}: {
  scale: number;
  onResize: (id: string, width: number, height: number) => void;
}) {
  const resizeRef = useRef<{
    id: string;
    aspect: number;
    startX: number;
    startW: number;
  } | null>(null);

  const startResize = useCallback(
    (
      e: React.MouseEvent | React.TouchEvent,
      element: MuseumElement,
      canvasRect: DOMRect
    ) => {
      e.stopPropagation();
      const point = getPointerPoint(e.nativeEvent);
      if (!point) return;

      resizeRef.current = {
        id: element.id,
        aspect: element.width / element.height,
        startX: (point.clientX - canvasRect.left) / scale,
        startW: element.width,
      };

      const onPointerMove = (ev: MouseEvent | TouchEvent) => {
        const p = getPointerPoint(ev);
        if (!p || !resizeRef.current) return;
        const canvasX = (p.clientX - canvasRect.left) / scale;
        const delta = canvasX - resizeRef.current.startX;
        const width = Math.max(80, resizeRef.current.startW + delta);
        const height = width / resizeRef.current.aspect;
        onResize(resizeRef.current.id, width, height);
      };

      const onPointerUp = () => {
        resizeRef.current = null;
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
    [scale, onResize]
  );

  return { startResize };
}
