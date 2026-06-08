"use client";

import { Caveat, Lora } from "next/font/google";
import type { HeroCoupleData } from "@/lib/builder/types";
import { DEFAULT_BOUQUET, resolveBouquetConfig } from "@/lib/bouquet-catalog";
import { BouquetPreview } from "@/components/bouquet/bouquet-preview";
import { HeroEnvelopePhoto } from "./HeroEnvelopePhoto";
import { ScrapbookBackground } from "@/components/present/ScrapbookBackground";
import "./canva-hero.css";

const heroTitleFont = Caveat({
  subsets: ["latin"],
  weight: ["700"],
});

const heroSubtitleFont = Lora({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

const ASSETS = "/scrapbook/canva/hero";

export function CanvaHeroSection({
  data,
  onPhotoResolved,
}: {
  data: HeroCoupleData;
  onPhotoResolved?: (url: string) => void;
}) {
  const names =
    data.person1Name && data.person2Name
      ? `${data.person1Name.trim()}\u00A0&\u00A0${data.person2Name.trim()}`
      : "João\u00A0&\u00A0Letticia";

  const bouquet = resolveBouquetConfig(data.bouquet ?? DEFAULT_BOUQUET);

  return (
    <section className="canva-hero collage-zone">
      <div className="canva-hero__viewport">
        <div className="canva-hero__canvas">
          <ScrapbookBackground className="canva-hero__bg" />

          <div className="canva-hero__layer canva-hero__gold-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/gold-frame.png`} alt="" />
          </div>

          <div className="canva-hero__envelope">
            <HeroEnvelopePhoto
              candidate={data.backgroundPhoto}
              alt={`Foto de ${names}`}
              onResolved={onPhotoResolved}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="canva-hero__envelope-frame" src={`${ASSETS}/envelope-frame.svg`} alt="" />
          </div>

          <div className="canva-hero__layer canva-hero__bouquet">
            <BouquetPreview config={bouquet} showLabel={false} />
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="canva-hero__layer canva-hero__ribbon" src={`${ASSETS}/ribbon-bottom.png`} alt="" />

          <p className={`canva-hero__names ${heroTitleFont.className}`}>{names}</p>
          {data.tagline && (
            <p className={`canva-hero__tagline ${heroSubtitleFont.className}`}>{data.tagline}</p>
          )}
        </div>
      </div>
    </section>
  );
}
