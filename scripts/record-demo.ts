import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";
import { chromium, type Page } from "playwright";

const OUTPUT_DIR = "public/assets/demo";
const OUTPUT_WEBM = path.join(OUTPUT_DIR, "presente-demo.webm");
const OUTPUT_MP4 = path.join(OUTPUT_DIR, "presente-demo.mp4");
const DEMO_URL = process.env.RECORD_URL ?? "http://localhost:3000/presente/mv3ejyxx";
const MAX_DURATION_MS = 55_000;

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

  const page = await context.newPage();
  page.setDefaultTimeout(45_000);

  await page.goto(DEMO_URL, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.waitForSelector(".panda-present", { timeout: 20_000 });
  await waitForCriticalAssets(page);

  await page.addStyleTag({
    content: `
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

  const smoothScrollBy = async (delta: number) => {
    if (Math.abs(delta) < 4) return;
    const steps = Math.min(8, Math.max(4, Math.round(Math.abs(delta) / 80)));
    const stepDelta = delta / steps;
    for (let i = 0; i < steps; i++) {
      await page.mouse.wheel(0, stepDelta);
      await wait(35);
    }
    await wait(200);
  };

  const scrollToCard = async (title: string) => {
    const target = await page.evaluate((cardTitle) => {
      const cards = Array.from(document.querySelectorAll(".panda-present .panda-card"));
      const card = cards.find((node) =>
        node.textContent?.toLowerCase().includes(cardTitle.toLowerCase())
      ) as HTMLElement | undefined;
      if (!card) return window.scrollY;
      const rect = card.getBoundingClientRect();
      return Math.max(0, window.scrollY + rect.top - 36);
    }, title);

    const current = await page.evaluate(() => window.scrollY);
    await smoothScrollBy(target - current);
    await page.evaluate((y) => window.scrollTo(0, y), target);
    await wait(280);
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

  // Hero + caixa polaroid + câmera
  await scrollToCard("Juntos para sempre");
  await wait(350);
  await clickLocatorCenter(".gift-box");
  await wait(700);
  await clickLocatorCenter(".cam-stage__camera-btn");
  await wait(1800);

  // Música
  await scrollToCard("Nossa Música");
  await wait(350);
  await clickLocatorCenter(".panda-music-card__play");
  await wait(900);

  // Galeria
  await scrollToCard("Memórias");
  await wait(300);
  await clickLocatorCenter(".panda-gallery__moment");
  await wait(1100);
  await clickLocatorCenter(".photo-stories__tap--next");
  await wait(700);
  await clickLocatorCenter(".photo-stories__close");
  await wait(300);

  // Museu
  await scrollToCard("Museu de Nós");
  await wait(500);
  await clickLocatorCenter(".museum-expand-btn");
  await wait(900);
  await move(220, 360);
  await wait(350);
  await page.keyboard.press("Escape");
  await wait(300);

  // Bombons
  await scrollToCard("Caixa de Bombons");
  await wait(300);
  await clickLocatorCenter(".chocolate-open-hint");
  await wait(700);
  await clickLocatorCenter(".chocolate-viewer-bite");
  await wait(600);

  // Carta
  await scrollToCard("Carta de amor");
  await wait(300);
  await clickLocatorCenter(".evnelope-hit");
  await wait(1600);

  // Despedida
  await scrollToCard("Para sempre");
  await wait(Math.min(1200, remaining()));

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

async function warmupPage(browser: Awaited<ReturnType<typeof chromium.launch>>) {
  const page = await browser.newPage();
  await page.goto(DEMO_URL, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForSelector(".panda-present", { timeout: 60_000 });
  await waitForCriticalAssets(page);
  await page.close();
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
