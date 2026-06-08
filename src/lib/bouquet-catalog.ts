export type MainFlowerId = "roses" | "lilies" | "poppies" | "sunflowers";
export type SupportFlowerId = "clovers" | "daisies" | "primroses" | "violets";
export type WrapperId = "pink" | "purple" | "kraft" | "cream";
export type TieId = "ribbon-pink" | "ribbon-purple" | "twine";

export interface BouquetConfig {
  mainFlowerId: MainFlowerId;
  supportFlowerId: SupportFlowerId;
  wrapperId: WrapperId;
  tieId: TieId;
}

export const DEFAULT_BOUQUET: BouquetConfig = {
  mainFlowerId: "roses",
  supportFlowerId: "clovers",
  wrapperId: "cream",
  tieId: "twine",
};

export const MAIN_FLOWERS: Record<
  MainFlowerId,
  { name: string; emoji: string; thumb: string }
> = {
  roses: { name: "Rosas", emoji: "🌹", thumb: "/bouquet/ref/Roses.png" },
  lilies: { name: "Lírios", emoji: "🤍", thumb: "/bouquet/ref/lilies.png" },
  poppies: { name: "Papoulas", emoji: "🌺", thumb: "/bouquet/ref/Poppies.png" },
  sunflowers: { name: "Girassóis", emoji: "🌻", thumb: "/bouquet/ref/Sunflowers.png" },
};

export const SUPPORT_FLOWERS: Record<
  SupportFlowerId,
  { name: string; emoji: string; thumb: string }
> = {
  clovers: { name: "Trevos", emoji: "🍀", thumb: "/bouquet/ref/Clovers.png" },
  daisies: { name: "Margaridas", emoji: "🌼", thumb: "/bouquet/ref/Daisies.png" },
  primroses: { name: "Prímulas", emoji: "🌸", thumb: "/bouquet/ref/Primroses.png" },
  violets: { name: "Violetas", emoji: "💜", thumb: "/bouquet/ref/Violets.png" },
};

const BOUQUET_IMAGE_FILES: Record<MainFlowerId, Record<SupportFlowerId, string>> = {
  roses: {
    clovers: "roses and clovers.png",
    daisies: "roses and daisies.png",
    primroses: "roses and primroses.png",
    violets: "roses and violets.png",
  },
  lilies: {
    clovers: "lilies and clovers.png",
    daisies: "lilies and daisies.png",
    primroses: "lilies and primroses.png",
    violets: "lilies and violets.png",
  },
  poppies: {
    clovers: "poppies and clovers.png",
    daisies: "poppies and dasies.png",
    primroses: "poppies and primroses.png",
    violets: "poppies and violets.png",
  },
  sunflowers: {
    clovers: "sunflowers and clovers.png",
    daisies: "sunflowers and daisies.png",
    primroses: "sunflowers and primroses.png",
    violets: "sunflowers and violets.png",
  },
};

/** Imagem final do buquê (flores + papel + laço) — igual ao build-a-bouquet */
export function getBouquetImageUrl(config: BouquetConfig): string {
  const file = BOUQUET_IMAGE_FILES[config.mainFlowerId][config.supportFlowerId];
  return `/bouquet/ref/bouquet_images/${encodeURI(file)}`;
}

export const WRAPPER_SHEET = { src: "/bouquet/wrappers.svg", w: 831, h: 539 };

type Crop = { x: number; y: number; w: number; h: number };

/** Miniaturas na faixa superior do SVG (só para o seletor na UI) */
export const WRAPPERS: Record<WrapperId, { name: string; thumbCrop: Crop }> = {
  pink: { name: "Rosa", thumbCrop: { x: 0, y: 61, w: 208, h: 212 } },
  purple: { name: "Lilás", thumbCrop: { x: 208, y: 61, w: 208, h: 212 } },
  kraft: { name: "Kraft", thumbCrop: { x: 416, y: 61, w: 208, h: 212 } },
  cream: { name: "Creme", thumbCrop: { x: 624, y: 61, w: 207, h: 212 } },
};

export const TIE_SHEET = { src: "/bouquet/ties.svg", w: 559, h: 177 };

export const TIES: Record<TieId, { name: string; thumbCrop: Crop }> = {
  "ribbon-pink": { name: "Laço rosa", thumbCrop: { x: 0, y: 61, w: 186, h: 115 } },
  "ribbon-purple": { name: "Laço lilás", thumbCrop: { x: 186, y: 61, w: 186, h: 115 } },
  twine: { name: "Barbante", thumbCrop: { x: 372, y: 61, w: 186, h: 115 } },
};

export const SEAL_OVERLAY = { left: "48.5%", top: "69%", sizeRatio: 0.19 };

const LEGACY_MAIN: Record<string, MainFlowerId> = {
  lily: "lilies",
  poppy: "poppies",
  sunflower: "sunflowers",
  rose: "roses",
};

const LEGACY_SUPPORT: Record<string, SupportFlowerId> = {
  clover: "clovers",
  "forget-me-not": "violets",
};

export function resolveBouquetConfig(
  raw?: Partial<BouquetConfig> & { slots?: { flowerId: string }[] }
): BouquetConfig {
  if (raw?.mainFlowerId && raw?.supportFlowerId) {
    return {
      wrapperId: raw.wrapperId ?? DEFAULT_BOUQUET.wrapperId,
      tieId: raw.tieId ?? DEFAULT_BOUQUET.tieId,
      mainFlowerId: raw.mainFlowerId,
      supportFlowerId: raw.supportFlowerId,
    };
  }

  const slots = raw?.slots ?? [];
  const main = LEGACY_MAIN[slots[0]?.flowerId ?? ""] ?? DEFAULT_BOUQUET.mainFlowerId;
  const support = LEGACY_SUPPORT[slots[1]?.flowerId ?? ""] ?? DEFAULT_BOUQUET.supportFlowerId;

  return {
    mainFlowerId: main,
    supportFlowerId: support,
    wrapperId: raw?.wrapperId ?? DEFAULT_BOUQUET.wrapperId,
    tieId: raw?.tieId ?? DEFAULT_BOUQUET.tieId,
  };
}
