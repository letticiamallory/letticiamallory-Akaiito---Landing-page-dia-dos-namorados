export const CANVAS_W = 1728;
export const CANVAS_H = 1117;

export const MUSEUM_ASSETS = {
  /** Cenário completo — Museum of Us.svg; placa com título personalizável */
  background: "/museum/museum-of-us.svg",
  titleSection: "/museum/title-section.svg",
  artworkLabel: "/museum/artwork-label.svg",
  /** Placa já vem no SVG; só o texto é sobreposto */
  builtInTitleBar: true,
} as const;

/** Posição da placa de título no cenário (coordenadas do canvas 1728×1117) */
export const MUSEUM_TITLE_PLAQUE = {
  titleTop: 200,
  dateTop: 258,
  titleSize: 44,
  dateSize: 24,
} as const;

export interface PhotoRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FrameDefinition {
  id: number;
  file: string;
  vw: number;
  vh: number;
  photo: PhotoRect;
  defaultW: number;
}

export interface SpectatorDefinition {
  id: number;
  file: string;
  vw: number;
  vh: number;
  defaultW: number;
}

export const FRAME_DATA: FrameDefinition[] = [
  { id: 1, file: "/museum/frame-1.svg", vw: 798, vh: 645, photo: { x: 132, y: 123, w: 540, h: 399 }, defaultW: 280 },
  { id: 2, file: "/museum/frame-2.svg", vw: 687, vh: 804, photo: { x: 174, y: 175.5, w: 336, h: 453 }, defaultW: 280 },
  { id: 3, file: "/museum/frame-3.svg", vw: 687, vh: 693, photo: { x: 93, y: 87, w: 498, h: 513 }, defaultW: 240 },
  { id: 4, file: "/museum/frame-4.svg", vw: 678, vh: 801, photo: { x: 138, y: 150, w: 405, h: 516 }, defaultW: 280 },
  { id: 5, file: "/museum/frame-5.svg", vw: 915, vh: 702, photo: { x: 135, y: 165, w: 624, h: 423 }, defaultW: 300 },
  { id: 6, file: "/museum/frame-6.svg", vw: 687, vh: 747, photo: { x: 126, y: 126, w: 438, h: 498 }, defaultW: 300 },
  { id: 7, file: "/museum/frame-7.svg", vw: 681, vh: 612, photo: { x: 111, y: 114, w: 459, h: 381 }, defaultW: 240 },
  { id: 8, file: "/museum/frame-8.svg", vw: 696, vh: 836, photo: { x: 103, y: 95, w: 498, h: 642 }, defaultW: 280 },
  { id: 9, file: "/museum/frame-9.svg", vw: 813, vh: 648, photo: { x: 138, y: 123, w: 540, h: 396 }, defaultW: 280 },
];

export const SPECTATOR_DATA: SpectatorDefinition[] = [
  { id: 1, file: "/museum/spectator-1.svg", vw: 1048, vh: 349, defaultW: 1100 },
  { id: 2, file: "/museum/spectator-2.svg", vw: 1068, vh: 351, defaultW: 1100 },
  { id: 3, file: "/museum/spectator-3.svg", vw: 1047, vh: 352, defaultW: 1100 },
];

export function getFrameDef(index: number) {
  return FRAME_DATA.find((f) => f.id === index);
}

export function getSpectatorDef(index: number) {
  return SPECTATOR_DATA.find((s) => s.id === index);
}

export function defaultFrameSize(def: FrameDefinition) {
  const width = def.defaultW;
  return { width, height: (width * def.vh) / def.vw };
}

export function defaultSpectatorSize(def: SpectatorDefinition) {
  const width = def.defaultW;
  return { width, height: (width * def.vh) / def.vw };
}

/** Expande a área da foto para preencher sob a passe-partout da moldura */
const PHOTO_AREA_BLEED = 0.06;

export function photoPercent(def: FrameDefinition) {
  const { photo, vw, vh } = def;
  const b = PHOTO_AREA_BLEED;
  const x = Math.max(0, photo.x - photo.w * b);
  const y = Math.max(0, photo.y - photo.h * b);
  const w = Math.min(vw - x, photo.w * (1 + 2 * b));
  const h = Math.min(vh - y, photo.h * (1 + 2 * b));
  return {
    left: `${(x / vw) * 100}%`,
    top: `${(y / vh) * 100}%`,
    width: `${(w / vw) * 100}%`,
    height: `${(h / vh) * 100}%`,
  };
}
