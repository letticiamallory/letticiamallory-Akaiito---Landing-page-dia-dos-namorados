import type { MuseumOfUsData, ScrapbookPresentData } from "./builder/types";
import { GIFT_BOX_MARKUP } from "./gift-box-markup";
import {
  CAMERA_CLICK_ARROW,
  CAMERA_CLICK_LABEL,
  CAMERA_FLASH,
  CAMERA_GIFT_ARROW,
  CAMERA_GIFT_BOX,
  CAMERA_POLAROID_FRAME,
  CAMERA_READY,
} from "@/lib/camera-assets";
import { CHOCOLATE_ASSETS } from "@/data/chocolate-catalog";
import {
  MUSEUM_ASSETS,
  getFrameDef,
  getSpectatorDef,
} from "@/data/museum-frames";

const SESSION_PREFIX = "akaiito:preload:";

const imageCache = new Map<string, Promise<void>>();
const presentPreloadPromises = new Map<string, Promise<void>>();
let giftBoxMarkup: string = GIFT_BOX_MARKUP;

const CAMERA_CRITICAL_URLS = [
  CAMERA_GIFT_ARROW,
  CAMERA_CLICK_ARROW,
  CAMERA_CLICK_LABEL,
  CAMERA_READY,
  CAMERA_FLASH,
  CAMERA_GIFT_BOX,
  CAMERA_POLAROID_FRAME,
] as const;

function uniqueUrls(urls: Array<string | undefined | null>): string[] {
  return [...new Set(urls.map((url) => url?.trim()).filter(Boolean) as string[])];
}

function preloadKey(data: ScrapbookPresentData): string {
  return JSON.stringify(
    data.sections.map((section) => ({
      id: section.sectionId,
      data: section.data,
    }))
  );
}

export function preloadImage(url: string): Promise<void> {
  const cached = imageCache.get(url);
  if (cached) return cached;

  const promise = new Promise<void>((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.fetchPriority = "low";
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });

  imageCache.set(url, promise);
  return promise;
}

export function preloadImageHigh(url: string): Promise<void> {
  const cached = imageCache.get(url);
  if (cached) return cached;

  const promise = new Promise<void>((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.fetchPriority = "high";
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });

  imageCache.set(url, promise);
  return promise;
}

export function isImagePreloaded(url: string): boolean {
  return imageCache.has(url);
}

export function getCachedGiftBoxMarkup(): string {
  return giftBoxMarkup;
}

export function preloadGiftBoxMarkup(): Promise<string> {
  return Promise.resolve(giftBoxMarkup);
}

function collectUrlsFromPresent(data: ScrapbookPresentData): {
  priority: string[];
  deferred: string[];
} {
  const priority: string[] = [...CAMERA_CRITICAL_URLS, MUSEUM_ASSETS.background];
  const deferred: string[] = [
    CHOCOLATE_ASSETS.box,
    CHOCOLATE_ASSETS.boxFilled,
    CHOCOLATE_ASSETS.lid,
    CHOCOLATE_ASSETS.components,
  ];

  const hasSection = (id: string) => data.sections.some((section) => section.sectionId === id);

  for (const section of data.sections) {
    switch (section.sectionId) {
      case "hero_couple": {
        const hero = section.data as { backgroundPhoto?: string };
        priority.push(...uniqueUrls([hero.backgroundPhoto]));
        break;
      }
      case "polaroid_camera": {
        const polaroid = section.data as { photos?: { url?: string }[] };
        priority.push(...uniqueUrls(polaroid.photos?.map((photo) => photo.url) ?? []));
        break;
      }
      case "favorite_song": {
        const music = section.data as {
          albumCover?: string;
          polaroidLeftPhoto?: string;
          polaroidRightPhoto?: string;
        };
        priority.push(
          ...uniqueUrls([music.albumCover, music.polaroidLeftPhoto, music.polaroidRightPhoto])
        );
        break;
      }
      case "photo_collage": {
        const collage = section.data as { photos?: { url?: string }[] };
        deferred.push(...uniqueUrls(collage.photos?.map((photo) => photo.url) ?? []));
        break;
      }
      case "museum_of_us": {
        const museum = section.data as MuseumOfUsData;
        for (const element of museum.elements ?? []) {
          priority.push(...uniqueUrls([element.photoUrl]));
          if (element.type === "frame" && element.frameIndex) {
            priority.push(...uniqueUrls([getFrameDef(element.frameIndex)?.file]));
          }
          if (element.type === "spectator" && element.spectatorIndex) {
            priority.push(...uniqueUrls([getSpectatorDef(element.spectatorIndex)?.file]));
          }
        }
        break;
      }
      default:
        break;
    }
  }

  if (!hasSection("chocolate_box")) {
    deferred.length = 0;
  }

  const prioritySet = new Set(uniqueUrls(priority));
  return {
    priority: [...prioritySet],
    deferred: uniqueUrls(deferred).filter((url) => !prioritySet.has(url)),
  };
}

export function stashPresentForPreload(giftId: string, data: ScrapbookPresentData) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(`${SESSION_PREFIX}${giftId}`, JSON.stringify(data));
  } catch {
    // payload grande demais — preload segue via API na página de pagamento
  }
}

export function readStashedPresent(giftId: string): ScrapbookPresentData | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`${SESSION_PREFIX}${giftId}`);
    return raw ? (JSON.parse(raw) as ScrapbookPresentData) : null;
  } catch {
    return null;
  }
}

export function clearStashedPresent(giftId: string) {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(`${SESSION_PREFIX}${giftId}`);
}

export function preloadPresentAssets(
  data: ScrapbookPresentData,
  options?: { force?: boolean }
): Promise<void> {
  const key = preloadKey(data);
  if (!options?.force && presentPreloadPromises.has(key)) {
    return presentPreloadPromises.get(key)!;
  }

  const promise = (async () => {
    const { priority, deferred } = collectUrlsFromPresent(data);

    await Promise.all(priority.map((url) => preloadImageHigh(url)));

    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-present-critical-ready", "ready");
    }

    void Promise.all(deferred.map((url) => preloadImage(url))).then(() => {
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-present-preload", "ready");
      }
    });
  })();

  presentPreloadPromises.set(key, promise);
  return promise;
}

/** Espera o essencial (câmera + museu) sem travar o redirect por muito tempo. */
export async function warmPresentAssets(
  giftId: string,
  data: ScrapbookPresentData,
  timeoutMs = 2500
) {
  stashPresentForPreload(giftId, data);
  await Promise.race([
    preloadPresentAssets(data, { force: true }),
    new Promise<void>((resolve) => window.setTimeout(resolve, timeoutMs)),
  ]);
}

export function startPresentPreloadForGift(
  giftId: string,
  data?: ScrapbookPresentData | null
) {
  const payload = data ?? readStashedPresent(giftId);
  if (!payload) return null;
  void preloadPresentAssets(payload, { force: true });
  return payload;
}

if (typeof window !== "undefined") {
  for (const url of CAMERA_CRITICAL_URLS) {
    preloadImageHigh(url);
  }
  void fetch(CAMERA_GIFT_BOX, { priority: "high" }).catch(() => undefined);
}
