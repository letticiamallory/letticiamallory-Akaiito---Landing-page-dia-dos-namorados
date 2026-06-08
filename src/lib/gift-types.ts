export interface JoguinhoData {
  senderName: string;
  receiverName: string;
  senderPhoto?: string;
  receiverPhoto?: string;
  loveMessage?: string;
}

import type { BouquetConfig } from "@/lib/bouquet-catalog";
import type { LetterConfig } from "@/lib/letter-catalog";

export interface CartaData {
  senderName: string;
  receiverName: string;
  message: string;
  letter: LetterConfig;
  bouquet: BouquetConfig;
  /** legado — presentes antigos sem buquê customizado */
  flowerColors?: string[];
}

export interface MuseuPhoto {
  url: string;
  title: string;
  caption: string;
}

export interface MuseumElement {
  id: string;
  type: "frame" | "spectator";
  frameIndex?: number;
  spectatorIndex?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  photoUrl?: string;
  labelTitle?: string;
  labelSubtitle?: string;
}

export interface MuseuData {
  senderName: string;
  receiverName: string;
  coupleName?: string;
  museumTitle?: string;
  museumDate?: string;
  elements?: MuseumElement[];
  /** legado — galeria simples */
  photos?: MuseuPhoto[];
}

export interface PolaroidPhoto {
  url: string;
  label?: string;
}

export interface PolaroidData {
  senderName: string;
  receiverName: string;
  message: string;
  photos: PolaroidPhoto[];
  labelTexts?: string[];
}

export interface SlotData {
  senderName: string;
  receiverName: string;
  surprises: string[];
}

export interface ChocolatePlacement {
  id: string;
  slotIndex: number;
  chocolateIndex: number;
  /** 0 = inteiro; avança a cada clique até sumir */
  biteStage?: number;
}

import type { HistoriaThemeId } from "@/lib/historia-themes";

export interface ChocolatesData {
  senderName: string;
  receiverName: string;
  coupleName?: string;
  boxTitle?: string;
  message?: string;
  placements: ChocolatePlacement[];
}

export interface HistoriaTimelineItem {
  id: string;
  date: string;
  emoji?: string;
  title: string;
  description: string;
}

export interface HistoriaPhoto {
  url: string;
  caption?: string;
}

export interface HistoriaMusic {
  title?: string;
  artist?: string;
  album?: string;
  embedUrl?: string;
  story?: string;
  polaroidLeftPhoto?: string;
  polaroidLeftCaption?: string;
  polaroidRightPhoto?: string;
  polaroidRightCaption?: string;
}

export interface HistoriaPlace {
  name: string;
  address?: string;
  description?: string;
}

export interface HistoriaFacts {
  howWeMet?: string;
  favoriteMovie?: string;
  favoriteFood?: string;
  dreamDestination?: string;
  insideJoke?: string;
  lovesAboutYou?: string;
  lovesAboutThem?: string;
}

export interface HistoriaStarMap {
  date: string;
  city?: string;
}

/** Carta animada + buquê (ex-produto `carta`) */
export interface HistoriaCartaModule {
  message: string;
  letter: LetterConfig;
  bouquet: BouquetConfig;
}

/** Câmera polaroid interativa (ex-produto `polaroid`) */
export interface HistoriaPolaroidModule {
  message: string;
  photos: PolaroidPhoto[];
  labelTexts?: string[];
}

/** Quiz de compatibilidade (ex-produto `joguinho`) */
export interface HistoriaJoguinhoModule {
  senderPhoto?: string;
  receiverPhoto?: string;
  loveMessage?: string;
}

/** Salão de museu (ex-produto `museu`) */
export interface HistoriaMuseuModule {
  museumTitle?: string;
  museumDate?: string;
  coupleName?: string;
  elements: MuseumElement[];
}

/** Caixa de chocolates (ex-produto `chocolates`) */
export interface HistoriaChocolatesModule {
  boxTitle?: string;
  message?: string;
  coupleName?: string;
  placements: ChocolatePlacement[];
}

/** Máquina de surpresas (ex-produto `slot`) */
export interface HistoriaSlotModule {
  surprises: string[];
}

export interface HistoriaModules {
  carta?: HistoriaCartaModule;
  polaroid?: HistoriaPolaroidModule;
  joguinho?: HistoriaJoguinhoModule;
  museu?: HistoriaMuseuModule;
  chocolates?: HistoriaChocolatesModule;
  slot?: HistoriaSlotModule;
}

export interface HistoriaData {
  senderName: string;
  receiverName: string;
  coupleDisplayName?: string;
  relationshipStart: string;
  heroSubtitle?: string;
  heroPhotoUrl?: string;
  theme: HistoriaThemeId;
  music?: HistoriaMusic;
  photos: HistoriaPhoto[];
  galleryTitle?: string;
  timeline: HistoriaTimelineItem[];
  letterTitle?: string;
  letter: string;
  letterTypewriter?: boolean;
  place?: HistoriaPlace;
  facts?: HistoriaFacts;
  starMap?: HistoriaStarMap;
  footerPhrase?: string;
  modules?: HistoriaModules;
}

export interface KitData {
  senderName: string;
  receiverName: string;
  joguinho?: JoguinhoData;
  carta?: CartaData;
  museu?: MuseuData;
  slot?: SlotData;
}

export type GiftData =
  | JoguinhoData
  | CartaData
  | MuseuData
  | PolaroidData
  | SlotData
  | ChocolatesData
  | HistoriaData
  | KitData;

export function parseGiftData<T extends GiftData>(raw: string): T {
  return JSON.parse(raw) as T;
}
