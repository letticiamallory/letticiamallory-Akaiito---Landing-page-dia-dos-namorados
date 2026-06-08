/**
 * Sequência visual frame-a-frame (refs 1–9).
 * Câmera SEMPRE no mesmo lugar (382×395). Polaroid sai pelo slot SUPERIOR.
 */

export const CAM_VB = { w: 382, h: 395 } as const;

/** Cartão polaroid completo (159×209), não só a fenda interna (73.75px) */
export const POLAROID_FRAME = { w: 159, h: 209 } as const;

/** Fenda de ejeção no SVG da câmera */
export const SLOT_RECT = {
  x: 149.699,
  y: 16.2646,
  w: 73.75,
  h: 181.25,
} as const;

export const POLAROID_W_PCT = (POLAROID_FRAME.w / CAM_VB.w) * 100;
export const POLAROID_LEFT_PCT =
  ((SLOT_RECT.x + SLOT_RECT.w / 2 - POLAROID_FRAME.w / 2) / CAM_VB.w) * 100;
export const POLAROID_H_PCT = (POLAROID_FRAME.h / CAM_VB.h) * 100;

export const SLOT_LINE_PCT = (SLOT_RECT.y / CAM_VB.h) * 100;
export const SLOT_LEFT_PCT = (SLOT_RECT.x / CAM_VB.w) * 100;
export const SLOT_RIGHT_PCT = ((SLOT_RECT.x + SLOT_RECT.w) / CAM_VB.w) * 100;

/** Ancora do polaroid: base encostada no slot, corpo nasce pra cima */
export const SLOT_ANCHOR = {
  leftPct: POLAROID_LEFT_PCT,
  widthPct: POLAROID_W_PCT,
  topPct: SLOT_LINE_PCT - POLAROID_H_PCT,
} as const;

export type EjectKeyframe = {
  /** Ref. visual (1–9) */
  ref: number;
  clip: "step-1" | "step-2" | "step-3" | "step-near" | "step-full" | "none";
  translateY: string;
  behindCamera: boolean;
  tilt: "left" | "right" | null;
  /** Posição flutuante (ref 4+) — sobrescreve ancora do slot */
  floatTopPct?: number;
  floatLeftPct?: number;
};

/** 1ª foto — refs 1→4 */
export const PHOTO1_FRAMES: Record<
  | "polaroid-peek"
  | "polaroid-peek-2"
  | "polaroid-peek-3"
  | "polaroid-full"
  | "polaroid-out"
  | "polaroid-float",
  EjectKeyframe
> = {
  "polaroid-peek": {
    ref: 1,
    clip: "step-1",
    translateY: "0%",
    behindCamera: true,
    tilt: null,
  },
  "polaroid-peek-2": {
    ref: 2,
    clip: "step-2",
    translateY: "-8%",
    behindCamera: true,
    tilt: null,
  },
  "polaroid-peek-3": {
    ref: 3,
    clip: "step-3",
    translateY: "-18%",
    behindCamera: true,
    tilt: null,
  },
  "polaroid-full": {
    ref: 3,
    clip: "step-near",
    translateY: "-24%",
    behindCamera: true,
    tilt: null,
  },
  "polaroid-out": {
    ref: 4,
    clip: "step-full",
    translateY: "-32%",
    behindCamera: true,
    tilt: null,
  },
  "polaroid-float": {
    ref: 4,
    clip: "none",
    translateY: "0%",
    behindCamera: false,
    tilt: "left",
    floatTopPct: -60,
    floatLeftPct: POLAROID_LEFT_PCT - 3,
  },
};

/** 2ª foto — refs 5→9 (1ª já flutuando) */
export const PHOTO2_FRAMES: Record<
  | "polaroid2-peek"
  | "polaroid2-peek-2"
  | "polaroid2-peek-3"
  | "polaroid2-full"
  | "polaroid2-out"
  | "polaroid2-float",
  EjectKeyframe
> = {
  "polaroid2-peek": {
    ref: 5,
    clip: "step-1",
    translateY: "0%",
    behindCamera: true,
    tilt: null,
  },
  "polaroid2-peek-2": {
    ref: 6,
    clip: "step-2",
    translateY: "-8%",
    behindCamera: true,
    tilt: null,
  },
  "polaroid2-peek-3": {
    ref: 7,
    clip: "step-3",
    translateY: "-18%",
    behindCamera: true,
    tilt: null,
  },
  "polaroid2-full": {
    ref: 8,
    clip: "step-near",
    translateY: "-24%",
    behindCamera: true,
    tilt: null,
  },
  "polaroid2-out": {
    ref: 8,
    clip: "step-full",
    translateY: "-32%",
    behindCamera: true,
    tilt: null,
  },
  "polaroid2-float": {
    ref: 9,
    clip: "none",
    translateY: "0%",
    behindCamera: false,
    tilt: "right",
    floatTopPct: -48,
    floatLeftPct: POLAROID_LEFT_PCT + 5,
  },
};

/** 1ª foto parada enquanto 2ª sai — ref 5–8 */
export const PHOTO1_SETTLED: EjectKeyframe = PHOTO1_FRAMES["polaroid-float"];

/** Pausa entre 1ª e 2ª foto */
export const PHOTO2_DELAY_MS = 900;
