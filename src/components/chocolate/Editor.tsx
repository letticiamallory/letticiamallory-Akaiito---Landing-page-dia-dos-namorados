"use client";

import { CANVAS_H, CANVAS_W, EDITOR_SCALE } from "@/data/chocolate-catalog";
import { useChocolateDragFromPanel } from "@/hooks/useChocolateDragFromPanel";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChocolateSidebar } from "./Sidebar";
import { ChocolateCanvas, dropChocolateAt } from "./ChocolateCanvas";
import "./chocolate-box.css";

const MOBILE_MQ = "(max-width: 900px)";

function readEditorScale(
  stage: HTMLDivElement | null,
  canvasArea: HTMLDivElement | null,
  mobile: boolean
) {
  if (mobile) {
    if (!stage) return EDITOR_SCALE;
    const width = stage.clientWidth;
    if (width <= 0) return EDITOR_SCALE;
    return width / CANVAS_W;
  }

  if (!canvasArea) return EDITOR_SCALE;
  const width = canvasArea.clientWidth;
  if (width <= 0) return EDITOR_SCALE;
  return Math.min(EDITOR_SCALE, width / CANVAS_W);
}

export function ChocolateEditor() {
  const canvasAreaRef = useRef<HTMLDivElement>(null);
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
    const next = readEditorScale(stageRef.current, canvasAreaRef.current, isMobile);
    setScale((prev) => (Math.abs(prev - next) < 0.0001 ? prev : next));
  }, [isMobile]);

  useLayoutEffect(() => {
    updateScale();
  }, [updateScale]);

  useEffect(() => {
    updateScale();
    const mq = window.matchMedia(MOBILE_MQ);
    const ro = new ResizeObserver(updateScale);
    if (stageRef.current) ro.observe(stageRef.current);
    if (canvasAreaRef.current) ro.observe(canvasAreaRef.current);
    mq.addEventListener("change", updateScale);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", updateScale);
    };
  }, [updateScale]);

  const desktopStageW = Math.ceil(CANVAS_W * scale);
  const desktopStageH = Math.ceil(CANVAS_H * scale);

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
      <div
        ref={canvasAreaRef}
        className="chocolate-canvas-area chocolate-canvas-area--editor"
      >
        <div
          ref={stageRef}
          className="chocolate-canvas-stage chocolate-canvas-stage--editor"
          style={
            isMobile
              ? undefined
              : { width: desktopStageW, height: desktopStageH, position: "relative" }
          }
        >
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
