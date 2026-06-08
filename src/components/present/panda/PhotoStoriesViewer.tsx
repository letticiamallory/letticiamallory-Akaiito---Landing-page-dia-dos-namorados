"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PhotoCollagePhoto } from "@/lib/builder/types";

const STORY_MS = 5500;

export function PhotoStoriesViewer({
  title,
  photos,
  onClose,
}: {
  title: string;
  photos: PhotoCollagePhoto[];
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);

  const goNext = useCallback(() => {
    setIndex((i) => {
      if (i >= photos.length - 1) {
        onClose();
        return i;
      }
      return i + 1;
    });
    setProgress(0);
  }, [photos.length, onClose]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : i));
    setProgress(0);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goNext, goPrev]);

  useEffect(() => {
    if (paused || !photos.length) return;
    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - started;
      const pct = Math.min(elapsed / STORY_MS, 1);
      setProgress(pct);
      if (pct >= 1) {
        goNext();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [index, paused, photos.length, goNext]);

  const current = photos[index];
  if (!current) return null;

  const content = (
    <div
      className="photo-stories"
      role="dialog"
      aria-modal="true"
      aria-label={`Galeria: ${title}`}
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="photo-stories__backdrop" onClick={onClose} aria-hidden />

      <div className="photo-stories__frame">
        <div className="photo-stories__top">
          <div className="photo-stories__bars" aria-hidden>
            {photos.map((p, i) => (
              <span key={p.url + i} className="photo-stories__bar">
                <span
                  className="photo-stories__bar-fill"
                  style={{
                    width:
                      i < index ? "100%" : i === index ? `${progress * 100}%` : "0%",
                  }}
                />
              </span>
            ))}
          </div>

          <div className="photo-stories__meta">
            <p className="photo-stories__title">{title}</p>
            <button
              type="button"
              className="photo-stories__close"
              onClick={onClose}
              aria-label="Fechar galeria"
            >
              ×
            </button>
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current.url + index}
          src={current.url}
          alt={current.caption || title}
          className="photo-stories__image"
          draggable={false}
        />

        {current.caption && (
          <p className="photo-stories__caption">{current.caption}</p>
        )}

        <button
          type="button"
          className="photo-stories__tap photo-stories__tap--prev"
          aria-label="Foto anterior"
          onClick={goPrev}
        />
        <button
          type="button"
          className="photo-stories__tap photo-stories__tap--next"
          aria-label="Próxima foto"
          onClick={goNext}
        />

        <div
          className="photo-stories__swipe"
          onTouchStart={(e) => {
            touchStart.current = e.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStart.current === null) return;
            const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStart.current;
            touchStart.current = null;
            if (delta > 60) goPrev();
            else if (delta < -60) goNext();
          }}
        />
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
