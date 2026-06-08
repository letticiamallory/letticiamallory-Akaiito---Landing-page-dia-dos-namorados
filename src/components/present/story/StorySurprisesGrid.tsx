"use client";

import type { BuilderSection, PolaroidCameraData } from "@/lib/builder/types";
import { getSectionCatalogItem } from "@/lib/builder/sections.catalog";
import { useCollageReveal } from "@/hooks/useCollageReveal";

const SURPRISE_META: Record<
  string,
  { gradient: string; cta: string; preview?: string }
> = {
  museum_of_us: {
    gradient: "linear-gradient(145deg, #3d1515 0%, #1a0808 100%)",
    cta: "Entrar no museu",
    preview: "/museum/museum-of-us.svg",
  },
  polaroid_camera: {
    gradient: "linear-gradient(145deg, #2a1a2e 0%, #120810 100%)",
    cta: "Abrir câmera",
    preview: "/polaroid/iphone-1.svg",
  },
  chocolate_box: {
    gradient: "linear-gradient(145deg, #2e1810 0%, #140a06 100%)",
    cta: "Abrir a caixa",
    preview: "/chocolate/box.svg",
  },
};

function SurpriseCard({
  section,
  onOpen,
  index,
}: {
  section: BuilderSection;
  onOpen: () => void;
  index: number;
}) {
  const catalog = getSectionCatalogItem(section.sectionId);
  const meta = SURPRISE_META[section.sectionId] ?? {
    gradient: "linear-gradient(145deg, #2a1010, #100505)",
    cta: "Abrir",
  };
  const { ref, visible, className } = useCollageReveal<HTMLButtonElement>();

  const previewPhoto =
    section.sectionId === "polaroid_camera"
      ? (section.data as PolaroidCameraData).photos.find((p) => p.url)?.url
      : undefined;

  return (
    <button
      ref={ref}
      type="button"
      className={`story-surprise-card ${className} ${
        visible ? "story-surprise-card--visible" : ""
      }`.trim()}
      style={{
        background: meta.gradient,
        transitionDelay: `${index * 80}ms`,
      }}
      onClick={onOpen}
    >
      <div className="story-surprise-card__shine" aria-hidden />
      <div className="story-surprise-card__preview">
        {previewPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewPhoto} alt="" className="story-surprise-card__photo" />
        ) : meta.preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={meta.preview} alt="" className="story-surprise-card__asset" />
        ) : (
          <span className="story-surprise-card__icon">{catalog.icon}</span>
        )}
      </div>
      <div className="story-surprise-card__content">
        <span className="story-surprise-card__badge">Interativo</span>
        <h3 className="story-surprise-card__name">{catalog.name}</h3>
        <p className="story-surprise-card__desc">{catalog.description}</p>
        <span className="story-surprise-card__cta">{meta.cta}</span>
      </div>
    </button>
  );
}

export function StorySurprisesGrid({
  sections,
  onOpenPolaroid,
  onOpenMuseum,
  onOpenChocolates,
}: {
  sections: BuilderSection[];
  onOpenPolaroid: () => void;
  onOpenMuseum: () => void;
  onOpenChocolates: () => void;
}) {
  const handlers: Record<string, () => void> = {
    polaroid_camera: onOpenPolaroid,
    museum_of_us: onOpenMuseum,
    chocolate_box: onOpenChocolates,
  };

  if (!sections.length) return null;

  return (
    <div className="story-surprises">
      <p className="story-surprises__hint">Experiências especiais esperando por você</p>
      <div className="story-surprises__grid">
        {sections.map((section, i) => (
          <SurpriseCard
            key={section.id}
            section={section}
            index={i}
            onOpen={handlers[section.sectionId] ?? (() => undefined)}
          />
        ))}
      </div>
    </div>
  );
}
