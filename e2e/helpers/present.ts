import type { Page } from "@playwright/test";

const HIDE_DEV_UI_CSS = `
  nextjs-portal,
  [data-nextjs-toast],
  [data-nextjs-dialog-overlay],
  [data-nextjs-dev-tools-button],
  #__next-build-watcher {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
    opacity: 0 !important;
  }
`;

export async function hideDevUi(page: Page) {
  await page.addStyleTag({ content: HIDE_DEV_UI_CSS });
}

export async function blockHeavyMedia(page: Page) {
  await page.route("**/*", async (route) => {
    const url = route.request().url();
    if (
      url.includes("youtube.com") ||
      url.includes("googlevideo.com") ||
      url.includes("ytimg.com")
    ) {
      await route.abort();
      return;
    }
    await route.continue();
  });
}

export async function waitForPresentShell(page: Page) {
  await page.waitForSelector(".panda-present", { timeout: 60_000 });
}

export async function waitForCriticalAssets(page: Page) {
  await page.waitForFunction(
    () => {
      const svg = document.querySelector(".gift-box__svg");
      return Boolean(svg && svg.innerHTML.trim().length > 80);
    },
    undefined,
    { timeout: 15_000 }
  );
  await page
    .waitForFunction(
      () => document.documentElement.getAttribute("data-present-critical-ready") === "ready",
      undefined,
      { timeout: 45_000 }
    )
    .catch(() => undefined);
}

export async function waitForPresentPreload(page: Page) {
  await page
    .waitForFunction(
      () => document.documentElement.getAttribute("data-present-preload") === "ready",
      undefined,
      { timeout: 120_000 }
    )
    .catch(() => undefined);
}

export async function waitForMuseumScene(page: Page) {
  await page
    .waitForFunction(
      () => {
        const card = document.getElementById("card-project_museum");
        if (!card) return false;
        if (!card.querySelector(".museum-viewer--embedded")) return false;
        const photos = card.querySelectorAll(".museum-frame-photo");
        return photos.length >= 2;
      },
      undefined,
      { timeout: 60_000 }
    )
    .catch(() => undefined);
}

export async function scrollToCard(page: Page, cardId: string) {
  const el = page.locator(`#card-${cardId}`);
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);
}

export async function preparePresentPage(page: Page, path = "/presente/demo-preview") {
  await blockHeavyMedia(page);
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await waitForPresentShell(page);
  await hideDevUi(page);
  await waitForCriticalAssets(page);
  await waitForPresentPreload(page);
}

export const PRESENT_CARD_IDS = [
  "music",
  "hero",
  "about_couple",
  "memories",
  "project_museum",
  "project_chocolate",
  "bouquet",
  "letter",
  "forever",
] as const;
