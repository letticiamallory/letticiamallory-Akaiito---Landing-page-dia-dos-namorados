"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChocolatesData } from "@/lib/gift-types";
import {
  BOX_SLOTS,
  CANVAS_H,
  CANVAS_W,
  CHOCOLATE_ASSETS,
  getChocolateType,
} from "@/data/chocolate-catalog";
import { getCanvasScale } from "@/lib/chocolate-canvas-utils";
import { CAMERA_GIFT_ARROW } from "@/lib/camera-assets";
import { useChocolateStore } from "@/store/chocolate.store";
import { ChocolateSprite } from "./chocolate-sprite";
import "./chocolate-box.css";

export function ChocolateViewer({
  data,
  embedded = false,
  initialOpened = false,
  frozen = false,
}: {
  data: ChocolatesData;
  embedded?: boolean;
  /** Marketing mockup — caixa já aberta */
  initialOpened?: boolean;
  /** Desativa interação (print estático) */
  frozen?: boolean;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);
  const [opened, setOpened] = useState(initialOpened);
  const [animating, setAnimating] = useState(false);

  const loadPlacements = useChocolateStore((s) => s.loadPlacements);
  const biteInSlot = useChocolateStore((s) => s.biteInSlot);
  const placements = useChocolateStore((s) => s.placements);
  const loadedKeyRef = useRef<string | null>(null);

  const loadKey = useMemo(
    () =>
      JSON.stringify({
        placements: data.placements ?? [],
        boxTitle: data.boxTitle ?? "",
        coupleName: data.coupleName ?? "",
        senderName: data.senderName ?? "",
        receiverName: data.receiverName ?? "",
      }),
    [
      data.placements,
      data.boxTitle,
      data.coupleName,
      data.senderName,
      data.receiverName,
    ]
  );

  useEffect(() => {
    if (loadedKeyRef.current === loadKey) return;
    loadedKeyRef.current = loadKey;

    const payload = JSON.parse(loadKey) as {
      placements: ChocolatesData["placements"];
      boxTitle: string;
      coupleName: string;
      senderName: string;
      receiverName: string;
    };

    loadPlacements(payload.placements ?? [], {
      boxTitle: payload.boxTitle || "Caixa de Chocolates",
      coupleName:
        payload.coupleName ||
        `${payload.senderName} & ${payload.receiverName}`,
    });
  }, [loadKey, loadPlacements]);

  const updateScale = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const maxW = Math.min(vp.clientWidth - 32, 720);
    const maxH = Math.min(vp.clientHeight - (embedded ? 72 : 120), 560);
    setScale(getCanvasScale(maxW, maxH));
  }, [embedded]);

  useEffect(() => {
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [updateScale]);

  const handleOpen = () => {
    if (opened || animating) return;
    setAnimating(true);
    setOpened(true);
    window.setTimeout(() => setAnimating(false), 1200);
  };

  const placementBySlot = new Map(placements.map((p) => [p.slotIndex, p]));
  const displayW = CANVAS_W * scale;
  const displayH = CANVAS_H * scale;

  const sceneContent = (
    <>
      <div className="chocolate-box-layer" style={{ width: displayW, height: displayH }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={CHOCOLATE_ASSETS.box}
          alt=""
          width={displayW}
          height={displayH}
          draggable={false}
        />

        <div
          className={`chocolate-placements-layer ${opened ? "chocolate-placements-layer--visible" : ""}`}
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {BOX_SLOTS.map((slot) => {
            const placement = placementBySlot.get(slot.index);
            const type = placement ? getChocolateType(placement.chocolateIndex) : null;
            if (!type) return null;
            const biteStage = placement?.biteStage ?? 0;
            return (
              <button
                key={slot.index}
                type="button"
                className="chocolate-viewer-bite"
                style={{
                  left: slot.x + slot.width / 2,
                  top: slot.y + slot.height * 0.52,
                  width: slot.width * 0.58,
                  height: slot.height * 0.58,
                }}
                onClick={() => opened && !frozen && biteInSlot(slot.index)}
                aria-label={`Mordiscar ${type.name}`}
              >
                <ChocolateSprite type={type} biteStage={biteStage} />
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`chocolate-lid-wrap ${opened ? "chocolate-lid-wrap--open" : ""}`}
        style={{ width: displayW, height: displayH }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={CHOCOLATE_ASSETS.lid}
          alt=""
          width={displayW}
          height={displayH}
          draggable={false}
        />
      </div>
    </>
  );

  return (
    <div className={`chocolate-viewer${embedded ? " chocolate-viewer--embedded" : ""}`}>
      {!embedded && (
        <header className="chocolate-viewer-header">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--text-dim)] mb-2">
            {data.boxTitle || "Caixa de Chocolates"}
          </p>
          <h1 className="font-display text-2xl font-bold">
            {data.coupleName || `${data.senderName} & ${data.receiverName}`}
          </h1>
          {data.message && (
            <p className="text-sm text-[var(--text-muted)] mt-3 max-w-md mx-auto italic font-serif">
              {data.message}
            </p>
          )}
        </header>
      )}

      <div className="chocolate-viewer-stage" ref={viewportRef}>
        <div
          className={`chocolate-open-hint ${opened ? "chocolate-open-hint--opened" : ""}`}
          aria-live="polite"
        >
          {!opened ? (
            <>
              <span className="chocolate-open-hint__label">abra a caixa</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={CAMERA_GIFT_ARROW}
                alt=""
                className="chocolate-open-hint__arrow"
                draggable={false}
              />
            </>
          ) : (
            <span className="chocolate-open-hint__label">toque para degustar os chocolates</span>
          )}
        </div>

        <div className="chocolate-scene" style={{ width: displayW, height: displayH }}>
          {sceneContent}
          {!opened && (
            <button
              type="button"
              className="chocolate-scene-open"
              onClick={handleOpen}
              aria-label="Abrir caixa de chocolates"
            />
          )}
        </div>
      </div>
    </div>
  );
}
