"use client";

import { EDITOR_SCALE } from "@/data/chocolate-catalog";
import { getCanvasFitScale } from "@/lib/chocolate-canvas-utils";
import { useChocolateDragFromPanel } from "@/hooks/useChocolateDragFromPanel";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChocolateSidebar } from "./Sidebar";
import { ChocolateCanvas, dropChocolateAt } from "./ChocolateCanvas";
import "./chocolate-box.css";

const MOBILE_MQ = "(max-width: 900px)";

function readEditorScale(viewport: HTMLDivElement | null) {
  if (!viewport) return EDITOR_SCALE;
  if (!window.matchMedia(MOBILE_MQ).matches) return EDITOR_SCALE;
  const width = viewport.clientWidth;
  if (width <= 0) return EDITOR_SCALE;
  return getCanvasFitScale(width);
}

export function ChocolateEditor() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(EDITOR_SCALE);

  const updateScale = useCallback(() => {
    const next = readEditorScale(viewportRef.current);
    setScale((prev) => (Math.abs(prev - next) < 0.0001 ? prev : next));
  }, []);

  useLayoutEffect(() => {
    updateScale();
  }, [updateScale]);

  useEffect(() => {
    updateScale();
    const mq = window.matchMedia(MOBILE_MQ);
    const ro = new ResizeObserver(updateScale);
    if (viewportRef.current) ro.observe(viewportRef.current);
    mq.addEventListener("change", updateScale);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", updateScale);
    };
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
        <div className="chocolate-canvas-stage chocolate-canvas-stage--editor">
          <ChocolateCanvas scale={scale} embedded editorSlot canvasRef={canvasRef} />
        </div>
      </div>
    </div>
  );
}
