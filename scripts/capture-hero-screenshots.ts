import fs from "node:fs/promises";
import path from "node:path";
import { chromium, type Browser, type BrowserContext, type Page } from "playwright";

const DEMO_URL = process.env.RECORD_URL ?? "http://localhost:3000/presente/mv3ejyxx";
const OUTPUT_DIR = "public/marketing/previews";
const VIEWPORT = { width: 393, height: 852 };

const SHOTS = {
  letter: path.join(OUTPUT_DIR, "hero-letter.png"),
  museum: path.join(OUTPUT_DIR, "hero-museum.png"),
  chocolate: path.join(OUTPUT_DIR, "hero-chocolate.png"),
} as const;

async function createContext(browser: Browser) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
  });

  await context.route("**/*", (route) => {
    const url = route.request().url();
    if (
      url.includes("youtube.com") ||
      url.includes("youtu.be") ||
      url.includes("googlevideo.com") ||
      url.includes("ytimg.com")
    ) {
      route.abort();
      return;
    }
    route.continue();
  });

  return context;
}

async function hideDevUi(page: Page) {
  await page.addStyleTag({
    content: `
      nextjs-portal,
      [data-nextjs-toast],
      [data-nextjs-dialog-overlay] {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
    `,
  });
}

async function waitForPresent(page: Page) {
  await page.goto(DEMO_URL, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForSelector(".panda-present", { timeout: 30_000 });
  await hideDevUi(page);
  await page
    .waitForFunction(
      () => document.documentElement.getAttribute("data-present-critical-ready") === "ready",
      undefined,
      { timeout: 90_000 }
    )
    .catch(() => undefined);
  await page.waitForTimeout(800);
}

async function alignCardTop(page: Page, cardId: string) {
  await page.evaluate((id) => {
    const card = document.getElementById(id);
    if (!card) return;
    const top = window.scrollY + card.getBoundingClientRect().top;
    window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  }, cardId);
  await page.waitForTimeout(500);
}

async function waitForPresentPreload(page: Page) {
  await page
    .waitForFunction(
      () => document.documentElement.getAttribute("data-present-preload") === "ready",
      undefined,
      { timeout: 180_000 }
    )
    .catch(() => undefined);
  await page.waitForTimeout(600);
}

async function clickFirst(page: Page, selector: string, waitMs = 500) {
  const locator = page.locator(selector).first();
  if ((await locator.count()) === 0) return false;
  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await locator.click({ force: true });
  await page.waitForTimeout(waitMs);
  return true;
}

async function captureViewport(page: Page, outputPath: string) {
  await page.screenshot({
    path: outputPath,
    fullPage: false,
    animations: "disabled",
  });
  console.log(`Salvo: ${outputPath}`);
}

async function waitForMuseumScene(page: Page) {
  await waitForPresentPreload(page);
  await page
    .waitForFunction(
      () => {
        const card = document.getElementById("card-project_museum");
        if (!card) return false;
        const frames = card.querySelectorAll(".frame-instance img, .museum-frame-photo img");
        return frames.length >= 2;
      },
      undefined,
      { timeout: 180_000 }
    )
    .catch(() => undefined);
  await page.waitForTimeout(1200);
}

async function withPage(browser: Browser, fn: (page: Page, context: BrowserContext) => Promise<void>) {
  const context = await createContext(browser);
  const page = await context.newPage();
  page.setDefaultTimeout(45_000);
  try {
    await fn(page, context);
  } finally {
    await context.close();
  }
}

async function captureMuseum(browser: Browser) {
  await withPage(browser, async (page) => {
    await waitForPresent(page);
    await alignCardTop(page, "card-project_museum");
    await waitForMuseumScene(page);
    await alignCardTop(page, "card-project_museum");
    await captureViewport(page, SHOTS.museum);
  });
}

async function captureChocolate(browser: Browser) {
  await withPage(browser, async (page) => {
    await waitForPresent(page);
    await alignCardTop(page, "card-project_chocolate");
    await clickFirst(page, "#card-project_chocolate .chocolate-scene button", 1200);
    await clickFirst(page, "#card-project_chocolate .chocolate-viewer-bite", 550);
    await clickFirst(page, "#card-project_chocolate .chocolate-viewer-bite", 550);
    await alignCardTop(page, "card-project_chocolate");
    await page.waitForTimeout(500);
    await captureViewport(page, SHOTS.chocolate);
  });
}

async function captureLetter(browser: Browser) {
  await withPage(browser, async (page) => {
    await waitForPresent(page);
    await alignCardTop(page, "card-letter");
    await clickFirst(page, "#card-letter .evnelope-hit", 400);
    await page.waitForSelector("#card-letter .envelope-gift-scene--open", { timeout: 12_000 });
    await page
      .waitForFunction(
        () => {
          const card = document.getElementById("card-letter");
          if (!card) return false;
          return !card.querySelector(".letter-cursor");
        },
        undefined,
        { timeout: 15_000 }
      )
      .catch(() => undefined);
    await page.waitForTimeout(800);
    await alignCardTop(page, "card-letter");
    await page.waitForTimeout(500);
    await captureViewport(page, SHOTS.letter);
  });
}

async function captureHeroScreenshots() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  await captureMuseum(browser);
  await captureChocolate(browser);
  await captureLetter(browser);

  await browser.close();
}

captureHeroScreenshots().catch((error) => {
  console.error(error);
  process.exit(1);
});
