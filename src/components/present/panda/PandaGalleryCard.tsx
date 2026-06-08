"use client";

import { useState } from "react";
import type { PhotoCollageData } from "@/lib/builder/types";
import { resolvePhotoMoments, DEFAULT_PHOTO_MOMENTS, type ResolvedPhotoMoment } from "@/lib/photo-moments";
import { PhotoStoriesViewer } from "./PhotoStoriesViewer";

export function PandaGalleryCard({
  data,
  person1,
  person2,
}: {
  data: PhotoCollageData;
  person1: string;
  person2: string;
}) {
  const moments = resolvePhotoMoments(data);
  const [active, setActive] = useState<ResolvedPhotoMoment | null>(null);

  const names =
    person1 && person2 ? `${person1} e ${person2}` : "a gente";

  if (!moments.length) {
    return (
      <div className="panda-gallery panda-gallery--empty">
        <p className="panda-gallery__title">Memórias</p>
        <p className="panda-gallery__subtitle">
          Toque em um momento para ver as fotos
        </p>
        <div className="panda-gallery__moments panda-gallery__moments--placeholder">
          {DEFAULT_PHOTO_MOMENTS.map((moment) => (
            <div key={moment.id} className="panda-gallery__moment panda-gallery__moment--placeholder">
              <span className="panda-gallery__moment-label">{moment.title}</span>
            </div>
          ))}
        </div>
        <p className="panda-gallery__empty">
          Adicione fotos na seção Colagem do builder para preencher os momentos.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="panda-gallery">
        <p className="panda-gallery__subtitle">Toque em um momento para ver as fotos</p>
        <div className="panda-gallery__moments">
          {moments.map(({ moment, photos, coverUrl }) => (
            <button
              key={moment.id}
              type="button"
              className="panda-gallery__moment"
              onClick={() => setActive({ moment, photos, coverUrl })}
              aria-label={`Abrir ${moment.title}, ${photos.length} fotos`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverUrl} alt="" className="panda-gallery__moment-cover" />
              <span className="panda-gallery__moment-label">{moment.title}</span>
            </button>
          ))}
        </div>
        <p className="panda-gallery__hint">Memórias de {names}</p>
      </div>

      {active && (
        <PhotoStoriesViewer
          title={active.moment.title}
          photos={active.photos}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}
