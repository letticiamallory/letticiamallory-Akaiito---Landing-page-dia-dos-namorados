export type EnvelopeStyleId = "classic-cream" | "blush" | "sage" | "midnight";

export type WaxSealId =
  | "gold-classic"
  | "rose-heart"
  | "burgundy"
  | "emerald"
  | "silver"
  | "blush"
  | "sapphire"
  | "lilac"
  | "bronze"
  | "copper"
  | "ruby"
  | "forest"
  | "amber"
  | "pearl"
  | "crimson";

export interface LetterConfig {
  envelopeId: EnvelopeStyleId;
  waxId: WaxSealId;
}

export const DEFAULT_LETTER: LetterConfig = {
  envelopeId: "classic-cream",
  waxId: "gold-classic",
};

export function envelopeSize(aspect: number, fitWidth: number) {
  return { width: fitWidth, height: fitWidth / aspect };
}

/** Posição do selo de cera sobre o envelope fechado */
export const SEAL_OVERLAY = { left: "48.5%", top: "69%", sizeRatio: 0.19 };

/** Corpo da mensagem — cabe no papel sem cortar (cabeçalho e assinatura reservados). */
export const LETTER_MESSAGE_MAX_CHARS = 220;

export function clampLetterMessage(text: string): string {
  return text.slice(0, LETTER_MESSAGE_MAX_CHARS);
}

/** Papel de carta — modelo Letticia & João (PPTX) */
export const LETTER_PAPER = {
  texture: "/letter/paper/texture.webp",
  decoBotanical: "/letter/paper/deco-botanical.webp",
  decoFlower: "/letter/paper/deco-flower.webp",
  /** altura / largura */
  aspect: 1.355,
} as const;

export const ENVELOPE_STYLES: Record<
  EnvelopeStyleId,
  {
    name: string;
    closedSrc: string;
    openSrc: string;
    /** Envelope fechado (paisagem) */
    closedAspect: number;
    /** Envelope aberto (mais alto — open_letter.svg) */
    openAspect: number;
  }
> = {
  "classic-cream": {
    name: "Kraft",
    closedSrc: "/letter/envelopes/classic-cream.webp",
    openSrc: "/letter/envelopes/classic-cream-open.webp",
    closedAspect: 1.674,
    openAspect: 1.015,
  },
  blush: {
    name: "Creme quente",
    closedSrc: "/letter/envelopes/blush.webp",
    openSrc: "/letter/envelopes/blush-open.webp",
    closedAspect: 1.674,
    openAspect: 1.015,
  },
  sage: {
    name: "Areia natural",
    closedSrc: "/letter/envelopes/sage.webp",
    openSrc: "/letter/envelopes/sage-open.svg",
    closedAspect: 1.674,
    openAspect: 1.015,
  },
  midnight: {
    name: "Cinza pedra",
    closedSrc: "/letter/envelopes/midnight.webp",
    openSrc: "/letter/envelopes/midnight-open.webp",
    closedAspect: 1.674,
    openAspect: 1.015,
  },
};

/**
 * Os ficheiros extraídos do sprite tinham nomes trocados em relação à cor real.
 * Este mapa liga cada selo ao asset visual correto.
 */
const SEAL_ASSET: Record<WaxSealId, string> = {
  "gold-classic": "gold-classic",
  "rose-heart": "lilac",
  burgundy: "crimson",
  emerald: "burgundy",
  silver: "pearl",
  blush: "forest",
  sapphire: "rose-heart",
  lilac: "ruby",
  bronze: "bronze",
  copper: "sapphire",
  ruby: "blush",
  forest: "copper",
  amber: "silver",
  pearl: "amber",
  crimson: "emerald",
};

export const WAX_SEALS: Record<WaxSealId, { name: string; src: string }> = {
  "gold-classic": { name: "Dourado", src: `/letter/seals/${SEAL_ASSET["gold-classic"]}.webp` },
  "rose-heart": { name: "Rosa coração", src: `/letter/seals/${SEAL_ASSET["rose-heart"]}.webp` },
  burgundy: { name: "Bordô", src: `/letter/seals/${SEAL_ASSET.burgundy}.webp` },
  emerald: { name: "Esmeralda", src: `/letter/seals/${SEAL_ASSET.emerald}.webp` },
  silver: { name: "Prata", src: `/letter/seals/${SEAL_ASSET.silver}.webp` },
  blush: { name: "Areia", src: `/letter/seals/${SEAL_ASSET.blush}.webp` },
  sapphire: { name: "Safira", src: `/letter/seals/${SEAL_ASSET.sapphire}.webp` },
  lilac: { name: "Champagne", src: `/letter/seals/${SEAL_ASSET.lilac}.webp` },
  bronze: { name: "Bronze", src: `/letter/seals/${SEAL_ASSET.bronze}.webp` },
  copper: { name: "Cobre", src: `/letter/seals/${SEAL_ASSET.copper}.webp` },
  ruby: { name: "Rubi", src: `/letter/seals/${SEAL_ASSET.ruby}.webp` },
  forest: { name: "Floresta", src: `/letter/seals/${SEAL_ASSET.forest}.webp` },
  amber: { name: "Âmbar", src: `/letter/seals/${SEAL_ASSET.amber}.webp` },
  pearl: { name: "Pérola", src: `/letter/seals/${SEAL_ASSET.pearl}.webp` },
  crimson: { name: "Carmesim", src: `/letter/seals/${SEAL_ASSET.crimson}.webp` },
};

export const WAX_SEAL_LIST = Object.entries(WAX_SEALS) as [WaxSealId, (typeof WAX_SEALS)[WaxSealId]][];

const LEGACY_WAX_IDS: Record<string, WaxSealId> = {
  gold: "gold-classic",
  rose: "rose-heart",
  wine: "burgundy",
};

export function resolveWaxId(id?: string): WaxSealId {
  if (id && id in WAX_SEALS) return id as WaxSealId;
  if (id && LEGACY_WAX_IDS[id]) return LEGACY_WAX_IDS[id];
  return DEFAULT_LETTER.waxId;
}
