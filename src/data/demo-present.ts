import { DEFAULT_BOUQUET } from "@/lib/bouquet-catalog";
import { DEFAULT_LETTER } from "@/lib/letter-catalog";
import type { BuilderSection, ScrapbookPresentData } from "@/lib/builder/types";

export const DEMO_PRESENT_SLUG = "demo-preview";

const demoAsset = (name: string) => `/assets/demo/${name}`;

function demoSection(
  sectionId: BuilderSection["sectionId"],
  order: number,
  data: BuilderSection["data"]
): BuilderSection {
  return {
    id: `demo-${sectionId}`,
    sectionId,
    order,
    data,
    isComplete: true,
  };
}

export const DEMO_PRESENT: ScrapbookPresentData = {
  version: 2,
  pageConfig: {
    slug: DEMO_PRESENT_SLUG,
    coupleNames: "Ana & João",
    theme: "scrapbook_red",
    createdAt: "2026-06-08T00:00:00.000Z",
  },
  sections: [
    demoSection("favorite_song", 0, {
      platform: "youtube",
      embedUrl: "https://www.youtube.com/watch?v=rtOvBOTyX00",
      songTitle: "A Thousand Years",
      artistName: "Christina Perri",
      note: "a trilha do nosso amor",
      albumCover: demoAsset("couple-3.jpg"),
      polaroidLeftPhoto: demoAsset("couple-1.jpg"),
      polaroidLeftCaption: "para sempre ♡",
      polaroidRightPhoto: demoAsset("couple-2.jpg"),
      polaroidRightCaption: "te amo muito",
    }),
    demoSection("polaroid_camera", 1, {
      message: "",
      photos: [
        { url: demoAsset("couple-1.jpg"), label: "para sempre ♡" },
        { url: demoAsset("couple-2.jpg"), label: "te amo muito" },
      ],
      labelTexts: ["para sempre ♡", "te amo muito"],
    }),
    demoSection("hero_couple", 2, {
      person1Name: "Ana",
      person2Name: "João",
      tagline: "Uma história de amor",
      backgroundPhoto: demoAsset("couple-3.jpg"),
      bouquet: { ...DEFAULT_BOUQUET },
    }),
    demoSection("counter_together", 3, {
      startDate: "2022-03-15",
      label: "Estamos juntos há",
      showYears: true,
      showMonths: true,
      showDays: true,
      showHours: true,
    }),
    demoSection("photo_collage", 4, {
      photos: [
        { url: demoAsset("couple-4.jpg"), caption: "Nossa praia", momentId: "trip" },
        { url: demoAsset("couple-5.jpg"), caption: "Sempre juntos", momentId: "dates" },
        { url: demoAsset("couple-6.jpg"), caption: "Para sempre", momentId: "random" },
      ],
      layout: "scattered",
      moments: [
        { id: "dates", title: "Nossos Dates" },
        { id: "random", title: "Fotos aleatórias" },
        { id: "trip", title: "Primeira viagem" },
      ],
    }),
    demoSection("museum_of_us", 5, {
      person1Name: "Ana",
      person2Name: "João",
      museumTitle: "Museu de Nós",
      museumDate: "Desde março de 2022",
      elements: [
        {
          id: "demo-frame-1",
          type: "frame",
          frameIndex: 1,
          x: 30,
          y: 105,
          width: 160,
          height: 120,
          zIndex: 3,
          photoUrl: demoAsset("couple-1.jpg"),
        },
        {
          id: "demo-frame-5",
          type: "frame",
          frameIndex: 5,
          x: 230,
          y: 112,
          width: 180,
          height: 135,
          zIndex: 3,
          photoUrl: demoAsset("couple-5.jpg"),
        },
        {
          id: "demo-frame-2",
          type: "frame",
          frameIndex: 2,
          x: 440,
          y: 88,
          width: 140,
          height: 105,
          zIndex: 3,
          photoUrl: demoAsset("couple-2.jpg"),
        },
        {
          id: "demo-spectator-2",
          type: "spectator",
          spectatorIndex: 2,
          x: 150,
          y: 288,
          width: 300,
          height: 200,
          zIndex: 4,
        },
      ],
    }),
    demoSection("chocolate_box", 6, {
      boxTitle: "Para você",
      message: "Com todo meu amor ♡",
      placements: Array.from({ length: 12 }, (_, slotIndex) => ({
        id: `demo-chocolate-${slotIndex}`,
        slotIndex,
        chocolateIndex: slotIndex % 6,
      })),
    }),
    demoSection("love_letter", 7, {
      message:
        "Você é a pessoa mais incrível que já conheci. Cada dia ao seu lado é um presente que não tem preço.",
      letter: { ...DEFAULT_LETTER },
    }),
    demoSection("custom_message", 8, {
      title: "Para sempre",
      body: "Obrigado por fazer parte da minha história.",
      ctaText: "Te amo ♡",
    }),
  ],
};
