import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";
import { chromium, type Browser, type Page } from "playwright";

const OUTPUT_DIR = "public/assets/demo";
const OUTPUT_WEBM = path.join(OUTPUT_DIR, "presente-demo.webm");
const OUTPUT_MP4 = path.join(OUTPUT_DIR, "presente-demo.mp4");
const DEMO_URL =
  process.env.RECORD_URL ?? "http://localhost:3000/presente/demo-preview";
const MAX_DURATION_MS = 95_000;

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

async function hideDevUi(page: Page) {
  await page.addStyleTag({ content: HIDE_DEV_UI_CSS });
}

async function recordDemo() {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
    ],
  });

  await warmupPage(browser);

  const startedAt = Date.now();
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: OUTPUT_DIR,
      size: { width: 393, height: 852 },
    },
  });

  const page = await context.newPage();
  page.setDefaultTimeout(45_000);

  await page.goto(DEMO_URL, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.waitForSelector(".panda-present", { timeout: 20_000 });
  await hideDevUi(page);
  await waitForCriticalAssets(page);
  await waitForPresentPreload(page);

  await page.addStyleTag({
    content: `
      ${HIDE_DEV_UI_CSS}
      * { cursor: none !important; }
      .fake-cursor {
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 999999;
        box-shadow: 0 0 0 2px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.35);
        transform: translate(-50%, -50%);
      }
      .fake-cursor.clicking { transform: translate(-50%, -50%) scale(0.82); }
    `,
  });

  await page.evaluate(() => {
    const cursor = document.createElement("div");
    cursor.className = "fake-cursor";
    document.body.appendChild(cursor);
    document.addEventListener("mousemove", (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });
    document.addEventListener("mousedown", () => cursor.classList.add("clicking"));
    document.addEventListener("mouseup", () => cursor.classList.remove("clicking"));
  });

  const remaining = () => Math.max(0, MAX_DURATION_MS - (Date.now() - startedAt));
  const wait = async (ms: number) => page.waitForTimeout(Math.min(ms, remaining()));

  const move = async (x: number, y: number) => {
    await page.mouse.move(x, y, { steps: 12 });
    await wait(60);
  };

  const clickAt = async (x: number, y: number) => {
    await move(x, y);
    await wait(120);
    await page.mouse.down();
    await wait(60);
    await page.mouse.up();
    await wait(180);
  };

  const scrollToCardById = async (cardId: string) => {
    const card = page.locator(`#card-${cardId}`).first();
    if ((await card.count()) === 0) return;
    await card.scrollIntoViewIfNeeded();
    await page.evaluate((id) => {
      const el = document.getElementById(`card-${id}`);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 28;
      window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
    }, cardId);
    await wait(400);
  };

  const clickLocatorCenter = async (selector: string) => {
    const locator = page.locator(selector).first();
    if ((await locator.count()) === 0) return false;
    await locator.scrollIntoViewIfNeeded();
    await wait(200);
    const box = await locator.boundingBox();
    if (!box) return false;
    await clickAt(box.x + box.width / 2, Math.min(box.y + box.height / 2, 820));
    return true;
  };

  const waitForEnabled = async (selector: string, timeoutMs = 12_000) => {
    const locator = page.locator(`${selector}:not([disabled])`).first();
    try {
      await locator.waitFor({ state: "visible", timeout: timeoutMs });
      return true;
    } catch {
      return false;
    }
  };

  // 1 — Música
  await scrollToCardById("music");
  await wait(500);
  if (await waitForEnabled(".panda-music-card__play")) {
    await clickLocatorCenter(".panda-music-card__play");
    await wait(1200);
  }

  // 2 — Hero: caixa + câmera polaroid
  await scrollToCardById("hero");
  await wait(400);
  await clickLocatorCenter(".gift-box");
  await wait(800);
  await clickLocatorCenter(".cam-stage__camera-btn");
  await wait(2200);

  // 3 — Sobre o casal (contador)
  await scrollToCardById("about_couple");
  await wait(1400);

  // 4 — Galeria de memórias
  await scrollToCardById("memories");
  await wait(350);
  await clickLocatorCenter(".panda-gallery__moment");
  await wait(1100);
  await clickLocatorCenter(".photo-stories__tap--next");
  await wait(700);
  await clickLocatorCenter(".photo-stories__tap--next");
  await wait(600);
  await clickLocatorCenter(".photo-stories__close");
  await wait(350);

  // 5 — Museu (preview embutido — espera SVGs + fotos, sem ampliar)
  await scrollToCardById("project_museum");
  await waitForMuseumScene(page);
  await wait(Math.min(3500, remaining()));

  // 6 — Caixa de bombons
  await scrollToCardById("project_chocolate");
  await wait(350);
  await clickLocatorCenter(".chocolate-open-hint");
  await wait(800);
  await clickLocatorCenter(".chocolate-viewer-bite");
  await wait(700);
  await clickLocatorCenter(".chocolate-viewer-bite");
  await wait(600);

  // 7 — Buquê
  await scrollToCardById("bouquet");
  await wait(1200);

  // 8 — Carta de amor
  await scrollToCardById("letter");
  await wait(350);
  await clickLocatorCenter(".evnelope-hit");
  await wait(1800);

  // 9 — Despedida final
  await scrollToCardById("forever");
  await wait(Math.min(1800, remaining()));

  const video = page.video();
  await context.close();
  await browser.close();

  if (!video) throw new Error("Playwright não gerou o arquivo de vídeo.");

  const recordedPath = await video.path();
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  try {
    await fs.unlink(OUTPUT_WEBM);
  } catch {
    /* ok */
  }

  await fs.rename(recordedPath, OUTPUT_WEBM);
  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`Vídeo salvo: ${OUTPUT_WEBM} (${elapsed}s)`);

  try {
    execSync(
      `ffmpeg -y -i "${OUTPUT_WEBM}" -c:v libx264 -crf 23 -preset medium -movflags +faststart "${OUTPUT_MP4}"`,
      { stdio: "ignore" }
    );
    console.log(`MP4 gerado: ${OUTPUT_MP4}`);
  } catch {
    console.log("ffmpeg não disponível — usando presente-demo.webm no mockup.");
  }
}

async function warmupPage(browser: Browser) {
  const page = await browser.newPage();
  await page.goto(DEMO_URL, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForSelector(".panda-present", { timeout: 60_000 });
  await hideDevUi(page);
  await waitForCriticalAssets(page);
  await waitForPresentPreload(page);
  await page.locator("#card-project_museum").scrollIntoViewIfNeeded();
  await waitForMuseumScene(page);
  await page.close();
}

async function waitForPresentPreload(page: Page) {
  await page
    .waitForFunction(
      () => document.documentElement.getAttribute("data-present-preload") === "ready",
      undefined,
      { timeout: 120_000 }
    )
    .catch(() => undefined);
  await page.waitForTimeout(400);
}

async function waitForMuseumScene(page: Page) {
  await page
    .waitForFunction(
      () => {
        const card = document.getElementById("card-project_museum");
        if (!card) return false;
        if (!card.querySelector(".museum-wall-v2")) return false;

        const photos = card.querySelectorAll(".museum-wall-v2 .museum-frame-photo");
        return photos.length >= 2;
      },
      undefined,
      { timeout: 60_000 }
    )
    .catch(() => undefined);
  await page.waitForTimeout(1200);
}

async function waitForCriticalAssets(page: Page) {
  await page.waitForFunction(
    () => {
      const svg = document.querySelector(".gift-box__svg");
      return Boolean(svg && svg.innerHTML.trim().length > 80);
    },
    undefined,
    { timeout: 10_000 }
  );
  await page
    .waitForFunction(
      () => document.documentElement.getAttribute("data-present-critical-ready") === "ready",
      undefined,
      { timeout: 30_000 }
    )
    .catch(() => undefined);
  await page.waitForTimeout(300);
}

recordDemo().catch((error) => {
  console.error(error);
  process.exit(1);
});
