"use client";

import { CANVAS_H, CANVAS_W, EDITOR_SCALE } from "@/data/chocolate-catalog";
import { useChocolateDragFromPanel } from "@/hooks/useChocolateDragFromPanel";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChocolateSidebar } from "./Sidebar";
import { ChocolateCanvas, dropChocolateAt } from "./ChocolateCanvas";
import "./chocolate-box.css";

const MOBILE_MQ = "(max-width: 900px)";

function readDesktopScale(canvasArea: HTMLDivElement | null) {
  if (!canvasArea) return EDITOR_SCALE;
  const width = canvasArea.clientWidth;
  if (width <= 0) return EDITOR_SCALE;
  return Math.min(EDITOR_SCALE, width / CANVAS_W);
}

function readMobileScale(stage: HTMLDivElement | null) {
  if (!stage) return EDITOR_SCALE;
  const width = stage.clientWidth;
  if (width <= 0) return EDITOR_SCALE;
  return width / CANVAS_W;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(MOBILE_MQ).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return isMobile;
}

function ChocolateEditorDesktop() {
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(EDITOR_SCALE);

  const updateScale = useCallback(() => {
    const next = readDesktopScale(canvasAreaRef.current);
    setScale((prev) => (Math.abs(prev - next) < 0.0001 ? prev : next));
  }, []);

  useLayoutEffect(() => {
    updateScale();
  }, [updateScale]);

  useEffect(() => {
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (canvasAreaRef.current) ro.observe(canvasAreaRef.current);
    return () => ro.disconnect();
  }, [updateScale]);

  const stageW = Math.ceil(CANVAS_W * scale);
  const stageH = Math.ceil(CANVAS_H * scale);

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
    <div className="chocolate-editor chocolate-editor--desktop">
      <ChocolateSidebar onStartDrag={startDrag} />
      <div
        ref={canvasAreaRef}
        className="chocolate-canvas-area chocolate-canvas-area--editor chocolate-canvas-area--editor-desktop"
      >
        <div
          className="chocolate-canvas-stage chocolate-canvas-stage--editor chocolate-canvas-stage--editor-desktop"
          style={{ width: stageW, height: stageH, position: "relative" }}
        >
          <ChocolateCanvas scale={scale} embedded editorSlot canvasRef={canvasRef} />
        </div>
      </div>
    </div>
  );
}

function ChocolateEditorMobile() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(EDITOR_SCALE);

  const updateScale = useCallback(() => {
    const next = readMobileScale(stageRef.current);
    setScale((prev) => (Math.abs(prev - next) < 0.0001 ? prev : next));
  }, []);

  useLayoutEffect(() => {
    updateScale();
  }, [updateScale]);

  useEffect(() => {
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (stageRef.current) ro.observe(stageRef.current);
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
    <div className="chocolate-editor chocolate-editor--mobile">
      <ChocolateSidebar onStartDrag={startDrag} />
      <div className="chocolate-canvas-area chocolate-canvas-area--editor chocolate-canvas-area--editor-mobile">
        <div
          ref={stageRef}
          className="chocolate-canvas-stage chocolate-canvas-stage--editor-mobile"
        >
          <ChocolateCanvas
            scale={scale}
            embedded
            editorSlot
            mobileScaleViaCss
            canvasRef={canvasRef}
          />
        </div>
      </div>
    </div>
  );
}

export function ChocolateEditor() {
  const isMobile = useIsMobile();
  return isMobile ? <ChocolateEditorMobile /> : <ChocolateEditorDesktop />;
}
