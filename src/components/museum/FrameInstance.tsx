"use client";

import { useRef, useState } from "react";
import type { MuseumElement } from "@/lib/gift-types";
import { getFrameDef, photoPercent } from "@/data/museum-frames";
import { uploadImageFile } from "@/lib/upload-image";

export function FrameInstance({
  element,
  editable,
  onPhotoChange,
}: {
  element: MuseumElement;
  editable?: boolean;
  onPhotoChange?: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const def = element.frameIndex ? getFrameDef(element.frameIndex) : null;
  if (!def) return null;

  const photoStyle = photoPercent(def);

  function openFilePicker() {
    if (!editable) return;
    inputRef.current?.click();
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onPhotoChange) return;
    setUploading(true);
    try {
      onPhotoChange(await uploadImageFile(file));
    } catch {
      alert("Não foi possível enviar a foto. Tente outra imagem.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div
      className="museum-frame-root"
      onDoubleClick={openFilePicker}
      title={editable ? (uploading ? "Enviando foto..." : "Duplo clique para adicionar foto") : undefined}
    >
      {editable && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
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
            decoding="sync"
          />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={def.file} alt="" className="museum-frame-overlay" draggable={false} />
      {uploading && (
        <div className="museum-frame-uploading" aria-hidden>
          Enviando...
        </div>
      )}
    </div>
  );
}
