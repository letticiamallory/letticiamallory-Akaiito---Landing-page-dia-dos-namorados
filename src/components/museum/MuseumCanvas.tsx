"use client";

import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import {
  CANVAS_H,
  CANVAS_W,
  MUSEUM_ASSETS,
  MUSEUM_TITLE_PLAQUE,
} from "@/data/museum-frames";
import { useMuseumStore } from "@/store/museum.store";
import { useDragOnCanvas } from "@/hooks/useDragOnCanvas";
import { useResize } from "@/hooks/useResize";
import { FrameInstance } from "./FrameInstance";
import { SpectatorInstance } from "./SpectatorInstance";
import { SelectionHandles } from "./SelectionHandles";

export function MuseumCanvas({
  scale,
  editable = true,
  embedded = false,
  showTitleBar = true,
  canvasRef,
  exportRef,
  onCancelPanelDrag,
}: {
  scale: number;
  editable?: boolean;
  embedded?: boolean;
  showTitleBar?: boolean;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  exportRef?: React.RefObject<HTMLDivElement | null>;
  onCancelPanelDrag?: () => void;
}) {
  const elements = useMuseumStore((s) => s.elements);
  const selectedId = useMuseumStore((s) => s.selectedId);
  const museumDate = useMuseumStore((s) => s.museumDate);
  const updateElement = useMuseumStore((s) => s.updateElement);
  const removeElement = useMuseumStore((s) => s.removeElement);
  const selectElement = useMuseumStore((s) => s.selectElement);
  const reorder = useMuseumStore((s) => s.reorder);

  useEffect(() => {
    if (!editable) return;
    function onKey(e: KeyboardEvent) {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        removeElement(selectedId);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editable, selectedId, removeElement]);

  const { startDrag: startCanvasDrag } = useDragOnCanvas({
    scale,
    onMove: (id, x, y) => updateElement(id, { x, y }),
  });

  const { startResize } = useResize({
    scale,
    onResize: (id, width, height) => updateElement(id, { width, height }),
  });

  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      (canvasRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (exportRef) {
        (exportRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [canvasRef, exportRef]
  );

  return (
    <div
        ref={setRefs}
        className={`museum-canvas${embedded ? " museum-canvas--embedded" : ""}`}
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          ...(embedded ? { zoom: scale } : { transform: `scale(${scale})` }),
        } as CSSProperties}
        onClick={() => editable && selectElement(null)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MUSEUM_ASSETS.background} alt="" className="museum-canvas-bg" draggable={false} />

        {sorted.map((el) => {
          const selected = el.id === selectedId;
          const rect = canvasRef.current?.getBoundingClientRect();

          return (
            <div
              key={el.id}
              className={`museum-element${selected ? " museum-element--selected" : ""}`}
              style={{
                left: el.x,
                top: el.y,
                width: el.width,
                height: el.height,
                zIndex: selected ? 999 : el.zIndex,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (editable) selectElement(el.id);
              }}
              onMouseDown={(e) => {
                if (!editable || !rect) return;
                onCancelPanelDrag?.();
                startCanvasDrag(e, el, rect);
              }}
              onTouchStart={(e) => {
                if (!editable || !rect) return;
                onCancelPanelDrag?.();
                startCanvasDrag(e, el, rect);
              }}
            >
              {el.type === "frame" ? (
                <FrameInstance
                  element={el}
                  editable={editable}
                  onPhotoChange={(url) => updateElement(el.id, { photoUrl: url })}
                />
              ) : (
                <SpectatorInstance element={el} />
              )}
              {editable && selected && rect && (
                <SelectionHandles
                  onDelete={() => removeElement(el.id)}
                  onResizeStart={(e) => startResize(e, el, rect)}
                  onLayerUp={() => reorder(el.id, "up")}
                  onLayerDown={() => reorder(el.id, "down")}
                />
              )}
            </div>
          );
        })}

        <div className="museum-canvas-title">
          {showTitleBar && !MUSEUM_ASSETS.builtInTitleBar && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={MUSEUM_ASSETS.titleSection} alt="" draggable={false} />
          )}
          {showTitleBar && museumDate ? (
            <span
              className="museum-date-overlay"
              style={{
                top: MUSEUM_TITLE_PLAQUE.dateTop,
                fontSize: MUSEUM_TITLE_PLAQUE.dateSize,
              }}
            >
              {museumDate}
            </span>
          ) : null}
        </div>
      </div>
  );
}
