/** Catálogo de assets Canva — public/scrapbook/ */

export const SCRAPBOOK_FRAMES = {
  /** Polaroid grande com fita — galeria */
  polaroid: {
    src: "/scrapbook/frames/polaroid-tape.svg",
    aspect: "473 / 602",
    photo: { left: "7%", top: "11.7%", width: "90.5%", height: "81.3%" },
    tapeTop: "/scrapbook/stickers/canva/tape-photo-top.svg",
  },
  /** Polaroid compacto — galeria (alternado) */
  polaroidCompact: {
    src: "/scrapbook/frames/polaroid-compact.svg",
    aspect: "294 / 369",
    photo: { left: "11.2%", top: "11.1%", width: "85%", height: "77.5%" },
  },
  /** Foto retangular com clipe — galeria */
  paperclip: {
    src: "/scrapbook/frames/photo-paperclip.svg",
    aspect: "604 / 535",
    photo: { left: "5.5%", top: "17.3%", width: "92.7%", height: "74.8%" },
  },
  /** Papel recortado — hero, carta */
  textScalloped: {
    src: "/scrapbook/frames/text-paper-scalloped.svg",
  },
  /** Papel texturizado — contador, timeline */
  paperTextured: {
    src: "/scrapbook/frames/paper-textured.svg",
  },
} as const;

export const SCRAPBOOK_CANVA_STICKERS = {
  stamp: "/scrapbook/stickers/canva/stamp.svg",
  heart: "/scrapbook/stickers/canva/sticker-heart.svg",
  heartSquare: "/scrapbook/stickers/canva/sticker-square.svg",
  heartTilted: "/scrapbook/stickers/canva/sticker-tilted.svg",
  heartBadge: "/scrapbook/stickers/canva/sticker-badge-98.svg",
  heartTiltedSquare: "/scrapbook/stickers/canva/sticker-tilted-square.svg",
  ring: "/scrapbook/stickers/canva/ring.svg",
  swirl: "/scrapbook/stickers/canva/deco-swirl.svg",
  tapeStrip: "/scrapbook/stickers/canva/tape-strip.svg",
  tapeHeart: "/scrapbook/stickers/canva/tape-heart.svg",
  tapePhotoTop: "/scrapbook/stickers/canva/tape-photo-top.svg",
  flowers: "/scrapbook/stickers/canva/deco-flowers.svg",
  flowersWide: "/scrapbook/stickers/canva/deco-flowers-wide.svg",
  banner: "/scrapbook/stickers/canva/deco-banner.svg",
  bannerWide: "/scrapbook/stickers/canva/deco-banner-wide.svg",
  strip93: "/scrapbook/stickers/canva/deco-strip-93.svg",
  strip94: "/scrapbook/stickers/canva/deco-strip-94.svg",
  strip95: "/scrapbook/stickers/canva/deco-strip-95.svg",
  vertical: "/scrapbook/stickers/canva/deco-vertical.svg",
  verticalAlt: "/scrapbook/stickers/canva/deco-vertical-alt.svg",
  scrapLarge: "/scrapbook/stickers/canva/deco-scrap-large.svg",
  lineDivider: "/scrapbook/elements/line-divider.svg",
} as const;

export type ScrapbookFrameVariant = "polaroid" | "paperclip" | "polaroidCompact";

export const GALLERY_ROTATIONS = [-5, 4, -3, 6, -2, 3] as const;

export const GALLERY_FRAME_CYCLE: ScrapbookFrameVariant[] = [
  "polaroid",
  "paperclip",
  "polaroidCompact",
];
