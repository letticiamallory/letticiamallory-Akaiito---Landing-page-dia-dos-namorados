import type { BuilderSection, SectionId } from "@/lib/builder/types";
import { validateSection } from "@/lib/builder/utils";

export type LoveScreenId =
  | "welcome"
  | "counter"
  | "gallery"
  | "soundtrack"
  | "letter"
  | "place"
  | "museum"
  | "polaroid"
  | "chocolate"
  | "forever";

export interface LoveScreenDef {
  id: LoveScreenId;
  title: string;
  subtitle: string;
  icon: string;
  sectionIds: SectionId[];
}

/** Fluxo inspirado em DearYou, Loovvi, TempoJuntos e Love Wrapped */
export const LOVE_SCREENS: LoveScreenDef[] = [
  {
    id: "welcome",
    title: "Para você",
    subtitle: "Uma surpresa feita com amor",
    icon: "💐",
    sectionIds: ["hero_couple"],
  },
  {
    id: "counter",
    title: "Nosso tempo",
    subtitle: "Cada segundo ao seu lado",
    icon: "⏳",
    sectionIds: ["counter_together"],
  },
  {
    id: "gallery",
    title: "Memórias",
    subtitle: "Os momentos que guardamos",
    icon: "📸",
    sectionIds: ["photo_collage"],
  },
  {
    id: "soundtrack",
    title: "Trilha sonora",
    subtitle: "A música de vocês",
    icon: "🎵",
    sectionIds: ["favorite_song"],
  },
  {
    id: "letter",
    title: "Carta secreta",
    subtitle: "Palavras do coração",
    icon: "💌",
    sectionIds: ["love_letter"],
  },
  {
    id: "place",
    title: "Nosso lugar",
    subtitle: "Onde tudo começou",
    icon: "📍",
    sectionIds: ["our_map"],
  },
  {
    id: "museum",
    title: "Museu de Nós",
    subtitle: "Nossa galeria particular",
    icon: "🏛️",
    sectionIds: ["museum_of_us"],
  },
  {
    id: "polaroid",
    title: "Câmera Polaroid",
    subtitle: "Fotos instantâneas de amor",
    icon: "📷",
    sectionIds: ["polaroid_camera"],
  },
  {
    id: "chocolate",
    title: "Caixa de Bombons",
    subtitle: "Doces surpresas",
    icon: "🍫",
    sectionIds: ["chocolate_box"],
  },
  {
    id: "forever",
    title: "Para sempre",
    subtitle: "A última página",
    icon: "♾️",
    sectionIds: ["custom_message"],
  },
];

export interface LoveScreenBlock {
  def: LoveScreenDef;
  sections: BuilderSection[];
}

function hasExperienceContent(section: BuilderSection): boolean {
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

const EMBEDDED_SCREEN_IDS: LoveScreenId[] = ["museum", "polaroid", "chocolate"];

export function buildLoveScreens(sections: BuilderSection[]): LoveScreenBlock[] {
  const byId = new Map(sections.map((s) => [s.sectionId, s]));

  return LOVE_SCREENS.map((def) => {
    const screenSections = def.sectionIds
      .map((id) => byId.get(id))
      .filter((s): s is BuilderSection => Boolean(s));

    const visible =
      def.id === "welcome" || def.id === "forever"
        ? screenSections.length > 0
        : EMBEDDED_SCREEN_IDS.includes(def.id)
          ? screenSections.some((s) => validateSection(s) || hasExperienceContent(s))
          : screenSections.some((s) => validateSection(s));

    return visible ? { def, sections: screenSections } : null;
  }).filter((b): b is LoveScreenBlock => b !== null);
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
