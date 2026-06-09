"use client";

import {
  EDITOR_MAX_HEIGHT,
  EDITOR_SCALE,
  EDITOR_STAGE_WIDTH,
} from "@/data/chocolate-catalog";
import { getCanvasFitScale } from "@/lib/chocolate-canvas-utils";
import { useChocolateDragFromPanel } from "@/hooks/useChocolateDragFromPanel";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChocolateSidebar } from "./Sidebar";
import { ChocolateCanvas, dropChocolateAt } from "./ChocolateCanvas";
import "./chocolate-box.css";

const MOBILE_MQ = "(max-width: 900px)";

export function ChocolateEditor() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(MOBILE_MQ).matches
  );
  const [mobileScale, setMobileScale] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const updateMobileScale = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const next = getCanvasFitScale(vp.clientWidth);
    if (next > 0) setMobileScale(next);
  }, []);

  useLayoutEffect(() => {
    if (!isMobile) return;
    updateMobileScale();
  }, [isMobile, updateMobileScale]);

  useEffect(() => {
    if (!isMobile) return;
    updateMobileScale();
    const ro = new ResizeObserver(updateMobileScale);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [isMobile, updateMobileScale]);

  const scale = isMobile ? mobileScale : EDITOR_SCALE;

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
        className="chocolate-canvas-area chocolate-canvas-area--editor"
        ref={isMobile ? viewportRef : undefined}
      >
        <div
          className={`chocolate-canvas-stage chocolate-canvas-stage--editor${
            isMobile ? " chocolate-canvas-stage--editor-mobile" : ""
          }`}
          style={
            isMobile
              ? undefined
              : {
                  width: EDITOR_STAGE_WIDTH,
                  height: EDITOR_MAX_HEIGHT,
                  position: "relative",
                }
          }
        >
          <ChocolateCanvas
            scale={scale}
            embedded
            fillContainer={isMobile}
            canvasRef={canvasRef}
          />
        </div>
      </div>
    </div>
  );
}
