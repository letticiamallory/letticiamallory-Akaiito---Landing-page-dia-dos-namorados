import { nanoid } from "nanoid";
import type {
  BuilderSection,
  FavoriteSongData,
  HeroCoupleData,
  ScrapbookPresentData,
  SectionData,
  SectionId,
} from "./types";
import { isYouTubeMusicUrl } from "@/lib/music-metadata";
import { resolveHeroPhoto } from "@/lib/hero-photo";
import {
  defaultSectionData,
  FIRST_SECTION,
  LAST_SECTION,
  LOCKED_SECTIONS,
} from "./sections.catalog";

export function createSection(sectionId: SectionId, order: number): BuilderSection {
  return {
    id: nanoid(),
    sectionId,
    order,
    data: defaultSectionData(sectionId),
    isComplete: false,
  };
}

export { createSection as createBuilderSection };

export function initialSections(): BuilderSection[] {
  const defaults: SectionId[] = [
    "favorite_song",
    "polaroid_camera",
    "hero_couple",
    "counter_together",
    "photo_collage",
    "love_letter",
    "custom_message",
  ];
  return defaults.map((id, i) => createSection(id, i));
}

export function getCoupleNames(sections: BuilderSection[]): {
  person1: string;
  person2: string;
} {
  const hero = sections.find((s) => s.sectionId === "hero_couple");
  if (!hero) return { person1: "", person2: "" };
  const data = hero.data as HeroCoupleData;
  return { person1: data.person1Name, person2: data.person2Name };
}

export function buildCoupleNames(sections: BuilderSection[]): string {
  const { person1, person2 } = getCoupleNames(sections);
  if (person1 && person2) return `${person1} & ${person2}`;
  return person1 || person2 || "Casal";
}

export function validateSection(section: BuilderSection): boolean {
  const d = section.data;
  switch (section.sectionId) {
    case "hero_couple": {
      const h = d as HeroCoupleData;
      return Boolean(h.person1Name.trim() && h.person2Name.trim());
    }
    case "counter_together":
      return Boolean((d as { startDate: string }).startDate);
    case "photo_collage":
      return (d as { photos: unknown[] }).photos.filter((p) => (p as { url?: string }).url).length >= 2;
    case "favorite_song": {
      const m = d as FavoriteSongData;
      return isYouTubeMusicUrl(m.embedUrl);
    }
    case "love_letter":
      return Boolean((d as { message: string }).message?.trim());
    case "our_map":
      return Boolean((d as { label: string }).label.trim());
    case "museum_of_us":
      return true;
    case "polaroid_camera": {
      const p = d as { photos: { url: string }[]; message?: string };
      const filled = p.photos.filter((photo) => photo.url?.trim()).length;
      return filled >= 2;
    }
    case "chocolate_box":
      return (d as { placements: unknown[] }).placements.length > 0;
    case "custom_message":
      return Boolean((d as { body: string }).body.trim());
    default:
      return true;
  }
}

export function sortSections(sections: BuilderSection[]): BuilderSection[] {
  const byOrder = [...sections].sort((a, b) => a.order - b.order);
  const hero = byOrder.filter((s) => s.sectionId === FIRST_SECTION);
  const finale = byOrder.filter((s) => s.sectionId === LAST_SECTION);
  const middle = byOrder.filter(
    (s) => s.sectionId !== FIRST_SECTION && s.sectionId !== LAST_SECTION
  );
  return [...hero, ...middle, ...finale].map((s, i) => ({ ...s, order: i }));
}

export function buildPresentData(sections: BuilderSection[]): ScrapbookPresentData {
  const sorted = sortSections(sections);
  return {
    version: 2,
    pageConfig: {
      coupleNames: buildCoupleNames(sorted),
      theme: "scrapbook_red",
      createdAt: new Date().toISOString(),
    },
    sections: sorted.map((s) => {
      const base = { ...s, isComplete: validateSection(s) };
      if (s.sectionId !== "hero_couple") return base;
      const hero = s.data as HeroCoupleData;
      return {
        ...base,
        data: {
          ...hero,
          backgroundPhoto: resolveHeroPhoto(hero.backgroundPhoto),
        },
      };
    }),
  };
}

export function updateSectionData(
  sections: BuilderSection[],
  id: string,
  patch: Partial<SectionData>
): BuilderSection[] {
  return sections.map((s) =>
    s.id === id ? { ...s, data: { ...s.data, ...patch } as SectionData } : s
  );
}
