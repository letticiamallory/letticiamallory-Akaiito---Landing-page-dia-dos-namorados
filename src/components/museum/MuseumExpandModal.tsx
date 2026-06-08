"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CANVAS_H, CANVAS_W } from "@/data/museum-frames";
import { getCanvasScale } from "@/lib/museum-canvas-utils";
import { MuseumCanvas } from "./MuseumCanvas";

export function MuseumExpandModal({
  canvasRef,
  exportRef,
  editable = true,
  onScaleChange,
  onCancelPanelDrag,
  onClose,
}: {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  exportRef?: React.RefObject<HTMLDivElement | null>;
  editable?: boolean;
  onScaleChange: (scale: number) => void;
  onCancelPanelDrag?: () => void;
  onClose: () => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const updateScale = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const next = getCanvasScale(vp.clientWidth, vp.clientHeight);
    setScale(next);
    onScaleChange(next);
  }, [onScaleChange]);

  useEffect(() => {
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [updateScale]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const content = (
    <div
      className={`museum-expand-backdrop${editable ? "" : " museum-expand-backdrop--view"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Museu ampliado"
    >
      <div className="museum-expand-toolbar">
        {editable ? (
          <p className="museum-expand-hint">
            Visualização ampliada: arraste quadros, duplo clique para foto, × para excluir
          </p>
        ) : (
          <p className="museum-expand-hint museum-expand-hint--view">Museu de Nós</p>
        )}
        <button type="button" className="museum-expand-close" onClick={onClose}>
          Fechar
        </button>
      </div>
      <div className="museum-expand-viewport" ref={viewportRef}>
        <div
          className="museum-expand-stage"
          style={{
            width: `${CANVAS_W * scale}px`,
            height: `${CANVAS_H * scale}px`,
            position: "relative",
          }}
        >
          <MuseumCanvas
            scale={scale}
            embedded
            editable={editable}
            showTitleBar
            canvasRef={canvasRef}
            exportRef={exportRef}
            onCancelPanelDrag={onCancelPanelDrag}
          />
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
