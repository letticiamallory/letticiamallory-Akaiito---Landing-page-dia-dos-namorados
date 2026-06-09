"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { MuseuData } from "@/lib/gift-types";
import { CANVAS_H, CANVAS_W, MUSEUM_ASSETS, getFrameDef, getSpectatorDef } from "@/data/museum-frames";
import { isImagePreloaded, preloadImage } from "@/lib/present-preload";
import { getCanvasFitScale, getCanvasScale } from "@/lib/museum-canvas-utils";
import { useMuseumStore } from "@/store/museum.store";
import { MuseumCanvas } from "./MuseumCanvas";
import { MuseumExpandModal } from "./MuseumExpandModal";
import "./museum-editor.css";

export function MuseumViewer({ data, embedded = false }: { data: MuseuData; embedded?: boolean }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const expandedCanvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [showExpanded, setShowExpanded] = useState(false);
  const [sceneReady, setSceneReady] = useState(() =>
    isImagePreloaded(MUSEUM_ASSETS.background)
  );

  const loadFromElements = useMuseumStore((s) => s.loadFromElements);
  const reset = useMuseumStore((s) => s.reset);

  useEffect(() => {
    loadFromElements(data.elements ?? [], {
      museumTitle: data.museumTitle ?? "Museu de Nós",
      museumDate: data.museumDate,
      coupleName: data.coupleName ?? `${data.senderName} & ${data.receiverName}`,
    });
    return () => reset();
  }, [data, loadFromElements, reset]);

  const updateScale = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    setScale(
      embedded
        ? getCanvasFitScale(vp.clientWidth)
        : getCanvasScale(vp.clientWidth, vp.clientHeight)
    );
  }, [embedded]);

  useEffect(() => {
    let cancelled = false;
    const urls = new Set<string>([MUSEUM_ASSETS.background]);
    for (const el of data.elements ?? []) {
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
    Promise.all([...urls].map((url) => preloadImage(url))).then(() => {
      if (!cancelled) setSceneReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [data]);

  useEffect(() => {
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [updateScale, sceneReady]);

  return (
    <div
      className={
        embedded
          ? "museum-viewer museum-viewer--embedded"
          : "min-h-screen bg-[#0a0809] flex flex-col"
      }
    >
      {!embedded && (
        <header className="px-6 py-6 text-center border-b border-[var(--border)]">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--text-dim)] mb-2">
            {data.museumTitle || "Museu de Nós"}
          </p>
          <h1 className="font-display text-2xl font-bold">
            {data.coupleName || `${data.senderName} & ${data.receiverName}`}
          </h1>
          {data.museumDate && (
            <p className="text-sm text-[var(--text-muted)] mt-2">{data.museumDate}</p>
          )}
        </header>
      )}
      <div
        className={`museum-canvas-area${embedded ? " museum-canvas-area--fit museum-canvas-area--view" : ""}`}
        ref={viewportRef}
      >
        {embedded && (
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
        <div
          className={embedded ? "museum-canvas-stage" : undefined}
          style={
            embedded
              ? {
                  width: "100%",
                  aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
                  position: "relative",
                  overflow: "hidden",
                }
              : {
                  width: `${CANVAS_W * scale}px`,
                  height: `${CANVAS_H * scale}px`,
                  position: "relative",
                  overflow: "hidden",
                }
          }
        >
          {!showExpanded &&
            (sceneReady ? (
              <MuseumCanvas
                scale={scale}
                embedded={embedded}
                editable={false}
                showTitleBar={!embedded}
                canvasRef={canvasRef}
              />
            ) : (
              <div className="museum-viewer__preload" aria-hidden />
            ))}
        </div>
      </div>
      {showExpanded && (
        <MuseumExpandModal
          canvasRef={expandedCanvasRef}
          editable={false}
          onScaleChange={() => {}}
          onClose={() => setShowExpanded(false)}
        />
      )}
    </div>
  );
}
