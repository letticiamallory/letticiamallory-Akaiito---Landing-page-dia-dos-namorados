"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BouquetPreview } from "@/components/bouquet/bouquet-preview";
import type { BouquetConfig, MainFlowerId, SupportFlowerId } from "@/lib/bouquet-catalog";
import {
  DEFAULT_BOUQUET,
  MAIN_FLOWERS,
  SUPPORT_FLOWERS,
} from "@/lib/bouquet-catalog";
import "./bouquet-editor-demo.css";

const EDITOR_W = 800;
const EDITOR_H = 400;
const SIDEBAR_W = 120;

const MAIN_IDS = Object.keys(MAIN_FLOWERS) as MainFlowerId[];
const SUPPORT_IDS = Object.keys(SUPPORT_FLOWERS) as SupportFlowerId[];

const MAIN_CURSOR_Y: Record<MainFlowerId, number> = {
  roses: 48,
  lilies: 88,
  poppies: 128,
  sunflowers: 168,
};

const SUPPORT_CURSOR_Y: Record<SupportFlowerId, number> = {
  clovers: 238,
  daisies: 278,
  primroses: 318,
  violets: 358,
};

type SequenceStep = {
  t: number;
  cursorX?: number;
  cursorY?: number;
  action:
    | "hover"
    | "click"
    | "selectMain"
    | "selectSupport"
    | "complete"
    | "reset";
  mainId?: MainFlowerId;
  supportId?: SupportFlowerId;
};

const SEQUENCE: SequenceStep[] = [
  { t: 400, cursorX: 58, cursorY: MAIN_CURSOR_Y.roses, action: "hover", mainId: "roses" },
  { t: 900, cursorX: 58, cursorY: MAIN_CURSOR_Y.roses, action: "click", mainId: "roses" },
  { t: 1000, action: "selectMain", mainId: "roses" },
  { t: 1700, cursorX: 58, cursorY: SUPPORT_CURSOR_Y.daisies, action: "hover", supportId: "daisies" },
  { t: 2200, cursorX: 58, cursorY: SUPPORT_CURSOR_Y.daisies, action: "click", supportId: "daisies" },
  { t: 2300, action: "selectSupport", supportId: "daisies" },
  { t: 6000, action: "complete" },
  { t: 7500, action: "reset" },
];

function AnimatedCursor({
  x,
  y,
  clicking,
}: {
  x: number;
  y: number;
  clicking: boolean;
}) {
  return (
    <div
      className={`bouquet-editor-demo__cursor${clicking ? " bouquet-editor-demo__cursor--clicking" : ""}`}
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

export function BouquetEditorDemo() {
  const observeRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  const cycleRef = useRef(0);

  const [active, setActive] = useState(false);
  const [scale, setScale] = useState(1);
  const [cursorX, setCursorX] = useState(58);
  const [cursorY, setCursorY] = useState(MAIN_CURSOR_Y.roses);
  const [clicking, setClicking] = useState(false);
  const [hoverMainId, setHoverMainId] = useState<MainFlowerId | null>(null);
  const [hoverSupportId, setHoverSupportId] = useState<SupportFlowerId | null>(null);
  const [selectedMainId, setSelectedMainId] = useState<MainFlowerId | null>(null);
  const [selectedSupportId, setSelectedSupportId] = useState<SupportFlowerId | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const showBouquet = Boolean(selectedMainId && selectedSupportId);
  const bouquetConfig: BouquetConfig | null = showBouquet
    ? {
        mainFlowerId: selectedMainId!,
        supportFlowerId: selectedSupportId!,
        wrapperId: DEFAULT_BOUQUET.wrapperId,
        tieId: DEFAULT_BOUQUET.tieId,
      }
    : null;

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
        setHoverMainId(step.mainId ?? null);
        setHoverSupportId(step.supportId ?? null);
        setClicking(false);
        break;
      case "click":
        setClicking(true);
        window.setTimeout(() => setClicking(false), 200);
        break;
      case "selectMain":
        if (step.mainId) setSelectedMainId(step.mainId);
        setHoverMainId(null);
        break;
      case "selectSupport":
        if (step.supportId) setSelectedSupportId(step.supportId);
        setHoverSupportId(null);
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
            setSelectedMainId(null);
            setSelectedSupportId(null);
            setHoverMainId(null);
            setHoverSupportId(null);
            setClicking(false);
            setCursorX(58);
            setCursorY(MAIN_CURSOR_Y.roses);
            setIsResetting(false);
            startCycle();
          }, 300);
        }
      }, step.t);
      timeoutsRef.current.push(id);
    });
  }, [applyStep, clearTimeouts]);

  useEffect(() => {
    if (!active) return;
    startCycle();
    return clearTimeouts;
  }, [active, startCycle, clearTimeouts]);

  const bouquetLabel = bouquetConfig
    ? `${MAIN_FLOWERS[bouquetConfig.mainFlowerId].name} + ${SUPPORT_FLOWERS[bouquetConfig.supportFlowerId].name}`
    : null;

  return (
    <div
      ref={observeRef}
      className={`bouquet-editor-demo${isResetting ? " bouquet-editor-demo--resetting" : ""}${!active ? " bouquet-editor-demo--placeholder" : ""}`}
      style={{ height: active ? EDITOR_H * scale : 220 }}
    >
      {active && (
        <div
          className="bouquet-editor-demo__stage"
          style={{
            width: EDITOR_W,
            height: EDITOR_H,
            transform: `scale(${scale})`,
          }}
        >
          <aside className="bouquet-editor-demo__sidebar">
            <p className="bouquet-editor-demo__sidebar-label">Principal</p>
            {MAIN_IDS.map((id) => (
              <div
                key={id}
                className={[
                  "bouquet-editor-demo__sidebar-item",
                  hoverMainId === id ? "bouquet-editor-demo__sidebar-item--hover" : "",
                  selectedMainId === id ? "bouquet-editor-demo__sidebar-item--selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={MAIN_FLOWERS[id].thumb} alt="" draggable={false} />
              </div>
            ))}

            <div className="bouquet-editor-demo__sidebar-divider" />

            <p className="bouquet-editor-demo__sidebar-label">Apoio</p>
            {SUPPORT_IDS.map((id) => (
              <div
                key={id}
                className={[
                  "bouquet-editor-demo__sidebar-item",
                  hoverSupportId === id ? "bouquet-editor-demo__sidebar-item--hover" : "",
                  selectedSupportId === id ? "bouquet-editor-demo__sidebar-item--selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={SUPPORT_FLOWERS[id].thumb} alt="" draggable={false} />
              </div>
            ))}
          </aside>

          <div className="bouquet-editor-demo__canvas">
            <div className="bouquet-editor-demo__canvas-content">
              <div
                className={`bouquet-editor-demo__canvas-hint${showBouquet ? " bouquet-editor-demo__canvas-hint--hidden" : ""}`}
              >
                <span>Monte seu buquê</span>
              </div>

              {bouquetConfig && (
                <div className="bouquet-editor-demo__bouquet-stage" key={`${bouquetConfig.mainFlowerId}-${bouquetConfig.supportFlowerId}`}>
                  <span className="bouquet-editor-demo__bouquet-glow" aria-hidden />
                  <div className="bouquet-editor-demo__bouquet">
                    <BouquetPreview config={bouquetConfig} showLabel={false} />
                  </div>
                  {bouquetLabel && (
                    <p className="bouquet-editor-demo__bouquet-label">{bouquetLabel}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <AnimatedCursor x={cursorX} y={cursorY} clicking={clicking} />
        </div>
      )}
    </div>
  );
}
