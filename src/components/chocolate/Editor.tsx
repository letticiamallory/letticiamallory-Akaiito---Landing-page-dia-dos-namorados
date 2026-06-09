"use client";

import {
  CANVAS_H,
  CANVAS_W,
} from "@/data/chocolate-catalog";
import { getEditorCanvasScale } from "@/lib/chocolate-canvas-utils";
import { useChocolateDragFromPanel } from "@/hooks/useChocolateDragFromPanel";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChocolateSidebar } from "./Sidebar";
import { ChocolateCanvas, dropChocolateAt } from "./ChocolateCanvas";
import "./chocolate-box.css";

export function ChocolateEditor() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);

  const updateScale = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    setScale(getEditorCanvasScale(vp.clientWidth));
  }, []);

  useEffect(() => {
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [updateScale]);

  const handleDrop = useCallback(
    (payload: { type: "chocolate"; chocolateIndex: number }, x: number, y: number) => {
      dropChocolateAt(x, y, payload.chocolateIndex);
    },
    []
  );

  const { startDrag } = useChocolateDragFromPanel({
    canvasRef,
    scale,
    onDrop: handleDrop,
  });

  return (
    <div className="chocolate-editor">
      <ChocolateSidebar onStartDrag={startDrag} />
      <div className="chocolate-canvas-area chocolate-canvas-area--editor" ref={viewportRef}>
        <div
          className="chocolate-canvas-stage chocolate-canvas-stage--editor"
          style={{
            width: "100%",
            aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <ChocolateCanvas scale={scale} embedded canvasRef={canvasRef} />
        </div>
      </div>
    </div>
  );
}
