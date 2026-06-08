import type { BuilderSection, SectionId } from "@/lib/builder/types";
import { createSection, validateSection } from "@/lib/builder/utils";

export type PandaCardId =
  | "hero"
  | "music"
  | "about_couple"
  | "memories"
  | "bouquet"
  | "letter"
  | "forever"
  | "project_museum"
  | "project_chocolate"
  | "project_polaroid";

export type PandaCardVariant = "dark" | "blue" | "hero" | "project";

export interface PandaCardDef {
  id: PandaCardId;
  kind: "content" | "project";
  title: string;
  variant: PandaCardVariant;
  sectionIds: SectionId[];
  icon?: string;
}

/** Ordem inspirada no Love Panda — projetos intercalados entre cards de conteúdo */
const PANDA_CARD_ORDER: PandaCardDef[] = [
  {
    id: "music",
    kind: "content",
    title: "Nossa Música",
    variant: "dark",
    sectionIds: ["favorite_song"],
    icon: "🎵",
  },
  {
    id: "hero",
    kind: "content",
    title: "Juntos para sempre",
    variant: "hero",
    sectionIds: ["polaroid_camera"],
    icon: "📷",
  },
  {
    id: "about_couple",
    kind: "content",
    title: "Sobre o casal",
    variant: "dark",
    sectionIds: ["hero_couple", "counter_together"],
    icon: "💕",
  },
  {
    id: "memories",
    kind: "content",
    title: "Memórias",
    variant: "dark",
    sectionIds: ["photo_collage"],
    icon: "📸",
  },
  {
    id: "project_museum",
    kind: "project",
    title: "Museu de Nós",
    variant: "project",
    sectionIds: ["museum_of_us"],
    icon: "🏛️",
  },
  {
    id: "project_chocolate",
    kind: "project",
    title: "Caixa de Bombons",
    variant: "project",
    sectionIds: ["chocolate_box"],
    icon: "🍫",
  },
  {
    id: "project_polaroid",
    kind: "project",
    title: "Câmera Polaroid",
    variant: "project",
    sectionIds: ["polaroid_camera"],
    icon: "📷",
  },
  {
    id: "bouquet",
    kind: "content",
    title: "Buquê especial",
    variant: "dark",
    sectionIds: ["hero_couple"],
    icon: "💐",
  },
  {
    id: "letter",
    kind: "content",
    title: "Carta de amor",
    variant: "dark",
    sectionIds: ["love_letter"],
    icon: "💌",
  },
  {
    id: "forever",
    kind: "content",
    title: "Para sempre",
    variant: "dark",
    sectionIds: ["custom_message"],
    icon: "♾️",
  },
];

function hasExperienceContent(section: BuilderSection): boolean {
  if (section.sectionId === "museum_of_us") {
    return true;
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

function isCardVisible(def: PandaCardDef, sections: BuilderSection[]): boolean {
  if (def.id === "forever") {
    return sections.some((s) => s.sectionId === "custom_message");
  }

  if (def.kind === "project") {
    if (def.id === "project_polaroid") return false;
    return sections.some((s) => validateSection(s) || hasExperienceContent(s));
  }

  if (def.id === "hero") return true;

  if (def.id === "music") {
    return sections.some((s) => s.sectionId === "favorite_song");
  }

  if (def.id === "about_couple") {
    return sections.some((s) => validateSection(s));
  }

  if (def.id === "bouquet") {
    return sections.some((s) => s.sectionId === "hero_couple");
  }

  if (def.id === "memories") {
    return true;
  }

  return sections.some((s) => validateSection(s));
}

export interface PandaCardBlock {
  def: PandaCardDef;
  sections: BuilderSection[];
}

export function buildPandaCards(sections: BuilderSection[]): PandaCardBlock[] {
  const byId = new Map(sections.map((s) => [s.sectionId, s]));

  return PANDA_CARD_ORDER.map((def) => {
    let cardSections =
      def.id === "hero" || def.id === "music"
        ? def.sectionIds.map((id) => byId.get(id)).filter((s): s is BuilderSection => Boolean(s))
        : def.sectionIds
            .map((id) => byId.get(id))
            .filter((s): s is BuilderSection => Boolean(s));

    if (def.id === "about_couple" && !cardSections.some((s) => s.sectionId === "counter_together")) {
      const counter = byId.get("counter_together") ?? createSection("counter_together", 1);
      cardSections = [...cardSections, counter];
    }

    if (def.id === "memories" && !cardSections.some((s) => s.sectionId === "photo_collage")) {
      cardSections = [byId.get("photo_collage") ?? createSection("photo_collage", 2), ...cardSections];
    }

    return isCardVisible(def, cardSections) ? { def, sections: cardSections } : null;
  }).filter((b): b is PandaCardBlock => b !== null);
}

export function getEmbedUrl(url?: string): string | null {
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
