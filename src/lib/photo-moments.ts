import type { PhotoCollageData, PhotoCollagePhoto, PhotoMoment } from "@/lib/builder/types";

export const DEFAULT_PHOTO_MOMENTS: PhotoMoment[] = [
  { id: "dates", title: "Nossos Dates" },
  { id: "random", title: "Fotos aleatórias" },
  { id: "trip", title: "Primeira viagem" },
];

export const COLLAGE_MAX_PHOTOS = 15;
export const COLLAGE_PHOTOS_PER_MOMENT = 5;
export const PHOTO_MOMENT_TITLE_MAX_CHARS = 30;

export function clampPhotoMomentTitle(text: string): string {
  return text.slice(0, PHOTO_MOMENT_TITLE_MAX_CHARS);
}

export function getMomentIdForPhotoIndex(index: number, moments: PhotoMoment[]): string | undefined {
  const momentIndex = Math.floor(index / COLLAGE_PHOTOS_PER_MOMENT);
  return moments[Math.min(momentIndex, moments.length - 1)]?.id;
}

export function normalizeCollagePhotos(
  photos: PhotoCollagePhoto[],
  moments: PhotoMoment[]
): PhotoCollagePhoto[] {
  const momentIds = new Set(moments.map((m) => m.id));
  const countByMoment = new Map<string, number>();
  moments.forEach((m) => countByMoment.set(m.id, 0));

  const result: PhotoCollagePhoto[] = [];
  let legacyIndex = 0;

  for (const photo of photos) {
    if (!photo.url?.trim()) continue;
    if (result.length >= COLLAGE_MAX_PHOTOS) break;

    let momentId =
      photo.momentId && momentIds.has(photo.momentId) ? photo.momentId : undefined;

    if (!momentId) {
      momentId = getMomentIdForPhotoIndex(legacyIndex, moments);
      legacyIndex++;
    }

    if (!momentId) continue;
    const count = countByMoment.get(momentId) ?? 0;
    if (count >= COLLAGE_PHOTOS_PER_MOMENT) continue;

    countByMoment.set(momentId, count + 1);
    result.push({ ...photo, momentId });
  }

  return result;
}

export interface ResolvedPhotoMoment {
  moment: PhotoMoment;
  photos: PhotoCollagePhoto[];
  coverUrl: string;
}

export function getPhotoMoments(data: PhotoCollageData): PhotoMoment[] {
  const configured = data.moments?.filter((m) => m.title.trim());
  return configured?.length ? configured : DEFAULT_PHOTO_MOMENTS;
}

/** Agrupa fotos em momentos para exibição no card e no viewer de stories */
export function resolvePhotoMoments(data: PhotoCollageData): ResolvedPhotoMoment[] {
  const moments = getPhotoMoments(data);
  const photos = data.photos.filter((p) => p.url?.trim());

  if (!photos.length) return [];

  const buckets = new Map<string, PhotoCollagePhoto[]>(
    moments.map((m) => [m.id, [] as PhotoCollagePhoto[]])
  );

  photos.forEach((photo, index) => {
    const momentId =
      photo.momentId && buckets.has(photo.momentId)
        ? photo.momentId
        : moments[index % moments.length]?.id;
    if (!momentId) return;
    buckets.get(momentId)?.push(photo);
  });

  return moments
    .map((moment) => {
      const group = buckets.get(moment.id) ?? [];
      if (!group.length) return null;
      return {
        moment,
        photos: group,
        coverUrl: group[0].url,
      };
    })
    .filter((item): item is ResolvedPhotoMoment => item !== null);
}
