"use client";

import { CHOCOLATE_TYPES } from "@/data/chocolate-catalog";
import type { ChocolatePanelPayload } from "@/hooks/useChocolateDragFromPanel";
import { ChocolateSprite } from "./chocolate-sprite";

export function ChocolateSidebar({
  onStartDrag,
}: {
  onStartDrag: (e: React.MouseEvent | React.TouchEvent, payload: ChocolatePanelPayload) => void;
}) {
  return (
    <aside className="chocolate-sidebar">
      <div className="chocolate-sidebar-inner">
        <div className="chocolate-sidebar-header">
          <h2 className="chocolate-sidebar-title">Chocolates</h2>
          <p className="chocolate-sidebar-sub">Arraste para a caixa</p>
        </div>

        <div className="chocolate-sidebar-body">
          <p className="chocolate-sidebar-label">Sabores</p>
          <div className="chocolate-thumb-grid">
            {CHOCOLATE_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                className="chocolate-thumb"
                onMouseDown={(e) =>
                  onStartDrag(e, { type: "chocolate", chocolateIndex: type.id })
                }
                onTouchStart={(e) =>
                  onStartDrag(e, { type: "chocolate", chocolateIndex: type.id })
                }
                aria-label={type.name}
              >
                <div className="chocolate-thumb-preview">
                  <ChocolateSprite type={type} biteStage={0} />
                </div>
                <span className="chocolate-thumb-name">{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="chocolate-sidebar-hint">
          Arraste um modelo para a caixa. Clique no chocolate para mordiscar até acabar. Duplo clique
          ou Delete remove.
        </p>
      </div>
    </aside>
  );
}
