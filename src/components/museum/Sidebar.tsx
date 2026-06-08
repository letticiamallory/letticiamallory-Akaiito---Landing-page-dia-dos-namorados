"use client";

import { InlineSvg } from "@/components/InlineSvg";
import { FRAME_DATA, SPECTATOR_DATA, getFrameDef, getSpectatorDef } from "@/data/museum-frames";
import type { PanelDragPayload } from "@/hooks/useDragFromPanel";
import type { MuseumElement } from "@/lib/gift-types";
import { useMuseumStore } from "@/store/museum.store";

function getElementLabel(el: MuseumElement): string {
  if (el.type === "frame") {
    if (el.labelTitle?.trim()) return el.labelTitle.trim();
    return `Quadro ${el.frameIndex ?? "?"}`;
  }
  return `Visitantes ${el.spectatorIndex ?? "?"}`;
}

function getElementThumb(el: MuseumElement): string | undefined {
  if (el.type === "frame" && el.frameIndex) return getFrameDef(el.frameIndex)?.file;
  if (el.type === "spectator" && el.spectatorIndex) return getSpectatorDef(el.spectatorIndex)?.file;
  return undefined;
}

export function Sidebar({
  onStartDrag,
}: {
  onStartDrag: (e: React.MouseEvent | React.TouchEvent, payload: PanelDragPayload) => void;
}) {
  const elements = useMuseumStore((s) => s.elements);
  const selectedId = useMuseumStore((s) => s.selectedId);
  const selectElement = useMuseumStore((s) => s.selectElement);
  const removeElement = useMuseumStore((s) => s.removeElement);

  return (
    <aside className="museum-sidebar">
      <div className="museum-sidebar-inner">
        <div className="museum-sidebar-header">
          <h2 className="museum-sidebar-title">Museu de Nós</h2>
          <p className="museum-sidebar-sub">Monte seu salão</p>
        </div>

        <div className="museum-sidebar-body">
          <div className="museum-sidebar-section">
            <p className="museum-sidebar-label">Quadros</p>
            <div className="museum-thumb-grid">
              {FRAME_DATA.map((frame) => (
                <button
                  key={frame.id}
                  type="button"
                  className="museum-thumb"
                  onMouseDown={(e) => onStartDrag(e, { type: "frame", frameIndex: frame.id, thumbSrc: frame.file })}
                  onTouchStart={(e) => onStartDrag(e, { type: "frame", frameIndex: frame.id, thumbSrc: frame.file })}
                  aria-label={`Quadro ${frame.id}`}
                >
                  <InlineSvg src={frame.file} className="museum-thumb-svg" />
                </button>
              ))}
            </div>
          </div>

          <div className="museum-sidebar-section">
            <p className="museum-sidebar-label">Pessoas (opcional)</p>
            <p className="museum-sidebar-hint">Adicione visitantes ao salão se quiser.</p>
            <div className="museum-spectator-row">
              {SPECTATOR_DATA.map((spec) => (
                <button
                  key={spec.id}
                  type="button"
                  className="museum-thumb museum-spectator-thumb"
                  onMouseDown={(e) =>
                    onStartDrag(e, { type: "spectator", spectatorIndex: spec.id, thumbSrc: spec.file })
                  }
                  onTouchStart={(e) =>
                    onStartDrag(e, { type: "spectator", spectatorIndex: spec.id, thumbSrc: spec.file })
                  }
                  aria-label={`Visitantes ${spec.id}`}
                >
                  <InlineSvg src={spec.file} className="museum-thumb-svg" />
                </button>
              ))}
            </div>
          </div>

          {elements.length > 0 && (
            <div className="museum-sidebar-section">
              <p className="museum-sidebar-label">No salão</p>
              <p className="museum-sidebar-hint">Clique para selecionar. Use × para excluir.</p>
              <ul className="museum-placed-list">
                {elements.map((el) => {
                  const thumb = getElementThumb(el);
                  return (
                    <li
                      key={el.id}
                      className={`museum-placed-item${selectedId === el.id ? " museum-placed-item--selected" : ""}`}
                    >
                      <button
                        type="button"
                        className="museum-placed-select"
                        onClick={() => selectElement(el.id)}
                      >
                        {thumb ? (
                          <InlineSvg src={thumb} className="museum-placed-thumb" />
                        ) : (
                          <span className="museum-placed-thumb museum-placed-thumb--empty" />
                        )}
                        <span className="museum-placed-label">
                          {getElementLabel(el)}
                          {el.type === "frame" && el.photoUrl ? " · com foto" : ""}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="museum-placed-delete"
                        onClick={() => removeElement(el.id)}
                        aria-label={`Excluir ${getElementLabel(el)}`}
                        title="Excluir"
                      >
                        ×
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
