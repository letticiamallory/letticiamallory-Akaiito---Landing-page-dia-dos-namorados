"use client";

import type { PolaroidPhoto } from "@/lib/gift-types";
import { Field, TextAreaField, PhotoUploadField } from "@/components/create-form-fields";
import { clampPolaroidLabel, POLAROID_LABEL_MAX_CHARS } from "@/lib/polaroid-label";
export function HistoriaPolaroidControls({
  message,
  onMessageChange,
  photos,
  onPhotosChange,
  labelTexts,
  onLabelTextsChange,
  variant = "gallery",
}: {
  message: string;
  onMessageChange: (v: string) => void;
  photos: PolaroidPhoto[];
  onPhotosChange: (photos: PolaroidPhoto[]) => void;
  labelTexts: string[];
  onLabelTextsChange: (labels: string[]) => void;
  /** hero = 2 fotos da câmera do primeiro card; gallery = até 5 polaroids */
  variant?: "hero" | "gallery";
}) {
  const slotCount = variant === "hero" ? 2 : photos.length;
  const slots = Array.from({ length: slotCount }, (_, i) => photos[i] ?? { url: "", label: "" });

  function updatePhoto(i: number, patch: Partial<PolaroidPhoto>) {
    const next = [...photos];
    while (next.length <= i) next.push({ url: "", label: "" });
    next[i] = { ...next[i], ...patch };
    onPhotosChange(next);
  }

  function updateLabel(i: number, label: string) {
    const next = [...labelTexts];
    next[i] = label;
    onLabelTextsChange(next);
    updatePhoto(i, { label });
  }

  return (
    <div className="historia-polaroid-controls mt-4 pt-4 border-t border-[var(--border2)]">
      {variant === "hero" ? (
        <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed">
          Essas fotos aparecem quando a pessoa abre a caixa e dispara a câmera no primeiro card.
          São necessárias <strong>2 fotos</strong>.
        </p>
      ) : (
        <TextAreaField
          label="Mensagem na abertura do presente"
          value={message}
          onChange={onMessageChange}
          placeholder="Você é a melhor surpresa da minha vida..."
        />
      )}

      <p className="text-xs tracking-widest uppercase text-[var(--text-dim)] mb-3 mt-4">
        {variant === "hero" ? "Fotos da câmera (2 obrigatórias)" : "Fotos polaroid (mín. 3, até 5)"}
      </p>
      <div className="grid grid-cols-1 gap-4">
        {slots.map((photo, i) => (
          <div key={i} className="p-4 border border-[var(--border2)] rounded-xl flex flex-col gap-4">
            <div className="text-xs text-[var(--text-dim)] uppercase tracking-widest">
              Foto {i + 1}
              {(variant === "hero" || i < 3) ? " *" : ""}
            </div>
            <PhotoUploadField
              label="Imagem"
              value={photo.url}
              onChange={(url) => updatePhoto(i, { url })}
            />
            {variant === "hero" && (
              <p className="text-xs text-[var(--text-dim)] -mt-2">
                Recomendado: 800 × 880 px (proporção da polaroid).
              </p>
            )}
            <Field
              label="Legenda na polaroid"
              value={photo.label || labelTexts[i] || ""}
              onChange={(v) => updateLabel(i, v)}
              placeholder={i === 0 ? "Primeiro encontro" : "Sempre juntos"}
              maxLength={POLAROID_LABEL_MAX_CHARS}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
