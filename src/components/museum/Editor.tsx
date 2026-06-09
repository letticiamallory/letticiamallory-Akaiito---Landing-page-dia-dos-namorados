"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  defaultFrameSize,
  defaultSpectatorSize,
  getFrameDef,
  getSpectatorDef,
} from "@/data/museum-frames";
import { CANVAS_H, CANVAS_W } from "@/data/museum-frames";
import { getCanvasFitScale } from "@/lib/museum-canvas-utils";
import { useDragFromPanel, type PanelDragPayload } from "@/hooks/useDragFromPanel";
import { useMuseumStore } from "@/store/museum.store";
import { Sidebar } from "./Sidebar";
import { MuseumCanvas } from "./MuseumCanvas";
import { MuseumExpandModal } from "./MuseumExpandModal";
import "./museum-editor.css";

export function MuseumEditor() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const expandedCanvasRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [expandedScale, setExpandedScale] = useState(1);
  const [showExpanded, setShowExpanded] = useState(false);

  const addElement = useMuseumStore((s) => s.addElement);

  const updateScale = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    setScale(getCanvasFitScale(vp.clientWidth));
  }, []);

  useEffect(() => {
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [updateScale]);

  const handleDrop = useCallback(
    (payload: PanelDragPayload, x: number, y: number) => {
      if (payload.type === "frame") {
        const def = getFrameDef(payload.frameIndex);
        if (!def) return;
        const size = defaultFrameSize(def);
        addElement({
          type: "frame",
          frameIndex: payload.frameIndex,
          x: x - size.width / 2,
          y: y - size.height / 2,
          width: size.width,
          height: size.height,
          zIndex: 3,
        });
      } else {
        const def = getSpectatorDef(payload.spectatorIndex);
        if (!def) return;
        const size = defaultSpectatorSize(def);
        addElement({
          type: "spectator",
          spectatorIndex: payload.spectatorIndex,
          x: x - size.width / 2,
          y: y - size.height / 2,
          width: size.width,
          height: size.height,
          zIndex: 2,
        });
      }
    },
    [addElement]
  );

  const { startDrag, cancelDrag } = useDragFromPanel({
    canvasRef: showExpanded ? expandedCanvasRef : canvasRef,
    scale: showExpanded ? expandedScale : scale,
    onDrop: handleDrop,
  });

  return (
    <div className="museum-editor">
      <Sidebar onStartDrag={startDrag} />
      <div className="museum-canvas-area museum-canvas-area--editor" ref={viewportRef}>
        <button
          type="button"
          className="museum-expand-btn"
          onClick={() => setShowExpanded(true)}
          aria-label="Ampliar cenário do museu"
          title="Ampliar cenário"
        >
          ⛶ Ampliar
        </button>
        <div
          className="museum-canvas-stage"
          style={{
            width: "100%",
            aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {!showExpanded && (
            <MuseumCanvas
              scale={scale}
              embedded
              showTitleBar
              canvasRef={canvasRef}
              exportRef={exportRef}
              onCancelPanelDrag={cancelDrag}
            />
          )}
        </div>
      </div>
      {showExpanded && (
        <MuseumExpandModal
          canvasRef={expandedCanvasRef}
          exportRef={exportRef}
          onScaleChange={setExpandedScale}
          onCancelPanelDrag={cancelDrag}
          onClose={() => setShowExpanded(false)}
        />
      )}
    </div>
  );
}
