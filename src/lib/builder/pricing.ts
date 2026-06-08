import type { BuilderSection, SectionId } from "./types";
import { SECTIONS_CATALOG } from "./sections.catalog";

export const BASE_PRICE_CENTS = 490;

export const SECTION_PRICES: Record<SectionId, number> = {
  hero_couple: 0,
  custom_message: 0,
  counter_together: 0,
  photo_collage: 0,
  favorite_song: 0,
  love_letter: 0,
  our_map: 0,
  museum_of_us: 0,
  polaroid_camera: 0,
  chocolate_box: 0,
};

export function calculateTotalCents(_sections?: BuilderSection[]): number {
  return BASE_PRICE_CENTS;
}

export function formatTotal(sections: BuilderSection[]): string {
  const cents = calculateTotalCents(sections);
  return `R$ ${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2).replace(".", ",")}`;
}

export function getPremiumSectionNames(sections: BuilderSection[]): string[] {
  const catalogById = new Map(SECTIONS_CATALOG.map((item) => [item.id, item]));
  return sections
    .map((s) => catalogById.get(s.sectionId))
    .filter((item) => item?.premium)
    .map((item) => item!.name);
}
