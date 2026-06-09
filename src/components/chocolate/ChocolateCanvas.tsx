"use client";

import { useEffect } from "react";
import {
  BOX_SLOTS,
  CANVAS_H,
  CANVAS_W,
  CHOCOLATE_ASSETS,
  findSlotAt,
  getChocolateType,
} from "@/data/chocolate-catalog";
import { useChocolateStore } from "@/store/chocolate.store";
import { ChocolateSprite } from "./chocolate-sprite";

export function ChocolateCanvas({
  scale,
  editable = true,
  embedded = false,
  editorSlot = false,
  canvasRef,
  showSlots = true,
}: {
  scale: number;
  editable?: boolean;
  embedded?: boolean;
  /** Shell preenche o stage do editor (CSS) */
  editorSlot?: boolean;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  showSlots?: boolean;
}) {
  const placements = useChocolateStore((s) => s.placements);
  const selectedSlot = useChocolateStore((s) => s.selectedSlot);
  const biteInSlot = useChocolateStore((s) => s.biteInSlot);
  const removeFromSlot = useChocolateStore((s) => s.removeFromSlot);
  const selectSlot = useChocolateStore((s) => s.selectSlot);

  useEffect(() => {
    if (!editable) return;
    function onKey(e: KeyboardEvent) {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedSlot !== null) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        removeFromSlot(selectedSlot);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editable, selectedSlot, removeFromSlot]);

  const placementBySlot = new Map(placements.map((p) => [p.slotIndex, p]));
  const displayH = CANVAS_H * scale;
  const displayW = embedded ? Math.ceil(CANVAS_W * scale) : CANVAS_W * scale;

  const canvasInner = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={CHOCOLATE_ASSETS.box} alt="" className="chocolate-canvas-bg" draggable={false} />

      {showSlots &&
        BOX_SLOTS.map((slot) => {
          const placement = placementBySlot.get(slot.index);
          const type = placement ? getChocolateType(placement.chocolateIndex) : null;
          const selected = selectedSlot === slot.index;
          const filled = Boolean(placement);
          const biteStage = placement?.biteStage ?? 0;

          return (
            <div
              key={slot.index}
              className={[
                "chocolate-slot",
                filled ? "chocolate-slot--filled" : "chocolate-slot--empty",
                selected ? "chocolate-slot--selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                left: slot.x,
                top: slot.y,
                width: slot.width,
                height: slot.height,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!editable || !filled) return;
                biteInSlot(slot.index);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (editable && filled) removeFromSlot(slot.index);
              }}
              title={filled ? "Clique para mordiscar" : undefined}
            >
              {type && (
                <div className="chocolate-slot-content">
                  <ChocolateSprite type={type} biteStage={biteStage} />
                </div>
              )}
              {editable && selected && filled && (
                <button
                  type="button"
                  className="chocolate-slot-delete"
                  aria-label="Remover chocolate"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromSlot(slot.index);
                  }}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
    </>
  );

  if (embedded) {
    return (
      <div
        ref={canvasRef}
        className={`chocolate-canvas-shell chocolate-canvas-shell--embedded${
          editorSlot ? " chocolate-canvas-shell--editor-slot" : ""
        }`}
        style={editorSlot ? undefined : { width: displayW, height: displayH }}
        onClick={() => editable && selectSlot(null)}
      >
        <div
          className="chocolate-canvas chocolate-canvas--embedded"
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            transform: `scale(${scale})`,
          }}
        >
          {canvasInner}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={canvasRef}
      className="chocolate-canvas"
      style={{
        width: CANVAS_W,
        height: CANVAS_H,
        transform: `scale(${scale})`,
      }}
      onClick={() => editable && selectSlot(null)}
    >
      {canvasInner}
    </div>
  );
}

export function dropChocolateAt(x: number, y: number, chocolateIndex: number) {
  const slotIndex = findSlotAt(x, y);
  if (slotIndex === null) return false;
  useChocolateStore.getState().placeInSlot(slotIndex, chocolateIndex);
  return true;
}
