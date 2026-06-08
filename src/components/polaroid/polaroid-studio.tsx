"use client";

import { ImageUpload, Field, TextAreaField } from "@/components/create-form-fields";
import type { PolaroidPhoto } from "@/lib/gift-types";
import { clampPolaroidLabel, POLAROID_LABEL_MAX_CHARS } from "@/lib/polaroid-label";
import { Polaroid } from "./Polaroid";
import { POLAROID_SEQUENCE } from "@/data/polaroid-assets";

export function PolaroidStudio({
  senderName,
  receiverName,
  message,
  photos,
  labelTexts,
  onSenderName,
  onReceiverName,
  onMessage,
  onPhotosChange,
  onLabelTextsChange,
}: {
  senderName: string;
  receiverName: string;
  message: string;
  photos: PolaroidPhoto[];
  labelTexts: string[];
  onSenderName: (v: string) => void;
  onReceiverName: (v: string) => void;
  onMessage: (v: string) => void;
  onPhotosChange: (photos: PolaroidPhoto[]) => void;
  onLabelTextsChange: (labels: string[]) => void;
}) {
  function updatePhoto(i: number, patch: Partial<PolaroidPhoto>) {
    onPhotosChange(photos.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }

  function updateLabel(i: number, label: string) {
    const trimmed = clampPolaroidLabel(label);
    const next = [...labelTexts];
    next[i] = trimmed;
    onLabelTextsChange(next);
    updatePhoto(i, { label: trimmed });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
        <Field label="Seu nome" value={senderName} onChange={onSenderName} placeholder="João" required />
        <Field label="Nome dela(e)" value={receiverName} onChange={onReceiverName} placeholder="Ana" required />
      </div>

      <TextAreaField
        label="Mensagem na abertura do presente"
        value={message}
        onChange={onMessage}
        placeholder="Você é a melhor surpresa da minha vida..."
        required
      />

      <div>
        <p className="text-xs tracking-widest uppercase text-[var(--text-dim)] mb-4">
          Fotos polaroid (até 5)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, i) => (
            <div key={i} className="p-4 border border-[var(--border)] rounded-xl flex flex-col gap-3">
              <div className="text-xs text-[var(--text-dim)] uppercase tracking-widest">Foto {i + 1}</div>
              <div className="relative h-48 bg-[#ffe3e3] rounded-lg overflow-hidden flex items-start justify-center pt-4">
                <Polaroid
                  photoUrl={photo.url || undefined}
                  label={photo.label || labelTexts[i]}
                  rotation={POLAROID_SEQUENCE[i]?.rotation ?? 0}
                  finalX={0}
                  finalY={0}
                  delay={0}
                  preview
                />
              </div>
              <ImageUpload
                label="Imagem"
                value={photo.url}
                onChange={(url) => updatePhoto(i, { url })}
              />
              <Field
                label="Legenda da polaroid"
                value={photo.label || labelTexts[i] || ""}
                onChange={(v) => updateLabel(i, v)}
                placeholder="Nosso momento favorito"
                maxLength={POLAROID_LABEL_MAX_CHARS}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
