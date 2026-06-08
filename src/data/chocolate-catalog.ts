export const CANVAS_W = 925;
export const CANVAS_H = 715;

/** Altura máxima da caixa no editor (px) */
export const EDITOR_MAX_HEIGHT = 400;

/** Escala e largura do stage derivadas só da altura — não alterar EDITOR_MAX_HEIGHT */
export const EDITOR_SCALE = EDITOR_MAX_HEIGHT / CANVAS_H;
export const EDITOR_STAGE_WIDTH = Math.ceil(CANVAS_W * EDITOR_SCALE);

export const CHOCOLATE_ASSETS = {
  box: "/chocolate/box-empty.svg",
  boxFilled: "/chocolate/box.svg",
  lid: "/chocolate/lid.svg",
  components: "/chocolate/components.svg",
  sheetW: 578,
  sheetH: 648,
} as const;

export type CropRect = [number, number, number, number];
/** Recorte no sprite sheet ou caminho de imagem PNG/WebP/SVG */
export type BiteStage = CropRect | string;

export interface BoxSlot {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ChocolateType {
  id: number;
  name: string;
  /** SVG/PNG do chocolate inteiro (sidebar + estágio 0 na caixa) */
  file: string;
  /** Mordidas após o primeiro clique — PNG individual ou recorte do sprite */
  biteStages: BiteStage[];
}

/** 12 compartimentos da caixa (viewBox 925×715) */
export const BOX_SLOTS: BoxSlot[] = [
  { index: 0, x: 60, y: 50, width: 190, height: 195 },
  { index: 1, x: 265, y: 50, width: 190, height: 195 },
  { index: 2, x: 470, y: 50, width: 190, height: 195 },
  { index: 3, x: 675, y: 50, width: 190, height: 195 },
  { index: 4, x: 60, y: 260, width: 190, height: 195 },
  { index: 5, x: 265, y: 260, width: 190, height: 195 },
  { index: 6, x: 470, y: 260, width: 190, height: 195 },
  { index: 7, x: 675, y: 260, width: 190, height: 195 },
  { index: 8, x: 60, y: 470, width: 190, height: 195 },
  { index: 9, x: 265, y: 470, width: 190, height: 195 },
  { index: 10, x: 470, y: 470, width: 190, height: 195 },
  { index: 11, x: 675, y: 470, width: 190, height: 195 },
];

/** Clássico — sem Better, Heart Aches Bite 1 e Variant7 */
const CLASSICO_BITES: BiteStage[] = [
  "/chocolate/chocolates/classico/01-better-bite-1.svg",
  "/chocolate/chocolates/classico/04-heartaches-last-bite.svg",
  "/chocolate/chocolates/classico/06-variant9.svg",
];

const CORACAO_BITES: BiteStage[] = [
  "/chocolate/chocolates/coracao/02-variant2.svg",
  "/chocolate/chocolates/coracao/04-variant4.svg",
  "/chocolate/chocolates/coracao/06-variant6.svg",
];

const LISTRADO_BITES: BiteStage[] = [
  "/chocolate/chocolates/listrado/02-variant2.svg",
  "/chocolate/chocolates/listrado/04-variant4.svg",
  "/chocolate/chocolates/listrado/06-variant6.svg",
  "/chocolate/chocolates/listrado/07-variant7.svg",
];

const ESPECIAL_BITES: BiteStage[] = [
  "/chocolate/chocolates/especial/04-variant4.svg",
  "/chocolate/chocolates/especial/07-variant7.svg",
];

const REDONDO_BITES: BiteStage[] = [
  "/chocolate/chocolates/redondo/03-variant3.svg",
  "/chocolate/chocolates/redondo/04-variant4.svg",
  "/chocolate/chocolates/redondo/06-variant6.svg",
];

const GOURMET_BITES: BiteStage[] = [
  "/chocolate/chocolates/gourmet/03-variant3.svg",
  "/chocolate/chocolates/gourmet/05-variant5.svg",
  "/chocolate/chocolates/gourmet/08-variant8.svg",
];

/** Seis modelos arrastáveis */
export const CHOCOLATE_TYPES: ChocolateType[] = [
  {
    id: 0,
    name: "Clássico",
    file: "/chocolate/chocolates/classico.svg",
    biteStages: [...CLASSICO_BITES],
  },
  {
    id: 1,
    name: "Coração",
    file: "/chocolate/chocolates/coracao.svg",
    biteStages: [...CORACAO_BITES],
  },
  {
    id: 2,
    name: "Listrado",
    file: "/chocolate/chocolates/listrado.svg",
    biteStages: [...LISTRADO_BITES],
  },
  {
    id: 3,
    name: "Especial",
    file: "/chocolate/chocolates/especial.svg",
    biteStages: [...ESPECIAL_BITES],
  },
  {
    id: 4,
    name: "Redondo",
    file: "/chocolate/chocolates/redondo.svg",
    biteStages: [...REDONDO_BITES],
  },
  {
    id: 5,
    name: "Gourmet",
    file: "/chocolate/chocolates/gourmet.svg",
    biteStages: [...GOURMET_BITES],
  },
];

export const LEGACY_CHOCOLATE_MAP: Record<number, { id: number; biteStage?: number }> = {
  0: { id: 1 },
  1: { id: 1, biteStage: 1 },
  2: { id: 2 },
  3: { id: 0 },
  4: { id: 4 },
  5: { id: 5 },
  6: { id: 5, biteStage: 1 },
  7: { id: 3 },
};

export function isBiteImage(stage: BiteStage): stage is string {
  return typeof stage === "string";
}

export function getChocolateType(id: number): ChocolateType | undefined {
  return CHOCOLATE_TYPES.find((c) => c.id === id);
}

export function getBiteStage(type: ChocolateType, biteStage: number): BiteStage {
  const idx = Math.min(Math.max(0, biteStage - 1), type.biteStages.length - 1);
  return type.biteStages[idx];
}

/** @deprecated use getBiteStage — só para recortes do sprite */
export function getStageCrop(type: ChocolateType, biteStage: number): CropRect {
  const stage = getBiteStage(type, biteStage);
  if (isBiteImage(stage)) {
    return [0, 0, 32, 32];
  }
  return stage;
}

export function getMaxBiteStage(type: ChocolateType): number {
  return type.biteStages.length;
}

export function getSlot(index: number): BoxSlot | undefined {
  return BOX_SLOTS.find((s) => s.index === index);
}

export function findSlotAt(x: number, y: number): number | null {
  for (const slot of BOX_SLOTS) {
    if (
      x >= slot.x &&
      x <= slot.x + slot.width &&
      y >= slot.y &&
      y <= slot.y + slot.height
    ) {
      return slot.index;
    }
  }
  return null;
}

export function normalizeChocolateIndex(index: number): { id: number; biteStage: number } {
  if (index >= 0 && index < CHOCOLATE_TYPES.length) {
    return { id: index, biteStage: 0 };
  }
  const mapped = LEGACY_CHOCOLATE_MAP[index];
  if (mapped) {
    return { id: mapped.id, biteStage: mapped.biteStage ?? 0 };
  }
  return { id: 0, biteStage: 0 };
}
