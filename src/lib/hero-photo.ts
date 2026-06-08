/** Foto padrão do casal no envelope do hero */
export const DEFAULT_HERO_PHOTO = "/scrapbook/canva/hero/couple-photo.jpeg";

export const HERO_PHOTO_STORAGE_FIX = "linkamor-hero-photo-v2";

const LEGACY_HERO_PHOTOS = [
  "/scrapbook/canva/hero/photo-placeholder.jpeg",
  "/scrapbook/canva/hero/photo-placeholder.png",
];

export function resolveHeroPhoto(url?: string): string {
  const trimmed = url?.trim();
  if (!trimmed) return DEFAULT_HERO_PHOTO;
  if (LEGACY_HERO_PHOTOS.some((legacy) => trimmed.endsWith(legacy) || trimmed === legacy)) {
    return DEFAULT_HERO_PHOTO;
  }
  if (trimmed === DEFAULT_HERO_PHOTO || trimmed.includes("couple-photo")) {
    return DEFAULT_HERO_PHOTO;
  }
  return trimmed;
}

/** Corrige rascunhos antigos com upload quebrado ou placeholder */
export function normalizeHeroPhotoForStore(url?: string): string {
  const trimmed = url?.trim();
  if (!trimmed) return DEFAULT_HERO_PHOTO;
  if (LEGACY_HERO_PHOTOS.some((legacy) => trimmed.endsWith(legacy) || trimmed === legacy)) {
    return DEFAULT_HERO_PHOTO;
  }
  if (trimmed.startsWith("/uploads/")) return DEFAULT_HERO_PHOTO;
  return resolveHeroPhoto(trimmed);
}
