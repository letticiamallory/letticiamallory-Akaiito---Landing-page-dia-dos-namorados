import type { BuilderSection, SectionId } from "@/lib/builder/types";
import { validateSection } from "@/lib/builder/utils";

export type StoryChapterId =
  | "opening"
  | "time"
  | "memories"
  | "soundtrack"
  | "letter"
  | "place"
  | "surprises"
  | "finale";

export interface StoryChapterDef {
  id: StoryChapterId;
  title: string;
  subtitle: string;
  emoji: string;
  sectionIds: SectionId[];
}

/** Fluxo narrativo inspirado em LoveClubo / Givly / YourLovePage */
export const STORY_CHAPTERS: StoryChapterDef[] = [
  {
    id: "opening",
    title: "Nossa história",
    subtitle: "Começa com um buquê e um sorriso",
    emoji: "💐",
    sectionIds: ["hero_couple"],
  },
  {
    id: "time",
    title: "Nosso tempo",
    subtitle: "Cada segundo juntos",
    emoji: "⏳",
    sectionIds: ["counter_together"],
  },
  {
    id: "memories",
    title: "Memórias",
    subtitle: "Fotos que a gente guarda",
    emoji: "🖼️",
    sectionIds: ["photo_collage"],
  },
  {
    id: "soundtrack",
    title: "Trilha sonora",
    subtitle: "A música de vocês",
    emoji: "🎵",
    sectionIds: ["favorite_song"],
  },
  {
    id: "letter",
    title: "Carta secreta",
    subtitle: "Palavras do coração",
    emoji: "💌",
    sectionIds: ["love_letter"],
  },
  {
    id: "place",
    title: "Nosso lugar",
    subtitle: "Onde tudo começou",
    emoji: "📍",
    sectionIds: ["our_map"],
  },
  {
    id: "surprises",
    title: "Surpresas",
    subtitle: "Toque para descobrir",
    emoji: "✨",
    sectionIds: ["museum_of_us", "polaroid_camera", "chocolate_box"],
  },
  {
    id: "finale",
    title: "Para sempre",
    subtitle: "A última página",
    emoji: "♾️",
    sectionIds: ["custom_message"],
  },
];

export const SURPRISE_SECTION_IDS: SectionId[] = [
  "museum_of_us",
  "polaroid_camera",
  "chocolate_box",
];

export interface StoryChapterBlock {
  def: StoryChapterDef;
  sections: BuilderSection[];
}

export function groupSectionsForStory(sections: BuilderSection[]): StoryChapterBlock[] {
  const byId = new Map(sections.map((s) => [s.sectionId, s]));

  return STORY_CHAPTERS.map((def) => {
    const chapterSections = def.sectionIds
      .map((id) => byId.get(id))
      .filter((s): s is BuilderSection => Boolean(s));

    const visible =
      def.id === "opening" || def.id === "finale"
        ? chapterSections.length > 0
        : def.id === "surprises"
          ? chapterSections.some((s) => validateSection(s) || hasSurpriseContent(s))
          : chapterSections.some((s) => validateSection(s));

    return visible ? { def, sections: chapterSections } : null;
  }).filter((b): b is StoryChapterBlock => b !== null);
}

function hasSurpriseContent(section: BuilderSection): boolean {
  if (section.sectionId === "museum_of_us") {
    return ((section.data as { elements?: unknown[] }).elements?.length ?? 0) > 0;
  }
  if (section.sectionId === "polaroid_camera") {
    const d = section.data as { photos?: { url: string }[]; message?: string };
    return Boolean(d.message?.trim()) || (d.photos?.filter((p) => p.url).length ?? 0) > 0;
  }
  if (section.sectionId === "chocolate_box") {
    return ((section.data as { placements?: unknown[] }).placements?.length ?? 0) > 0;
  }
  return validateSection(section);
}
