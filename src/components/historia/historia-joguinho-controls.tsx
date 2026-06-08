"use client";

import { ImageUpload, TextAreaField } from "@/components/create-form-fields";

export function HistoriaJoguinhoControls({
  senderPhoto,
  receiverPhoto,
  loveMessage,
  onSenderPhotoChange,
  onReceiverPhotoChange,
  onLoveMessageChange,
  receiverName,
}: {
  senderPhoto: string;
  receiverPhoto: string;
  loveMessage: string;
  onSenderPhotoChange: (v: string) => void;
  onReceiverPhotoChange: (v: string) => void;
  onLoveMessageChange: (v: string) => void;
  receiverName: string;
}) {
  return (
    <div className="historia-joguinho-controls mt-4 pt-4 border-t border-[var(--border2)]">
      <p className="text-xs text-[var(--text-dim)] mb-4">
        Quiz de compatibilidade com os nomes do casal (passo Casal). Fotos e recado são opcionais.
      </p>
      <ImageUpload
        label="Sua foto (opcional)"
        value={senderPhoto}
        onChange={onSenderPhotoChange}
      />
      <ImageUpload
        label={`Foto de ${receiverName || "seu parceiro(a)"} (opcional)`}
        value={receiverPhoto}
        onChange={onReceiverPhotoChange}
      />
      <TextAreaField
        label="Recadinho no resultado (opcional)"
        value={loveMessage}
        onChange={onLoveMessageChange}
        placeholder="Você é a melhor coisa que já me aconteceu..."
      />
    </div>
  );
}
