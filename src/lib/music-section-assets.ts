/** Assets da seção de música — modelo PPTX Letticia & João (3) */
export const MUSIC_SECTION_ASSETS = {
  polaroidFrame: "/music-section/polaroid-frame.webp",
  clothesline: "/music-section/clothesline.webp",
  hearts: "/music-section/hearts.webp",
  heartRed: "/music-section/heart-red.webp",
  /** altura / largura do polaroid */
  polaroidAspect: 652 / 534,
} as const;

export interface MusicPolaroidSlot {
  photoUrl?: string;
  caption?: string;
}

export interface MusicPolaroidPair {
  left: MusicPolaroidSlot;
  right: MusicPolaroidSlot;
}

export const EMPTY_MUSIC_POLAROIDS: MusicPolaroidPair = {
  left: { photoUrl: "", caption: "" },
  right: { photoUrl: "", caption: "" },
};
