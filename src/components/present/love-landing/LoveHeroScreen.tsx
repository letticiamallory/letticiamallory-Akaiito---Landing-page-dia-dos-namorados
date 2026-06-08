"use client";

import { Instrument_Serif } from "next/font/google";
import type { HeroCoupleData } from "@/lib/builder/types";
import { DEFAULT_BOUQUET, resolveBouquetConfig } from "@/lib/bouquet-catalog";
import { BouquetPreview } from "@/components/bouquet/bouquet-preview";
import { HeroEnvelopePhoto } from "@/components/present/canva/HeroEnvelopePhoto";

const displayFont = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

export function LoveHeroScreen({
  data,
  onPhotoResolved,
}: {
  data: HeroCoupleData;
  onPhotoResolved?: (url: string) => void;
}) {
  const names =
    data.person1Name && data.person2Name
      ? `${data.person1Name.trim()} & ${data.person2Name.trim()}`
      : "João & Letticia";

  const bouquet = resolveBouquetConfig(data.bouquet ?? DEFAULT_BOUQUET);

  return (
    <div className="love-hero">
      <div className="love-hero__intro">
        <span className="love-hero__eyebrow">Feito com amor</span>
        <h1 className={`love-hero__names ${displayFont.className}`}>{names}</h1>
        {data.tagline && <p className="love-hero__tagline">{data.tagline}</p>}
      </div>

      <div className="love-hero__visual">
        <div className="love-hero__photo-ring">
          <div className="love-hero__photo-inner">
            <HeroEnvelopePhoto
              candidate={data.backgroundPhoto}
              alt={`Foto de ${names}`}
              onResolved={onPhotoResolved}
            />
          </div>
        </div>

        <div className="love-hero__bouquet">
          <BouquetPreview config={bouquet} showLabel={false} />
          <span className="love-hero__bouquet-glow" aria-hidden />
        </div>
      </div>

      <div className="love-hero__scroll" aria-hidden>
        <span className="love-hero__scroll-line" />
        <span className="love-hero__scroll-text">Deslize</span>
      </div>
    </div>
  );
}
