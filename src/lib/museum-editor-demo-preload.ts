import { FRAME_DATA, MUSEUM_ASSETS, SPECTATOR_DATA } from "@/data/museum-frames";
import { preloadImage, preloadImageHigh } from "@/lib/present-preload";

const DEMO_FRAME_IDS = [1, 5, 2] as const;
const SPECTATOR_FILE = SPECTATOR_DATA[1]?.file ?? "/museum/spectator-2.svg";

let preloadPromise: Promise<void> | null = null;

/** Quadros e salão reais — carrega molduras antes de iniciar a animação */
export function preloadMuseumEditorDemoAssets(): Promise<void> {
  if (preloadPromise) return preloadPromise;

  const frameUrls = DEMO_FRAME_IDS.map(
    (id) => FRAME_DATA.find((f) => f.id === id)?.file
  ).filter(Boolean) as string[];

  preloadPromise = (async () => {
    await Promise.all(frameUrls.map((url) => preloadImageHigh(url)));
    await preloadImageHigh(MUSEUM_ASSETS.background);
    void preloadImage(SPECTATOR_FILE);
  })();

  return preloadPromise;
}
