"use client";

import { useEffect, useRef, useState } from "react";
import type { PhotoCollagePhoto, PhotoMoment } from "@/lib/builder/types";
import {
  COLLAGE_MAX_PHOTOS,
  COLLAGE_PHOTOS_PER_MOMENT,
  normalizeCollagePhotos,
} from "@/lib/photo-moments";
import { uploadImageFile } from "@/lib/upload-image";

export function PhotoUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setLoading(true);
    setUploadError("");
    try {
      onChange(await uploadImageFile(file));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Não foi possível enviar a foto.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="block text-xs tracking-widest uppercase text-[var(--text-muted)] mb-2">
        {label}
      </label>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onClick={() => !loading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!loading) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file && !loading) void handleFile(file);
        }}
        className="rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors cursor-pointer"
        style={{
          borderColor: dragOver ? "var(--rose)" : "var(--border2)",
          background: dragOver ? "rgba(196,66,106,0.08)" : "var(--surface2)",
          opacity: loading ? 0.65 : 1,
        }}
      >
        {value ? (
          <div className="flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt=""
              className="max-h-28 w-auto max-w-full rounded-lg object-contain border border-[var(--border2)]"
            />
            <p className="text-xs text-[var(--text-muted)]">
              {loading ? "Enviando..." : "Clique ou arraste para trocar a foto"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">
            {loading ? "Enviando..." : "Arraste a foto aqui ou clique para selecionar"}
          </p>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      {uploadError && <p className="text-xs text-red-400 mt-2">{uploadError}</p>}
    </div>
  );
}

function isUploadedImagePath(url: string) {
  return url.startsWith("/uploads/");
}

export function ImageUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [linkInput, setLinkInput] = useState(() =>
    value && !isUploadedImagePath(value) ? value : ""
  );

  useEffect(() => {
    if (!value) {
      setLinkInput("");
      return;
    }
    if (!isUploadedImagePath(value)) {
      setLinkInput(value);
    }
  }, [value]);

  async function handleFile(file: File) {
    setLoading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setUploadError(data.error || "Não foi possível enviar a foto.");
        return;
      }
      onChange(data.url);
    } catch {
      setUploadError("Não foi possível enviar a foto. Tente de novo.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="block text-xs tracking-widest uppercase text-[var(--text-muted)] mb-2">{label}</label>
      <div className="flex gap-3 items-center flex-wrap">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-16 h-16 rounded-xl object-cover border border-[var(--border2)]" />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="text-xs tracking-wide uppercase text-[var(--text-muted)] border border-[var(--border2)] px-4 py-2 rounded-full hover:text-[var(--text)] transition-colors cursor-pointer bg-transparent"
        >
          {loading ? "Enviando..." : value ? "Trocar foto" : "Enviar foto"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
      <input
        type="text"
        inputMode="url"
        placeholder="Ou cole o link da foto (opcional)"
        value={linkInput}
        onChange={(e) => {
          setUploadError("");
          setLinkInput(e.target.value);
          onChange(e.target.value);
        }}
        className="input-field mt-2 text-sm"
      />
      {uploadError && <p className="text-xs text-red-400 mt-1">{uploadError}</p>}
    </div>
  );
}

function MomentPhotoSection({
  moment,
  momentIndex,
  photos,
  totalPhotos,
  onPhotosAdded,
  onRemovePhoto,
}: {
  moment: PhotoMoment;
  momentIndex: number;
  photos: PhotoCollagePhoto[];
  totalPhotos: number;
  onPhotosAdded: (files: FileList | File[]) => Promise<void>;
  onRemovePhoto: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const remainingInMoment = COLLAGE_PHOTOS_PER_MOMENT - photos.length;
  const totalRemaining = COLLAGE_MAX_PHOTOS - totalPhotos;
  const canAddMore = remainingInMoment > 0 && totalRemaining > 0;

  async function handleFiles(fileList: FileList | File[]) {
    if (!canAddMore || loading) return;
    setLoading(true);
    setUploadError("");
    try {
      await onPhotosAdded(fileList);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Não foi possível enviar as fotos.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs tracking-widest uppercase text-[var(--text-muted)]">
          {moment.title || `Momento ${momentIndex + 1}`}
        </span>
        <span className="text-[0.65rem] text-[var(--text-dim)]">
          {photos.length}/{COLLAGE_PHOTOS_PER_MOMENT}
        </span>
      </div>

      <div
        role="button"
        tabIndex={canAddMore && !loading ? 0 : -1}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && canAddMore && !loading) inputRef.current?.click();
        }}
        onClick={() => canAddMore && !loading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (canAddMore) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (canAddMore && !loading) void handleFiles(e.dataTransfer.files);
        }}
        className="rounded-xl border border-dashed px-4 py-5 text-center transition-colors"
        style={{
          borderColor: dragOver ? "var(--rose)" : "var(--border2)",
          background: dragOver ? "rgba(196,66,106,0.08)" : "var(--surface2)",
          opacity: canAddMore && !loading ? 1 : 0.55,
          cursor: canAddMore && !loading ? "pointer" : "default",
        }}
      >
        <p className="text-xs text-[var(--text-muted)]">
          {loading
            ? "Enviando fotos..."
            : canAddMore
              ? "Arraste fotos aqui ou clique para enviar neste momento"
              : remainingInMoment <= 0
                ? "Limite deste momento atingido"
                : "Limite total de fotos atingido"}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files?.length) void handleFiles(files);
        }}
      />
      {uploadError && <p className="text-xs text-red-400 mt-1">{uploadError}</p>}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
          {photos.map((photo) => (
            <div key={photo.url} className="relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt=""
                className="w-full h-full rounded-lg object-cover border border-[var(--border2)]"
              />
              <button
                type="button"
                onClick={() => onRemovePhoto(photo.url)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--bg)] border border-[var(--border2)] text-[var(--text-muted)] text-xs leading-none cursor-pointer hover:text-[var(--rose)] hover:border-[var(--rose)]"
                aria-label="Remover foto"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function BulkPhotoUpload({
  photos,
  moments,
  onChange,
}: {
  photos: PhotoCollagePhoto[];
  moments: PhotoMoment[];
  onChange: (photos: PhotoCollagePhoto[]) => void;
}) {
  const filledPhotos = normalizeCollagePhotos(photos, moments);

  function updatePhotos(next: PhotoCollagePhoto[]) {
    onChange(normalizeCollagePhotos(next, moments));
  }

  async function addPhotosToMoment(momentId: string, fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;

    const momentPhotos = filledPhotos.filter((p) => p.momentId === momentId);
    const remainingInMoment = COLLAGE_PHOTOS_PER_MOMENT - momentPhotos.length;
    const totalRemaining = COLLAGE_MAX_PHOTOS - filledPhotos.length;
    const slots = Math.min(remainingInMoment, totalRemaining);

    if (slots <= 0) {
      throw new Error(
        remainingInMoment <= 0
          ? `Limite de ${COLLAGE_PHOTOS_PER_MOMENT} fotos neste momento.`
          : `Limite de ${COLLAGE_MAX_PHOTOS} fotos no total.`
      );
    }

    const batch = files.slice(0, slots);
    const next = [...filledPhotos];

    for (const file of batch) {
      const url = await uploadImageFile(file);
      next.push({ url, caption: "", momentId });
    }

    updatePhotos(next);
  }

  function removePhoto(momentId: string, url: string) {
    const next = filledPhotos.filter((p) => !(p.momentId === momentId && p.url === url));
    updatePhotos(next);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs tracking-widest uppercase text-[var(--text-muted)] mb-2">
          Fotos do casal <span className="text-[var(--rose)]">*</span>
        </label>
        <p className="text-xs text-[var(--text-dim)]">
          Envie até {COLLAGE_PHOTOS_PER_MOMENT} fotos em cada momento. No total, até {COLLAGE_MAX_PHOTOS}{" "}
          fotos ({filledPhotos.length}/{COLLAGE_MAX_PHOTOS} enviadas).
        </p>
        <p className="text-xs text-[var(--text-dim)] mt-1">
          Recomendado: retrato, 1080 × 1920 px (proporção 9:16). Formatos JPG ou PNG.
        </p>
      </div>

      {moments.map((moment, mi) => (
        <MomentPhotoSection
          key={moment.id}
          moment={moment}
          momentIndex={mi}
          photos={filledPhotos.filter((p) => p.momentId === moment.id)}
          totalPhotos={filledPhotos.length}
          onPhotosAdded={(files) => addPhotosToMoment(moment.id, files)}
          onRemovePhoto={(url) => removePhoto(moment.id, url)}
        />
      ))}
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-xs tracking-widest uppercase text-[var(--text-muted)] mb-2">
        {label} {required && <span className="text-[var(--rose)]">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="input-field"
      />
      {maxLength != null && (
        <p className="text-xs text-[var(--text-dim)] mt-1">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs tracking-widest uppercase text-[var(--text-muted)] mb-2">
        {label} {required && <span className="text-[var(--rose)]">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="input-field"
      />
    </div>
  );
}

export function FormShell({
  icon,
  title,
  subtitle,
  price,
  children,
  onSubmit,
  loading,
  error,
}: {
  icon: string;
  title: string;
  subtitle: string;
  price: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error?: string;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg)] px-6 py-24 md:px-12">
      <div className="max-w-xl mx-auto">
        <a href="/" className="font-display text-sm font-bold text-[var(--text-muted)] no-underline hover:text-[var(--text)] mb-8 inline-block">
          Voltar
        </a>
        <div className="mb-8">
          <div className="text-4xl mb-4">{icon}</div>
          <div className="text-[0.65rem] tracking-[0.2em] uppercase text-[var(--rose)] mb-2">Personalizar presente</div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight mb-2">{title}</h1>
          <p className="text-sm text-[var(--text-muted)]">{subtitle}</p>
          <div className="font-display font-bold text-lg mt-4 text-[var(--rose)]">{price}</div>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          {children}
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary btn-rose w-full justify-center mt-4">
            {loading ? "Criando..." : "Ir para pagamento"}
          </button>
        </form>
      </div>
    </div>
  );
}
