import type { BuilderSection } from "./types";
import type { BuilderStep } from "@/builder/store/builder.store";
import { defaultSectionData } from "./sections.catalog";
import { DEFAULT_HERO_PHOTO, resolveHeroPhoto } from "@/lib/hero-photo";

type DraftState = {
  sections: BuilderSection[];
  builderStep: BuilderStep;
  buyerEmail: string;
};

function hasSectionUserEdits(section: BuilderSection): boolean {
  const defaults = defaultSectionData(section.sectionId);

  switch (section.sectionId) {
    case "hero_couple": {
      const d = section.data as typeof defaults & {
        person1Name?: string;
        person2Name?: string;
        tagline?: string;
        backgroundPhoto?: string;
      };
      const def = defaults as typeof d;
      return Boolean(
        d.person1Name?.trim() ||
          d.person2Name?.trim() ||
          resolveHeroPhoto(d.backgroundPhoto) !== DEFAULT_HERO_PHOTO ||
          (d.tagline?.trim() && d.tagline !== def.tagline)
      );
    }
    case "counter_together":
      return Boolean((section.data as { startDate?: string }).startDate?.trim());
    case "favorite_song": {
      const d = section.data as {
        embedUrl?: string;
        songTitle?: string;
        artistName?: string;
        note?: string;
        albumCover?: string;
      };
      return Boolean(
        d.embedUrl?.trim() ||
          d.songTitle?.trim() ||
          d.artistName?.trim() ||
          d.note?.trim() ||
          d.albumCover?.trim()
      );
    }
    case "polaroid_camera": {
      const d = section.data as { photos?: { url?: string }[]; message?: string };
      return Boolean(
        d.message?.trim() ||
          d.photos?.some((photo) => photo.url?.trim())
      );
    }
    case "photo_collage": {
      const d = section.data as { photos?: { url?: string }[] };
      return Boolean(d.photos?.some((photo) => photo.url?.trim()));
    }
    case "love_letter":
      return Boolean((section.data as { message?: string }).message?.trim());
    case "museum_of_us": {
      const d = section.data as { elements?: unknown[]; museumTitle?: string; museumDate?: string };
      const def = defaults as { museumTitle?: string };
      return Boolean(
        (d.elements?.length ?? 0) > 0 ||
          d.museumDate?.trim() ||
          (d.museumTitle?.trim() && d.museumTitle !== def.museumTitle)
      );
    }
    case "chocolate_box": {
      const d = section.data as { placements?: unknown[]; message?: string; boxTitle?: string };
      const def = defaults as { boxTitle?: string };
      return Boolean(
        (d.placements?.length ?? 0) > 0 ||
          d.message?.trim() ||
          (d.boxTitle?.trim() && d.boxTitle !== def.boxTitle)
      );
    }
    case "custom_message": {
      const d = section.data as { title?: string; body?: string; ctaText?: string };
      const def = defaults as typeof d;
      return Boolean(
        (d.title?.trim() && d.title !== def.title) ||
          (d.body?.trim() && d.body !== def.body) ||
          (d.ctaText?.trim() && d.ctaText !== def.ctaText)
      );
    }
    default:
      return false;
  }
}

export function hasDraftProgress(state: DraftState): boolean {
  if (state.builderStep !== "choose") return true;
  if (state.buyerEmail.trim()) return true;
  if (state.sections.some((section) => section.isComplete)) return true;
  return state.sections.some(hasSectionUserEdits);
}

export function getBuilderResumePath(state: {
  builderStep: BuilderStep;
  currentSectionIndex: number;
}): string {
  if (state.builderStep === "preview") return "/criar/preview";
  if (state.builderStep === "customize") {
    return `/criar/personalizar/${Math.max(0, state.currentSectionIndex)}`;
  }
  return "/criar/personalizar/0";
}
