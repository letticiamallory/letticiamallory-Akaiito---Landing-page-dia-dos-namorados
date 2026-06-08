"use client";

import { useCallback, useState } from "react";
import type { PhotoCollageData } from "@/lib/builder/types";

export function LoveGalleryScreen({ data }: { data: PhotoCollageData }) {
  const photos = data.photos.filter((p) => p.url);
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + photos.length) % photos.length);
    },
    [photos.length]
  );

  if (!photos.length) return null;

  const current = photos[index];

  return (
    <div className="love-gallery">
      <div className="love-gallery__stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current.url}
          src={current.url}
          alt={current.caption || "Memória"}
          className="love-gallery__photo"
        />
        {current.caption && (
          <p className="love-gallery__caption">{current.caption}</p>
        )}
      </div>

      {photos.length > 1 && (
        <>
          <div className="love-gallery__controls">
            <button type="button" className="love-gallery__btn" onClick={() => go(-1)} aria-label="Anterior">
              Anterior
            </button>
            <span className="love-gallery__count">
              {index + 1} / {photos.length}
            </span>
            <button type="button" className="love-gallery__btn" onClick={() => go(1)} aria-label="Próxima">
              Próxima
            </button>
          </div>
          <div className="love-gallery__dots">
            {photos.map((p, i) => (
              <button
                key={p.url + i}
                type="button"
                className={`love-gallery__dot${i === index ? " love-gallery__dot--active" : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
