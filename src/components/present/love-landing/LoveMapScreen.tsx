"use client";

import type { OurMapData } from "@/lib/builder/types";

export function LoveMapScreen({ data }: { data: OurMapData }) {
  const bbox = 0.02;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${data.lng - bbox}%2C${data.lat - bbox}%2C${data.lng + bbox}%2C${data.lat + bbox}&layer=mapnik&marker=${data.lat}%2C${data.lng}`;

  return (
    <div className="love-map">
      <div className="love-map__card">
        <div className="love-map__pin" aria-hidden>📍</div>
        <p className="love-map__label">{data.label}</p>
        {data.address && <p className="love-map__address">{data.address}</p>}
        <div className="love-map__frame">
          <iframe src={src} title="Mapa" loading="lazy" />
        </div>
      </div>
    </div>
  );
}
