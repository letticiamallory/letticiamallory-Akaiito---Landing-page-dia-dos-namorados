"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import couple1 from "@/assets/demo/couple-1.jpg";
import couple2 from "@/assets/demo/couple-2.jpg";
import couple5 from "@/assets/demo/couple-5.jpg";
import { FrameInstance } from "@/components/museum/FrameInstance";
import { SpectatorInstance } from "@/components/museum/SpectatorInstance";
import {
  CANVAS_H,
  MUSEUM_ASSETS,
  SPECTATOR_DATA,
  getFrameDef,
  getSpectatorDef,
} from "@/data/museum-frames";
import type { MuseumElement } from "@/lib/gift-types";
import { preloadMuseumEditorDemoAssets } from "@/lib/museum-editor-demo-preload";
import "@/components/museum/museum-editor.css";
import "./museum-editor-demo.css";

const EDITOR_W = 800;
const SIDEBAR_OFFSET = 120;
const DEMO_CANVAS_W = 680;
/** Viewport mais horizontal (680×400), como no layout original */
const DEMO_CANVAS_H = 400;
const EDITOR_H = DEMO_CANVAS_H;
const CHANDELIER_CLIP = `inset(0 ${((1728 - 1005) / 1728) * 100}% ${100 - (307 / CANVAS_H) * 100}% ${(724 / 1728) * 100}%)`;

const FRAME_PHOTO_MAP: Record<number, string> = {
  1: couple1.src,
  2: couple5.src,
  5: couple2.src,
};

/** Coordenadas no canvas 680×400 — quadros mais baixos na parede */
const FRAME_POSITIONS: Record<number, { x: number; y: number; width: number }> = {
  1: { x: 30, y: 105, width: 160 },
  5: { x: 230, y: 112, width: 180 },
  2: { x: 440, y: 88, width: 140 },
};

const SPECTATOR_POSITION = {
  x: 150,
  y: 288,
  width: 300,
};
const SPECTATOR_ID = 2;
const SIDEBAR_FRAMES = [1, 5, 2] as const;

type SequenceStep = {
  t: number;
  cursorX?: number;
  cursorY?: number;
  action:
    | "hover"
    | "grab"
    | "dragging"
    | "drop"
    | "reveal"
    | "click"
    | "addSpectator"
    | "complete"
    | "reset";
  frameId?: number;
  spectator?: boolean;
};

function frameHeight(frameId: number, width: number) {
  const def = getFrameDef(frameId);
  if (!def) return width;
  return (width * def.vh) / def.vw;
}

function buildFrameElement(
  frameId: number,
  pos: { x: number; y: number; width: number },
  photoUrl?: string
): MuseumElement {
  const height = frameHeight(frameId, pos.width);
  return {
    id: `editor-demo-frame-${frameId}`,
    type: "frame",
    frameIndex: frameId,
    x: pos.x,
    y: pos.y,
    width: pos.width,
    height,
    zIndex: 3,
    photoUrl,
  };
}

function dropCursor(frameId: number) {
  const pos = FRAME_POSITIONS[frameId];
  const height = frameHeight(frameId, pos.width);
  return {
    x: SIDEBAR_OFFSET + pos.x + pos.width / 2,
    y: pos.y + height / 2,
  };
}

const DROP_1 = dropCursor(1);
const DROP_5 = dropCursor(5);
const DROP_2 = dropCursor(2);
const SPECTATOR_CURSOR = { x: 60, y: 350 };

const SEQUENCE: SequenceStep[] = [
  { t: 500, cursorX: 60, cursorY: 80, action: "hover", frameId: 1 },
  { t: 1000, cursorX: 60, cursorY: 80, action: "grab", frameId: 1 },
  { t: 1800, cursorX: DROP_1.x, cursorY: DROP_1.y, action: "dragging", frameId: 1 },
  { t: 2200, cursorX: DROP_1.x, cursorY: DROP_1.y, action: "drop", frameId: 1 },
  { t: 2400, action: "reveal", frameId: 1 },
  { t: 3000, cursorX: 60, cursorY: 140, action: "hover", frameId: 5 },
  { t: 3400, cursorX: 60, cursorY: 140, action: "grab", frameId: 5 },
  { t: 4200, cursorX: DROP_5.x, cursorY: DROP_5.y, action: "dragging", frameId: 5 },
  { t: 4600, cursorX: DROP_5.x, cursorY: DROP_5.y, action: "drop", frameId: 5 },
  { t: 4800, action: "reveal", frameId: 5 },
  { t: 5400, cursorX: 60, cursorY: 200, action: "hover", frameId: 2 },
  { t: 5800, cursorX: 60, cursorY: 200, action: "grab", frameId: 2 },
  { t: 6600, cursorX: DROP_2.x, cursorY: DROP_2.y, action: "dragging", frameId: 2 },
  { t: 7000, cursorX: DROP_2.x, cursorY: DROP_2.y, action: "drop", frameId: 2 },
  { t: 7200, action: "reveal", frameId: 2 },
  { t: 7800, cursorX: SPECTATOR_CURSOR.x, cursorY: SPECTATOR_CURSOR.y, action: "hover", spectator: true },
  { t: 8200, cursorX: SPECTATOR_CURSOR.x, cursorY: SPECTATOR_CURSOR.y, action: "click", spectator: true },
  { t: 8600, action: "addSpectator" },
  { t: 10000, action: "complete" },
  { t: 12000, action: "reset" },
];

function AnimatedCursor({
  x,
  y,
  grabbing,
}: {
  x: number;
  y: number;
  grabbing: boolean;
}) {
  return (
    <div
      className={`museum-editor-demo__cursor${grabbing ? " museum-editor-demo__cursor--grabbing" : ""}`}
      style={{ left: x, top: y, transform: "translate(-4px, -4px)" }}
      aria-hidden
    >
      <svg width="20" height="20" viewBox="0 0 20 20">
        <path
          d="M4 2L16 10L10 11L7 17L4 2Z"
          fill="white"
          stroke="#333"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

function DemoFrame({
  frameId,
  pos,
  revealed,
  justDropped,
}: {
  frameId: number;
  pos: { x: number; y: number; width: number };
  revealed: boolean;
  justDropped: boolean;
}) {
  const element = buildFrameElement(
    frameId,
    pos,
    revealed ? FRAME_PHOTO_MAP[frameId] : undefined
  );

  return (
    <div
      className={`museum-element museum-editor-demo__frame${justDropped ? " museum-editor-demo__frame--drop" : ""}`}
      style={{
        left: pos.x,
        top: pos.y,
        width: pos.width,
        height: element.height,
        zIndex: 3,
      }}
    >
      <FrameInstance element={element} editable={false} />
    </div>
  );
}

export function MuseumEditorDemo() {
  const observeRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  const cycleRef = useRef(0);

  const [active, setActive] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [scale, setScale] = useState(1);
  const [cursorX, setCursorX] = useState(60);
  const [cursorY, setCursorY] = useState(80);
  const [isDragging, setIsDragging] = useState(false);
  const [dragFrameId, setDragFrameId] = useState<number | null>(null);
  const [droppedFrames, setDroppedFrames] = useState<number[]>([]);
  const [revealedFrames, setRevealedFrames] = useState<number[]>([]);
  const [justDroppedId, setJustDroppedId] = useState<number | null>(null);
  const [showSpectator, setShowSpectator] = useState(false);
  const [hoverFrameId, setHoverFrameId] = useState<number | null>(null);
  const [hoveringSpectator, setHoveringSpectator] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void preloadMuseumEditorDemoAssets().then(() => {
      if (!cancelled) setAssetsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const node = observeRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "120px", threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const updateScale = useCallback(() => {
    const el = observeRef.current;
    if (!el) return;
    setScale(el.clientWidth / EDITOR_W);
  }, []);

  useEffect(() => {
    if (!active) return;
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (observeRef.current) ro.observe(observeRef.current);
    return () => ro.disconnect();
  }, [active, updateScale]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(window.clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const applyStep = useCallback((step: SequenceStep) => {
    if (step.cursorX !== undefined) setCursorX(step.cursorX);
    if (step.cursorY !== undefined) setCursorY(step.cursorY);

    switch (step.action) {
      case "hover":
        setHoverFrameId(step.frameId ?? null);
        setHoveringSpectator(!!step.spectator);
        setIsDragging(false);
        setDragFrameId(null);
        break;
      case "grab":
        setIsDragging(true);
        setDragFrameId(step.frameId ?? null);
        setHoverFrameId(step.frameId ?? null);
        break;
      case "dragging":
        setIsDragging(true);
        setDragFrameId(step.frameId ?? null);
        break;
      case "drop":
        setIsDragging(false);
        setDragFrameId(null);
        setHoverFrameId(null);
        if (step.frameId !== undefined) {
          setJustDroppedId(step.frameId);
          setDroppedFrames((prev) =>
            prev.includes(step.frameId!) ? prev : [...prev, step.frameId!]
          );
          window.setTimeout(() => setJustDroppedId(null), 600);
        }
        break;
      case "reveal":
        if (step.frameId !== undefined) {
          setRevealedFrames((prev) =>
            prev.includes(step.frameId!) ? prev : [...prev, step.frameId!]
          );
        }
        break;
      case "click":
        setHoveringSpectator(true);
        break;
      case "addSpectator":
        setShowSpectator(true);
        setHoveringSpectator(false);
        break;
      case "reset":
        setIsResetting(true);
        break;
      default:
        break;
    }
  }, []);

  const startCycle = useCallback(() => {
    clearTimeouts();
    const cycleId = ++cycleRef.current;

    SEQUENCE.forEach((step) => {
      const id = window.setTimeout(() => {
        if (cycleRef.current !== cycleId) return;
        applyStep(step);

        if (step.action === "reset") {
          window.setTimeout(() => {
            if (cycleRef.current !== cycleId) return;
            setDroppedFrames([]);
            setRevealedFrames([]);
            setShowSpectator(false);
            setHoverFrameId(null);
            setHoveringSpectator(false);
            setIsDragging(false);
            setDragFrameId(null);
            setCursorX(60);
            setCursorY(80);
            setIsResetting(false);
            startCycle();
          }, 300);
        }
      }, step.t);
      timeoutsRef.current.push(id);
    });
  }, [applyStep, clearTimeouts]);

  useEffect(() => {
    if (!active || !assetsReady) return;
    startCycle();
    return clearTimeouts;
  }, [active, assetsReady, startCycle, clearTimeouts]);

  const spectatorHeight = (() => {
    const def = getSpectatorDef(SPECTATOR_ID);
    if (!def) return 100;
    return (SPECTATOR_POSITION.width * def.vh) / def.vw;
  })();

  const spectatorEl: MuseumElement = {
    id: "editor-demo-spectator",
    type: "spectator",
    spectatorIndex: SPECTATOR_ID,
    x: SPECTATOR_POSITION.x,
    y: SPECTATOR_POSITION.y,
    width: SPECTATOR_POSITION.width,
    height: spectatorHeight,
    zIndex: 4,
  };

  const dragGhostWidth = dragFrameId
    ? Math.min(FRAME_POSITIONS[dragFrameId]?.width ?? 100, 90)
    : 90;

  return (
    <div
      ref={observeRef}
      className={`museum-editor-demo${isResetting ? " museum-editor-demo--resetting" : ""}${!active ? " museum-editor-demo--placeholder" : ""}`}
      style={{ height: active ? EDITOR_H * scale : 220 }}
    >
      {active && assetsReady && (
        <div
          className="museum-editor-demo__stage"
          style={{
            width: EDITOR_W,
            height: EDITOR_H,
            transform: `scale(${scale})`,
          }}
        >
          <aside className="museum-editor-demo__sidebar">
            <p className="museum-editor-demo__sidebar-label">Quadros</p>
            {SIDEBAR_FRAMES.map((frameId) => {
              const def = getFrameDef(frameId);
              const isHovered = hoverFrameId === frameId;
              const isOnCanvas = droppedFrames.includes(frameId);
              return (
                <div
                  key={frameId}
                  className={`museum-editor-demo__sidebar-item${isHovered ? " museum-editor-demo__sidebar-item--hover" : ""}`}
                  style={{ opacity: isOnCanvas && !isDragging ? 0.35 : 1 }}
                >
                  {def && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={def.file} alt="" draggable={false} />
                  )}
                </div>
              );
            })}
            <div
              className={[
                "museum-editor-demo__sidebar-item",
                "museum-editor-demo__sidebar-item--spectator",
                hoveringSpectator ? "museum-editor-demo__sidebar-item--hover" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ opacity: showSpectator ? 0.35 : 1 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SPECTATOR_DATA[1]?.file ?? "/museum/spectator-2.svg"}
                alt=""
                draggable={false}
              />
            </div>
          </aside>

          <div className="museum-editor-demo__canvas" style={{ height: DEMO_CANVAS_H }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MUSEUM_ASSETS.background}
              alt=""
              className="museum-editor-demo__canvas-bg"
              draggable={false}
            />

            <div className="museum-editor-demo__canvas-content">
              {droppedFrames.map((frameId) => {
                const pos = FRAME_POSITIONS[frameId];
                if (!pos) return null;
                return (
                  <DemoFrame
                    key={frameId}
                    frameId={frameId}
                    pos={pos}
                    revealed={revealedFrames.includes(frameId)}
                    justDropped={justDroppedId === frameId}
                  />
                );
              })}

              {showSpectator && (
                <div
                  className="museum-element museum-editor-demo__spectator"
                  style={{
                    left: SPECTATOR_POSITION.x,
                    top: SPECTATOR_POSITION.y,
                    width: SPECTATOR_POSITION.width,
                    height: spectatorHeight,
                    zIndex: 4,
                  }}
                >
                  <SpectatorInstance element={spectatorEl} />
                </div>
              )}
            </div>

            {/* Lustre acima dos quadros */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MUSEUM_ASSETS.background}
              alt=""
              className="museum-editor-demo__canvas-fg"
              style={{ clipPath: CHANDELIER_CLIP }}
              draggable={false}
            />
          </div>

          {isDragging && dragFrameId !== null && (
            <div
              className="museum-editor-demo__drag-ghost"
              style={{
                left: cursorX - dragGhostWidth * 0.4,
                top: cursorY - frameHeight(dragFrameId, dragGhostWidth) * 0.35,
                width: dragGhostWidth,
                height: frameHeight(dragFrameId, dragGhostWidth),
              }}
            >
              <FrameInstance
                element={buildFrameElement(dragFrameId, {
                  x: 0,
                  y: 0,
                  width: dragGhostWidth,
                })}
                editable={false}
              />
            </div>
          )}

          <AnimatedCursor x={cursorX} y={cursorY} grabbing={isDragging} />
        </div>
      )}
    </div>
  );
}
