import type { SectionId, SectionData } from "./types";
import { DEFAULT_HERO_PHOTO } from "@/lib/hero-photo";
import { DEFAULT_BOUQUET } from "@/lib/bouquet-catalog";
import { DEFAULT_LETTER } from "@/lib/letter-catalog";

export interface SectionCatalogItem {
  id: SectionId;
  icon: string;
  name: string;
  description: string;
  locked?: boolean;
  premium?: boolean;
  premiumBadge?: string;
}

export const SECTIONS_CATALOG: SectionCatalogItem[] = [
  {
    id: "hero_couple",
    icon: "💕",
    name: "Casal",
    description: "Foto, nomes, data e um buquê personalizado",
    locked: true,
  },
  {
    id: "counter_together",
    icon: "⏳",
    name: "Contador",
    description: "Anos, meses, dias e horas juntos, ao vivo",
    locked: true,
  },
  {
    id: "favorite_song",
    icon: "🎵",
    name: "Nossa Música",
    description: "A música de vocês com capa e player integrados",
    locked: true,
  },
  {
    id: "polaroid_camera",
    icon: "📷",
    name: "Câmera do Presente",
    description: "Caixa animada + câmera polaroid com as fotos de vocês",
    premium: true,
    premiumBadge: "Recomendado",
  },
  {
    id: "photo_collage",
    icon: "🖼️",
    name: "Memórias",
    description: "Fotos organizadas por momentos, abre em galeria fullscreen",
  },
  {
    id: "love_letter",
    icon: "💌",
    name: "Carta de Amor",
    description: "Envelope animado com sua mensagem, papel e selo de cera",
  },
  {
    id: "museum_of_us",
    icon: "🏛️",
    name: "Museu de Nós",
    description: "Um museu só de vocês com quadros e fotos nas paredes",
    premium: true,
    premiumBadge: "Extra",
  },
  {
    id: "chocolate_box",
    icon: "🍫",
    name: "Caixa de Bombons",
    description: "Caixa interativa: abre a tampa e anima cada mordida",
    premium: true,
    premiumBadge: "Extra",
  },
  {
    id: "custom_message",
    icon: "♾️",
    name: "Despedida",
    description: "Mensagem final com título e assinatura",
    locked: true,
  },
];

export function getSectionCatalogItem(id: SectionId): SectionCatalogItem {
  return SECTIONS_CATALOG.find((s) => s.id === id)!;
}

export function defaultSectionData(sectionId: SectionId): SectionData {
  switch (sectionId) {
    case "hero_couple":
      return {
        person1Name: "",
        person2Name: "",
        tagline: "uma linda historia de amor",
        backgroundPhoto: DEFAULT_HERO_PHOTO,
        bouquet: { ...DEFAULT_BOUQUET },
      };
    case "counter_together":
      return {
        startDate: "",
        label: "Estamos juntos há",
        showYears: true,
        showMonths: true,
        showDays: true,
        showHours: true,
      };
    case "photo_collage":
      return {
        photos: [],
        layout: "scattered",
        moments: [
          { id: "dates", title: "Nossos Dates" },
          { id: "random", title: "Fotos aleatórias" },
          { id: "trip", title: "Primeira viagem" },
        ],
      };
    case "favorite_song":
      return {
        platform: "youtube",
        embedUrl: "",
        songTitle: "",
        artistName: "",
        note: "",
        albumCover: "",
        polaroidLeftPhoto: "",
        polaroidLeftCaption: "",
        polaroidRightPhoto: "",
        polaroidRightCaption: "",
      };
    case "love_letter":
      return {
        message: "",
        letter: { ...DEFAULT_LETTER },
      };
    case "our_map":
      return {
        lat: -23.5505,
        lng: -46.6333,
        label: "Foi aqui que nos conhecemos",
      };
    case "museum_of_us":
      return {
        museumTitle: "Museu de Nós",
        museumDate: "",
        elements: [],
      };
    case "polaroid_camera":
      return {
        message: "",
        photos: [
          { url: "", label: "" },
          { url: "", label: "" },
        ],
        labelTexts: [],
      };
    case "chocolate_box":
      return { boxTitle: "Para você", message: "", placements: [] };
    case "custom_message":
      return {
        title: "Para sempre",
        body: "Você é a melhor parte da minha história. Obrigado por cada momento ao seu lado.",
        ctaText: "Te amo ♡",
      };
  }
}

export const LOCKED_SECTIONS: SectionId[] = [
  "hero_couple",
  "counter_together",
  "favorite_song",
  "polaroid_camera",
  "custom_message",
];
export const FIRST_SECTION: SectionId = "hero_couple";
export const LAST_SECTION: SectionId = "custom_message";
export const MIN_SECTIONS = 4;
