/** Stubs — assets da câmera serão adicionados sessão a sessão */

export const VALENTINE_BASE = "/assets/camera/sequence";

export type ValentineFrameKind = "gift" | "camera" | "polaroid";

export interface ValentineFrameDef {
  id: string;
  src: string;
  kind: ValentineFrameKind;
  photoIndex?: number;
}

export const VALENTINE_FRAMES: ValentineFrameDef[] = [];
export const VALENTINE_PAUSE_INDICES: number[] = [];
export const VALENTINE_CAMERA_WAIT = VALENTINE_PAUSE_INDICES;
export const VALENTINE_SHOT_END: number[] = [];

export const VALENTINE_INTRO = {
  giftBox: "/assets/camera/Gift_Box.svg",
  camera: "/assets/camera/camera-ready.svg",
  cameraReady: "/assets/camera/camera-ready.svg",
  cameraFlash: "/assets/camera/camera-flash.svg",
  polaroidFrame: "/assets/camera/polaroid-frame.svg",
} as const;

export const POLAROID_PHOTO_AREA = {
  top: "8%",
  left: "12%",
  width: "76%",
  height: "58%",
} as const;

export const POLAROID_PHOTO_RECT = { x: 14, y: 17, w: 131, h: 143 };
export const POLAROID_FRAME_VB = { w: 159, h: 209 };

export const VIEWPORT_W = 393;
export const VIEWPORT_H = 852;

export const POLAROID_COLORS = {
  redDark: "#C52929",
  almostBlack: "#0B0600",
  tealDark: "#11414B",
  blush: "#FFE3E3",
  blushMid: "#FACAC9",
  blushDark: "#F29F9F",
  blushButton: "#E68B8B",
} as const;

export interface ValentinePhotoBeat {
  frame: string;
  frameAlt?: string;
  camera: string;
}

export const VALENTINE_PHOTO_BEATS: ValentinePhotoBeat[] = [];

export function valentineAssetUrls(): string[] {
  return [];
}

export function screenAsset(n: number) {
  return `/polaroid/iphone-${n}.svg`;
}

export const POLAROID_FRAME = "/polaroid/polaroid-frame.svg";
export const CLICK_TO_SHARE = "/polaroid/click-to-share.svg";
export const HEAVY_SCREEN_NUMBERS: number[] = [];

export const POLAROID_SEQUENCE = [
  { rotation: -6, finalX: -20, finalY: 0, delay: 0 },
  { rotation: 4, finalX: 30, finalY: 40, delay: 0.15 },
  { rotation: -3, finalX: -10, finalY: 80, delay: 0.3 },
  { rotation: 5, finalX: 25, finalY: 120, delay: 0.45 },
  { rotation: -2, finalX: 0, finalY: 160, delay: 0.6 },
] as const;

export const GIFT_FRAMES = [10, 11, 12, 13] as const;
