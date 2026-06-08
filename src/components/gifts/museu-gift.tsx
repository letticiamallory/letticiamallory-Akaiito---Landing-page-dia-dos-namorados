"use client";

import { useState } from "react";
import type { MuseuData, MuseuPhoto } from "@/lib/gift-types";
import { MuseumViewer } from "@/components/museum/MuseumViewer";

export function MuseuGift({ data }: { data: MuseuData }) {
  if (data.elements && data.elements.length > 0) {
    return <MuseumViewer data={data} />;
  }

  const photos = (data.photos ?? []).filter((p) => p.url);
  if (!photos.length) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6">
        <p className="text-[var(--text-muted)]">Galeria em preparação...</p>
      </div>
    );
  }

  return <LegacyMuseuGallery data={data} photos={photos} />;
}

function LegacyMuseuGallery({ data, photos }: { data: MuseuData; photos: MuseuPhoto[] }) {
  const [active, setActive] = useState(0);
  const current = photos[active];

  return (
    <div className="min-h-screen bg-[#0a0809] flex flex-col">
      <header className="px-6 py-8 border-b border-[var(--border)] text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--text-dim)] mb-2">Museu de Nós</p>
        <h1 className="font-display text-2xl font-bold">{data.senderName} & {data.receiverName}</h1>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="relative max-w-lg w-full">
          <div className="relative bg-[var(--surface)] border border-[var(--border2)] p-4 rounded-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.url} alt={current.title} className="w-full aspect-[4/5] object-cover" />
            <div className="mt-4 px-2">
              <h2 className="font-serif italic text-2xl text-[var(--text)] mt-1">{current.title || "Sem título"}</h2>
              <p className="text-sm text-[var(--text-muted)] mt-2">{current.caption}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={() => setActive(Math.max(0, active - 1))}
            disabled={active === 0}
            className="btn-secondary text-sm px-4 py-2 disabled:opacity-30"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => setActive(Math.min(photos.length - 1, active + 1))}
            disabled={active === photos.length - 1}
            className="btn-secondary text-sm px-4 py-2 disabled:opacity-30"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
