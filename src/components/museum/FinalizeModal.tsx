"use client";

import { useState } from "react";
import html2canvas from "html2canvas";

export function FinalizeModal({
  canvasRef,
  coupleName,
  museumTitle,
  museumDate,
  onMetaChange,
  onClose,
}: {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  coupleName: string;
  museumTitle: string;
  museumDate: string;
  onMetaChange: (meta: { coupleName: string; museumTitle: string; museumDate: string }) => void;
  onClose: () => void;
}) {
  const [exporting, setExporting] = useState(false);

  async function saveImage() {
    const el = canvasRef.current;
    if (!el) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(el, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#0a0809",
        scale: Math.min(window.devicePixelRatio || 1, 2),
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `museu-de-nos-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("Não foi possível exportar a imagem. Tente novamente.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="museum-modal-backdrop" onClick={onClose}>
      <div className="museum-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-serif italic text-xl mb-1">Finalizar museu</h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">Personalize o título e salve uma prévia.</p>
        <div className="museum-label-form">
          <label>
            <span className="text-xs text-[var(--text-dim)] uppercase tracking-widest">Nome do casal</span>
            <input
              value={coupleName}
              onChange={(e) => onMetaChange({ coupleName: e.target.value, museumTitle, museumDate })}
              placeholder="João & Ana"
            />
          </label>
          <label>
            <span className="text-xs text-[var(--text-dim)] uppercase tracking-widest">Título do museu</span>
            <input
              value={museumTitle}
              onChange={(e) => onMetaChange({ coupleName, museumTitle: e.target.value, museumDate })}
              placeholder="Museu de Nós"
            />
          </label>
          <label>
            <span className="text-xs text-[var(--text-dim)] uppercase tracking-widest">Data</span>
            <input
              value={museumDate}
              onChange={(e) => onMetaChange({ coupleName, museumTitle, museumDate: e.target.value })}
              placeholder="12 de junho, 2025"
            />
          </label>
          <button
            type="button"
            className="btn-primary btn-rose w-full justify-center mt-2"
            onClick={saveImage}
            disabled={exporting}
          >
            {exporting ? "Gerando PNG..." : "Salvar como imagem"}
          </button>
          <button type="button" className="text-sm text-[var(--text-muted)] mt-2" onClick={onClose}>
            Voltar ao editor
          </button>
        </div>
      </div>
    </div>
  );
}
