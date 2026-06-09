"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  defaultFrameSize,
  defaultSpectatorSize,
  FRAME_DATA,
  getFrameDef,
  getSpectatorDef,
  SPECTATOR_DATA,
} from "@/data/museum-frames";
import { MUSEUM_ASSETS } from "@/data/museum-frames";
import { getCanvasFitScale } from "@/lib/museum-canvas-utils";
import { preloadImage } from "@/lib/present-preload";
import { useDragFromPanel, type PanelDragPayload } from "@/hooks/useDragFromPanel";
import { useMuseumStore } from "@/store/museum.store";
import { Sidebar } from "./Sidebar";
import { MuseumCanvas } from "./MuseumCanvas";
import { MuseumExpandModal } from "./MuseumExpandModal";
import { MuseumEditorSkeleton } from "./MuseumEditorSkeleton";
import "./museum-editor.css";

function collectEditorAssetUrls(elements: ReturnType<typeof useMuseumStore.getState>["elements"]) {
  const urls = new Set<string>([
    MUSEUM_ASSETS.backgroundLite,
    MUSEUM_ASSETS.background,
    ...FRAME_DATA.map((f) => f.file),
    ...SPECTATOR_DATA.map((s) => s.file),
  ]);

  for (const el of elements) {
    if (el.type === "frame") {
      if (el.photoUrl) urls.add(el.photoUrl);
      if (el.frameIndex) {
        const file = getFrameDef(el.frameIndex)?.file;
        if (file) urls.add(file);
      }
    } else if (el.type === "spectator" && el.spectatorIndex) {
      const file = getSpectatorDef(el.spectatorIndex)?.file;
      if (file) urls.add(file);
    }
  }

  return [...urls];
}

export function MuseumEditor() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const expandedCanvasRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [expandedScale, setExpandedScale] = useState(1);
  const [showExpanded, setShowExpanded] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  const elements = useMuseumStore((s) => s.elements);
  const addElement = useMuseumStore((s) => s.addElement);

  const updateScale = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const next = getCanvasFitScale(vp.clientWidth);
    if (next > 0) setScale(next);
  }, []);

  useLayoutEffect(() => {
    updateScale();
  }, [updateScale]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
      if (cancelled) return;

      const urls = collectEditorAssetUrls(useMuseumStore.getState().elements);
      await Promise.all(urls.map((url) => preloadImage(url)));
      if (!cancelled) setSceneReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!sceneReady) return;
    for (const url of collectEditorAssetUrls(elements)) {
      void preloadImage(url);
    }
  }, [elements, sceneReady]);

  useEffect(() => {
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [updateScale, sceneReady]);

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
        {sceneReady && (
          <button
            type="button"
            className="museum-expand-btn"
            onClick={() => setShowExpanded(true)}
            aria-label="Ampliar cenário do museu"
            title="Ampliar cenário"
          >
            ⛶ Ampliar
          </button>
        )}
        <div className="museum-canvas-stage museum-canvas-stage--editor">
          {!showExpanded &&
            (sceneReady ? (
              <MuseumCanvas
                scale={scale}
                embedded
                showTitleBar
                canvasRef={canvasRef}
                exportRef={exportRef}
                onCancelPanelDrag={cancelDrag}
              />
            ) : (
              <MuseumEditorSkeleton />
            ))}
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
