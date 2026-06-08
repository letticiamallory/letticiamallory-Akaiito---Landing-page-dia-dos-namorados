"use client";

import {
  EDITOR_MAX_HEIGHT,
  EDITOR_SCALE,
  EDITOR_STAGE_WIDTH,
} from "@/data/chocolate-catalog";
import { useChocolateDragFromPanel } from "@/hooks/useChocolateDragFromPanel";
import { useCallback, useRef } from "react";
import { ChocolateSidebar } from "./Sidebar";
import { ChocolateCanvas, dropChocolateAt } from "./ChocolateCanvas";
import "./chocolate-box.css";

export function ChocolateEditor() {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDrop = useCallback(
    (payload: { type: "chocolate"; chocolateIndex: number }, x: number, y: number) => {
      dropChocolateAt(x, y, payload.chocolateIndex);
    },
    []
  );

  const { startDrag } = useChocolateDragFromPanel({
    canvasRef,
    scale: EDITOR_SCALE,
    onDrop: handleDrop,
  });

  return (
    <div className="chocolate-editor">
      <ChocolateSidebar onStartDrag={startDrag} />
      <div className="chocolate-canvas-area chocolate-canvas-area--editor">
        <div
          className="chocolate-canvas-stage chocolate-canvas-stage--editor"
          style={{
            width: EDITOR_STAGE_WIDTH,
            height: EDITOR_MAX_HEIGHT,
            position: "relative",
          }}
        >
          <ChocolateCanvas scale={EDITOR_SCALE} embedded canvasRef={canvasRef} />
        </div>
      </div>
    </div>
  );
}
