"use client";

import { useRef, useState } from "react";
import type { MuseumElement } from "@/lib/gift-types";
import { InlineSvg } from "@/components/InlineSvg";
import { getFrameDef, photoPercent } from "@/data/museum-frames";
import { uploadImageFile } from "@/lib/upload-image";

function isCoarsePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

export function FrameInstance({
  element,
  editable,
  selected = false,
  onPhotoChange,
}: {
  element: MuseumElement;
  editable?: boolean;
  selected?: boolean;
  onPhotoChange?: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const def = element.frameIndex ? getFrameDef(element.frameIndex) : null;
  if (!def) return null;

  const photoStyle = photoPercent(def);

  function openFilePicker() {
    if (!editable || uploading) return;
    setUploadError("");
    inputRef.current?.click();
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onPhotoChange) return;
    setUploading(true);
    setUploadError("");
    try {
      onPhotoChange(await uploadImageFile(file));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível enviar a foto. Tente outra imagem.";
      setUploadError(message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handleFrameActivate(e: React.MouseEvent) {
    if (!editable || uploading || !isCoarsePointer()) return;
    if (!element.photoUrl || selected) {
      e.stopPropagation();
      openFilePicker();
    }
  }

  return (
    <div
      className="museum-frame-root"
      onDoubleClick={openFilePicker}
      onClick={handleFrameActivate}
      title={
        editable
          ? uploading
            ? "Enviando foto..."
            : isCoarsePointer()
              ? "Toque para adicionar foto"
              : "Duplo clique para adicionar foto"
          : undefined
      }
    >
      {editable && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFile}
        />
      )}
      {element.photoUrl && (
        <div className="museum-frame-photo-slot" style={photoStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={element.photoUrl}
            alt=""
            className="museum-frame-photo"
            draggable={false}
            decoding="async"
          />
        </div>
      )}
      <InlineSvg src={def.file} className="museum-frame-overlay" />
      {uploading && (
        <div className="museum-frame-uploading" aria-hidden>
          Enviando...
        </div>
      )}
      {uploadError && (
        <div className="museum-frame-uploading museum-frame-uploading--error" role="alert">
          {uploadError}
        </div>
      )}
      {editable && isCoarsePointer() && !element.photoUrl && !uploading && (
        <div className="museum-frame-tap-hint" aria-hidden>
          Toque para foto
        </div>
      )}
    </div>
  );
}
