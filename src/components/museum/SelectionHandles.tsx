"use client";

import type { MuseumElement } from "@/lib/gift-types";

export function SelectionHandles({
  onDelete,
  onResizeStart,
  onLayerUp,
  onLayerDown,
}: {
  onDelete: () => void;
  onResizeStart: (e: React.MouseEvent | React.TouchEvent) => void;
  onLayerUp: () => void;
  onLayerDown: () => void;
}) {
  return (
    <div className="museum-handles">
      <div className="museum-handle-layer">
        <button
          type="button"
          title="Mandar pra trás"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onLayerDown();
          }}
        >
          ↓
        </button>
        <button
          type="button"
          title="Trazer pra frente"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onLayerUp();
          }}
        >
          ↑
        </button>
      </div>
      <button
        type="button"
        className="museum-handle-delete"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Excluir quadro"
        title="Excluir"
      >
        ×
      </button>
      <div
        className="museum-handle-resize"
        onMouseDown={(e) => {
          e.stopPropagation();
          onResizeStart(e);
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          onResizeStart(e);
        }}
        role="presentation"
      />
    </div>
  );
}

export function isSelected(element: MuseumElement, selectedId: string | null) {
  return element.id === selectedId;
}
