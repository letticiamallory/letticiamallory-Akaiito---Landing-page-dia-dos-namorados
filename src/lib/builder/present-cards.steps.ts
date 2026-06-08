import {
  PRESENT_CARDS_CATALOG,
  type PresentCardItem,
  isPresentCardSelected,
} from "./present-cards.catalog";
import type { BuilderSection } from "./types";

export const BOUQUET_PRESENT_CARD: PresentCardItem = {
  id: "bouquet",
  icon: "💐",
  name: "Buquê especial",
  description:
    "Escolha as flores do buquê que aparece em um card só dele na página.",
  sectionIds: ["hero_couple"],
  locked: true,
};

/** Ordem dos passos de personalização — espelha a página entregue */
export const PRESENT_CUSTOMIZE_ORDER = [
  "music",
  "hero",
  "about_couple",
  "memories",
  "museum",
  "chocolate",
  "bouquet",
  "letter",
  "forever",
] as const;

export type PresentCustomizeCardId = (typeof PRESENT_CUSTOMIZE_ORDER)[number];

export interface PresentCustomizeStep {
  cardId: PresentCustomizeCardId;
  card: PresentCardItem;
  sections: BuilderSection[];
}

function getPresentCard(cardId: PresentCustomizeCardId): PresentCardItem {
  if (cardId === "bouquet") return BOUQUET_PRESENT_CARD;
  const card = PRESENT_CARDS_CATALOG.find((c) => c.id === cardId);
  if (!card) throw new Error(`Unknown present card: ${cardId}`);
  return card;
}

export function buildPresentCustomizeSteps(
  sections: BuilderSection[]
): PresentCustomizeStep[] {
  const bySectionId = new Map(sections.map((s) => [s.sectionId, s]));
  const steps: PresentCustomizeStep[] = [];

  for (const cardId of PRESENT_CUSTOMIZE_ORDER) {
    if (cardId === "bouquet") {
      const hero = bySectionId.get("hero_couple");
      if (hero) {
        steps.push({
          cardId,
          card: BOUQUET_PRESENT_CARD,
          sections: [hero],
        });
      }
      continue;
    }

    const card = getPresentCard(cardId);
    if (!isPresentCardSelected(sections, card)) continue;

    const related = card.sectionIds
      .map((id) => bySectionId.get(id))
      .filter((s): s is BuilderSection => Boolean(s));

    if (related.length === 0) continue;

    steps.push({ cardId, card, sections: related });
  }

  return steps;
}
