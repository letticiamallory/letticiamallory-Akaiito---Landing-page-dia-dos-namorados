"use client";

import { useEffect, useState } from "react";
import type {
  BuilderSection,
  ChocolateBoxData,
  CounterTogetherData,
  CustomMessageData,
  FavoriteSongData,
  HeroCoupleData,
  LoveLetterData,
  MuseumOfUsData,
  OurMapData,
  PhotoCollageData,
  PolaroidCameraData,
} from "@/lib/builder/types";
import { clampCustomMessageBody, clampCustomMessageCta } from "@/lib/custom-message";
import { buildCalendarMonth, collageRotation, yearsTogether } from "@/lib/collage-utils";
import { useRelationshipCounter } from "@/hooks/useHistoriaPage";
import { useCollageReveal } from "@/hooks/useCollageReveal";
import { HistoriaPolaroidSection } from "@/components/historia/historia-polaroid-section";
import { HistoriaMuseuSection } from "@/components/historia/historia-museu-section";
import { HistoriaChocolatesSection } from "@/components/historia/historia-chocolates-section";
import { CanvaHeroSection } from "@/components/present/canva/CanvaHeroSection";
import { CollageCartaSection } from "./CollageCartaSection";
import { MusicPolaroidHang } from "./MusicPolaroidHang";
import type { MusicPolaroidPair } from "@/lib/music-section-assets";
import {
  CollageButterfly,
  CollageCherry,
  CollageHeart,
  CollageSafetyPin,
  CollageTape,
} from "./CollageIcons";

function getEmbedUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("spotify.com")) {
      return u.toString().replace("open.spotify.com/", "open.spotify.com/embed/");
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

export function CollageHero({
  data,
  onPhotoResolved,
}: {
  data: HeroCoupleData;
  years: number;
  onPhotoResolved?: (url: string) => void;
}) {
  return <CanvaHeroSection data={data} onPhotoResolved={onPhotoResolved} />;
}

export function CollageFilmStrip({ data, seed }: { data: PhotoCollageData; seed: string }) {
  const reveal = useCollageReveal();
  const [lightbox, setLightbox] = useState<string | null>(null);
  const photos = data.photos.filter((p) => p.url).slice(0, 3);

  if (!photos.length) return null;

  return (
    <div className="collage-zone">
      <div ref={reveal.ref} className={`collage-film ${reveal.className} collage-reveal--film`}>
        <CollageSafetyPin className="collage-film__pin" />
        <CollageCherry className="collage-film__cherry" />
        <span className="collage-film__label">KODAK 400</span>
        <div className="collage-film__strip">
          {photos.map((photo, i) => (
            <button
              key={photo.url + i}
              type="button"
              className="collage-film__frame"
              style={{ transform: `rotate(${collageRotation(seed, i)}deg)` }}
              onClick={() => setLightbox(photo.url)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt={photo.caption || ""} />
            </button>
          ))}
        </div>
      </div>
      {lightbox && (
        <div className="collage-lightbox" onClick={() => setLightbox(null)} role="dialog">
          <button type="button" className="collage-lightbox__close" aria-label="Fechar">
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" />
        </div>
      )}
    </div>
  );
}

function CollageFlipNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (value === display) return;
    setFlip(true);
    const id = window.setTimeout(() => {
      setDisplay(value);
      setFlip(false);
    }, 280);
    return () => window.clearTimeout(id);
  }, [value, display]);

  return (
    <div className={`collage-counter__num${flip ? " collage-counter__num--flip" : ""}`}>
      {display}
    </div>
  );
}

export function CollageCalendarBlock({ startDate }: { startDate: string }) {
  const reveal = useCollageReveal();
  if (!startDate) return null;
  const { monthLabel, year, cells } = buildCalendarMonth(startDate);
  const dows = ["D", "S", "T", "Q", "Q", "S", "S"];

  return (
    <div ref={reveal.ref} className={`collage-calendar ${reveal.className} collage-reveal--calendar`}>
      <div className="collage-calendar__sheet">
        <div className="collage-calendar__head">
          <span>{monthLabel}</span>
          <span className="collage-calendar__badge">{year}</span>
        </div>
        <div className="collage-calendar__grid">
          {dows.map((d) => (
            <span key={d} className="collage-calendar__dow">
              {d}
            </span>
          ))}
          {cells.map((cell, i) => (
            <span
              key={i}
              className={[
                "collage-calendar__day",
                cell.isWeekend ? "collage-calendar__day--weekend" : "",
                cell.isMarked ? "collage-calendar__day--marked" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {cell.isMarked ? (
                <CollageHeart className="collage-calendar__heart" />
              ) : (
                cell.day ?? ""
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CollageCalendarSection({ startDate }: { startDate: string }) {
  return (
    <div className="collage-zone">
      <CollageCalendarBlock startDate={startDate} />
    </div>
  );
}

export function CollageCounterSection({ data }: { data: CounterTogetherData }) {
  const reveal = useCollageReveal();
  const counter = useRelationshipCounter(data.startDate || new Date().toISOString().slice(0, 10));
  const units: { key: keyof typeof counter; label: string; show: boolean; rot: number }[] = [
    { key: "years", label: "anos", show: data.showYears, rot: -4 },
    { key: "months", label: "meses", show: data.showMonths, rot: 2 },
    { key: "days", label: "dias", show: data.showDays, rot: -2 },
    { key: "hours", label: "horas", show: data.showHours, rot: 3 },
    { key: "minutes", label: "min", show: true, rot: -3 },
    { key: "seconds", label: "seg", show: true, rot: 5 },
  ];

  return (
    <div className="collage-zone">
      <CollageCalendarBlock startDate={data.startDate} />
      <div ref={reveal.ref} className={`collage-counter ${reveal.className} collage-reveal--counter`}>
        <p className="collage-counter__label">{data.label || "Estamos juntos há"}</p>
        <div className="collage-counter__strips">
          {units
            .filter((u) => u.show)
            .map((u, i) => (
              <div
                key={u.key}
                className="collage-counter__strip"
                style={{
                  transform: `rotate(${u.rot}deg)`,
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                {u.key === "minutes" || u.key === "seconds" ? (
                  <CollageFlipNumber value={counter[u.key]} />
                ) : (
                  <div className="collage-counter__num">{counter[u.key]}</div>
                )}
                <div className="collage-counter__unit">{u.label}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export function CollageVinylSection({
  data,
  couplePhoto,
}: {
  data: FavoriteSongData;
  couplePhoto?: string;
}) {
  const { ref, visible, className } = useCollageReveal();
  const embedUrl = getEmbedUrl(data.embedUrl);
  if (!data.songTitle && !data.artistName && !embedUrl) return null;

  const polaroids: MusicPolaroidPair = {
    left: {
      photoUrl: data.polaroidLeftPhoto || couplePhoto,
      caption: data.polaroidLeftCaption,
    },
    right: {
      photoUrl: data.polaroidRightPhoto || couplePhoto,
      caption: data.polaroidRightCaption,
    },
  };

  return (
    <div className="collage-zone">
      <div ref={ref} className={`collage-music-block ${className} collage-reveal--vinyl`}>
        <MusicPolaroidHang polaroids={polaroids} />
        <div className="collage-vinyl">
          <span className="collage-vinyl__note-icon" aria-hidden>
            ♪
          </span>
          <div className="collage-vinyl__cover">
            {couplePhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={couplePhoto} alt="" />
            ) : (
              <span className="collage-vinyl__cover-placeholder" aria-hidden>♪</span>
            )}
          </div>
          <div className={`collage-vinyl__disc${visible ? " collage-vinyl__disc--spinning" : ""}`}>
            <div className="collage-vinyl__label">
              {couplePhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={couplePhoto} alt="" />
              ) : null}
            </div>
          </div>
          <div className="collage-vinyl__meta">
            {data.songTitle && <p className="collage-vinyl__title">{data.songTitle}</p>}
            {data.artistName && <p className="collage-vinyl__artist">{data.artistName}</p>}
            {data.note && <p className="collage-vinyl__note">{data.note}</p>}
            {embedUrl && (
              <div className="collage-vinyl__embed">
                <iframe src={embedUrl} title="Música" loading="lazy" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CollageCameraSection({
  data,
  onOpen,
}: {
  data: PolaroidCameraData;
  person1: string;
  person2: string;
  onOpen: () => void;
}) {
  const reveal = useCollageReveal();
  const preview = data.photos.find((p) => p.url);
  const [flash, setFlash] = useState(false);

  function handleClick() {
    setFlash(true);
    window.setTimeout(() => {
      setFlash(false);
      onOpen();
    }, 320);
  }

  return (
    <div className="collage-zone">
      <div ref={reveal.ref} className={`collage-camera ${reveal.className} collage-reveal--camera`}>
        {flash && <div className="collage-camera__flash" aria-hidden />}
        <CollageButterfly className="collage-camera__butterfly" />
        {preview && (
          <div className="collage-camera__polaroid">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview.url} alt="" />
            {preview.label && <p className="collage-camera__polaroid-cap">{preview.label}</p>}
          </div>
        )}
        <button type="button" className="collage-camera__device" onClick={handleClick} aria-label="Abrir câmera">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/polaroid/iphone-1.svg" alt="" />
        </button>
      </div>
    </div>
  );
}

export function CollageMapSection({ data }: { data: OurMapData }) {
  const reveal = useCollageReveal();
  const bbox = 0.02;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${data.lng - bbox}%2C${data.lat - bbox}%2C${data.lng + bbox}%2C${data.lat + bbox}&layer=mapnik&marker=${data.lat}%2C${data.lng}`;

  return (
    <div className="collage-zone">
      <div ref={reveal.ref} className={`collage-map ${reveal.className} collage-reveal--letter`}>
        <p className="collage-map__label">{data.label}</p>
        <div className="collage-map__frame">
          <iframe src={src} title="Mapa" loading="lazy" />
        </div>
      </div>
    </div>
  );
}

export function CollageIntegratedObject({
  label,
  onClick,
  imageUrl,
}: {
  label: string;
  onClick: () => void;
  imageUrl?: string;
}) {
  const reveal = useCollageReveal();
  return (
    <div className="collage-zone">
      <div ref={reveal.ref} className={`${reveal.className} collage-reveal--letter`}>
        <button type="button" className="collage-object" onClick={onClick}>
          <CollageTape className="collage-object__tape" />
          <div className="collage-object__frame">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" />
            ) : (
              <div style={{ aspectRatio: "4/3", background: "var(--col-cherry)" }} />
            )}
            <p className="collage-object__label">{label}</p>
          </div>
        </button>
      </div>
    </div>
  );
}

export function CollageFinalSection({ data }: { data: CustomMessageData }) {
  const { ref, visible, className } = useCollageReveal();
  const [len, setLen] = useState(0);
  const body = clampCustomMessageBody(data.body);
  const ctaText = data.ctaText ? clampCustomMessageCta(data.ctaText) : data.ctaText;

  useEffect(() => {
    if (!visible) return;
    setLen(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setLen(i);
      if (i >= body.length) window.clearInterval(id);
    }, 28);
    return () => window.clearInterval(id);
  }, [visible, body]);

  if (!body.trim()) return null;

  return (
    <div className="collage-zone">
      <div ref={ref} className={`collage-final ${className} collage-reveal--counter`}>
        {data.title && <h2 className="collage-final__title">{data.title}</h2>}
        <p className="collage-final__body">{body.slice(0, len)}</p>
        {ctaText && <span className="collage-final__cta">{ctaText}</span>}
      </div>
    </div>
  );
}

export function CollageSectionRenderer({
  section,
  person1,
  person2,
  years,
  seed,
  couplePhoto,
  onOpenPolaroid,
  onOpenMuseum,
  onOpenChocolates,
  onFixHeroPhoto,
  skipSurprises = false,
}: {
  section: BuilderSection;
  person1: string;
  person2: string;
  years: number;
  seed: string;
  couplePhoto?: string;
  onOpenPolaroid: () => void;
  onOpenMuseum: () => void;
  onOpenChocolates: () => void;
  onFixHeroPhoto?: (url: string) => void;
  skipSurprises?: boolean;
}) {
  const d = section.data;

  if (
    skipSurprises &&
    (section.sectionId === "museum_of_us" ||
      section.sectionId === "polaroid_camera" ||
      section.sectionId === "chocolate_box")
  ) {
    return null;
  }

  switch (section.sectionId) {
    case "hero_couple":
      return (
        <CollageHero
          data={d as HeroCoupleData}
          years={years}
          onPhotoResolved={onFixHeroPhoto}
        />
      );
    case "photo_collage":
      return <CollageFilmStrip data={d as PhotoCollageData} seed={seed} />;
    case "love_letter":
      return (
        <CollageCartaSection
          data={d as LoveLetterData}
          senderName={person1}
          receiverName={person2}
        />
      );
    case "counter_together":
      return <CollageCounterSection data={d as CounterTogetherData} />;
    case "favorite_song":
      return <CollageVinylSection data={d as FavoriteSongData} couplePhoto={couplePhoto} />;
    case "polaroid_camera":
      return (
        <CollageCameraSection
          data={d as PolaroidCameraData}
          person1={person1}
          person2={person2}
          onOpen={onOpenPolaroid}
        />
      );
    case "our_map":
      return <CollageMapSection data={d as OurMapData} />;
    case "museum_of_us":
      return (
        <CollageIntegratedObject label="Nosso Museu" onClick={onOpenMuseum} />
      );
    case "chocolate_box":
      return (
        <CollageIntegratedObject label="Caixa de Bombons" onClick={onOpenChocolates} />
      );
    case "custom_message":
      return <CollageFinalSection data={d as CustomMessageData} />;
    default:
      return null;
  }
}

export function CollageModal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="collage-modal">
      <button type="button" className="collage-modal__close" onClick={onClose}>
        Fechar ✕
      </button>
      {children}
    </div>
  );
}

export function CollagePolaroidModal({
  open,
  onClose,
  data,
  person1,
  person2,
}: {
  open: boolean;
  onClose: () => void;
  data: PolaroidCameraData;
  person1: string;
  person2: string;
}) {
  return (
    <CollageModal open={open} onClose={onClose}>
      <HistoriaPolaroidSection
        module={{ message: data.message, photos: data.photos, labelTexts: data.labelTexts }}
        senderName={person1}
        receiverName={person2}
      />
    </CollageModal>
  );
}

export function CollageMuseumModal({
  open,
  onClose,
  data,
  person1,
  person2,
}: {
  open: boolean;
  onClose: () => void;
  data: MuseumOfUsData;
  person1: string;
  person2: string;
}) {
  if (!data.elements.length) return null;
  return (
    <CollageModal open={open} onClose={onClose}>
      <HistoriaMuseuSection
        module={{ elements: data.elements, museumTitle: data.museumTitle, museumDate: data.museumDate }}
        senderName={person1}
        receiverName={person2}
      />
    </CollageModal>
  );
}

export function CollageChocolatesModal({
  open,
  onClose,
  data,
  person1,
  person2,
}: {
  open: boolean;
  onClose: () => void;
  data: ChocolateBoxData;
  person1: string;
  person2: string;
}) {
  if (!data.placements.length) return null;
  return (
    <CollageModal open={open} onClose={onClose}>
      <HistoriaChocolatesSection
        module={{ boxTitle: data.boxTitle, message: data.message, placements: data.placements }}
        senderName={person1}
        receiverName={person2}
      />
    </CollageModal>
  );
}
