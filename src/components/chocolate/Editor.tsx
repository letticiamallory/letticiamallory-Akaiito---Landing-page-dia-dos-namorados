"use client";

import { CANVAS_W, EDITOR_SCALE } from "@/data/chocolate-catalog";
import { useChocolateDragFromPanel } from "@/hooks/useChocolateDragFromPanel";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChocolateSidebar } from "./Sidebar";
import { ChocolateCanvas, dropChocolateAt } from "./ChocolateCanvas";
import "./chocolate-box.css";

const MOBILE_MQ = "(max-width: 900px)";

function readEditorScale(stage: HTMLDivElement | null) {
  if (!stage) return EDITOR_SCALE;
  if (!window.matchMedia(MOBILE_MQ).matches) return EDITOR_SCALE;
  const width = stage.clientWidth;
  if (width <= 0) return EDITOR_SCALE;
  return width / CANVAS_W;
}

export function ChocolateEditor() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(MOBILE_MQ).matches
  );
  const [scale, setScale] = useState(EDITOR_SCALE);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const updateScale = useCallback(() => {
    const next = readEditorScale(stageRef.current);
    setScale((prev) => (Math.abs(prev - next) < 0.0001 ? prev : next));
  }, []);

  useLayoutEffect(() => {
    updateScale();
  }, [updateScale]);

  useEffect(() => {
    updateScale();
    const mq = window.matchMedia(MOBILE_MQ);
    const ro = new ResizeObserver(updateScale);
    if (stageRef.current) ro.observe(stageRef.current);
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
      <div className="chocolate-canvas-area chocolate-canvas-area--editor">
        <div ref={stageRef} className="chocolate-canvas-stage chocolate-canvas-stage--editor">
          <ChocolateCanvas
            scale={scale}
            embedded
            editorSlot
            mobileScaleViaCss={isMobile}
            canvasRef={canvasRef}
          />
        </div>
      </div>
    </div>
  );
}
