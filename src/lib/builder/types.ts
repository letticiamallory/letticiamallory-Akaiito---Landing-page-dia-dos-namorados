import type { ChocolatePlacement, MuseumElement, PolaroidPhoto } from "@/lib/gift-types";
import type { BouquetConfig } from "@/lib/bouquet-catalog";
import type { LetterConfig } from "@/lib/letter-catalog";

export type SectionId =
  | "hero_couple"
  | "counter_together"
  | "photo_collage"
  | "favorite_song"
  | "love_letter"
  | "our_map"
  | "museum_of_us"
  | "polaroid_camera"
  | "chocolate_box"
  | "custom_message";

export interface HeroCoupleData {
  person1Name: string;
  person2Name: string;
  tagline?: string;
  backgroundPhoto?: string;
  bouquet: BouquetConfig;
}

export interface CounterTogetherData {
  startDate: string;
  metDate?: string;
  label?: string;
  showYears: boolean;
  showMonths: boolean;
  showDays: boolean;
  showHours: boolean;
}

export interface PhotoCollagePhoto {
  url: string;
  caption?: string;
  rotation?: number;
  /** Agrupa a foto em um momento (ex.: dates, trip) */
  momentId?: string;
}

export interface PhotoMoment {
  id: string;
  title: string;
}

export interface PhotoCollageData {
  photos: PhotoCollagePhoto[];
  layout: "scattered" | "grid" | "stack";
  /** Títulos dos momentos — fotos são agrupadas por momentId ou distribuídas automaticamente */
  moments?: PhotoMoment[];
}

export interface FavoriteSongData {
  platform: "spotify" | "youtube" | "custom";
  embedUrl: string;
  songTitle: string;
  artistName: string;
  note?: string;
  /** Capa quadrada estilo álbum — enviada pelo casal */
  albumCover?: string;
  polaroidLeftPhoto?: string;
  polaroidLeftCaption?: string;
  polaroidRightPhoto?: string;
  polaroidRightCaption?: string;
}

export interface LoveLetterData {
  message: string;
  letter: LetterConfig;
}

export interface OurMapData {
  lat: number;
  lng: number;
  label: string;
  address?: string;
}

export interface MuseumOfUsData {
  person1Name?: string;
  person2Name?: string;
  museumTitle?: string;
  museumDate?: string;
  elements: MuseumElement[];
}

export interface PolaroidCameraData {
  message: string;
  photos: PolaroidPhoto[];
  labelTexts?: string[];
}

export interface ChocolateBoxData {
  boxTitle?: string;
  message?: string;
  placements: ChocolatePlacement[];
}

export interface CustomMessageData {
  title?: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
}

export type SectionData =
  | HeroCoupleData
  | CounterTogetherData
  | PhotoCollageData
  | FavoriteSongData
  | LoveLetterData
  | OurMapData
  | MuseumOfUsData
  | PolaroidCameraData
  | ChocolateBoxData
  | CustomMessageData;

export interface BuilderSection {
  id: string;
  sectionId: SectionId;
  order: number;
  data: SectionData;
  isComplete: boolean;
}

export interface ScrapbookPageConfig {
  slug?: string;
  coupleNames: string;
  theme: "scrapbook_red";
  createdAt?: string;
}

export interface ScrapbookPresentData {
  version: 2;
  pageConfig: ScrapbookPageConfig;
  sections: BuilderSection[];
}

export function isScrapbookPresentData(data: unknown): data is ScrapbookPresentData {
  return (
    typeof data === "object" &&
    data !== null &&
    "version" in data &&
    (data as ScrapbookPresentData).version === 2 &&
    Array.isArray((data as ScrapbookPresentData).sections)
  );
}
