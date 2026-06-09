import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";
import { chromium, type Browser, type Page } from "playwright";

const OUTPUT_DIR = "public/assets/demo";
const OUTPUT_BASENAME = process.env.RECORD_BASENAME ?? "presente-letticia-joao";
const OUTPUT_WEBM = path.join(OUTPUT_DIR, `${OUTPUT_BASENAME}.webm`);
const OUTPUT_MP4 = path.join(OUTPUT_DIR, `${OUTPUT_BASENAME}.mp4`);
const DEMO_URL =
  process.env.RECORD_URL ?? "http://localhost:3000/presente/demo-preview";
/** Duração alvo do tour interativo (após preload) */
const TARGET_DURATION_MS = Number(process.env.RECORD_MAX_MS ?? 64_000);
const SKIP_WARMUP = process.env.RECORD_SKIP_WARMUP !== "0";
const log = (step: string) => console.log(`[record-demo] ${step}`);

const HIDE_DEV_UI_CSS = `
  nextjs-portal,
  next-route-announcer,
  [data-nextjs-toast],
  [data-nextjs-toast-errors],
  [data-nextjs-dialog-overlay],
  [data-nextjs-dev-tools-button],
  [data-nextjs-dev-toolbar],
  [data-nextjs-scroll-focus-boundary],
  .nextjs-toast,
  .nextjs-toast-errors-parent,
  #__next-build-watcher,
  #__next-dev-overlay {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
    opacity: 0 !important;
    width: 0 !important;
    height: 0 !important;
    overflow: hidden !important;
  }
`;

const HIDE_DEV_UI_INIT_SCRIPT = `
(() => {
  const css = ${JSON.stringify(HIDE_DEV_UI_CSS)};
  const STYLE_ID = "record-demo-hide-next";
  const SELECTOR =
    "nextjs-portal, next-route-announcer, [data-nextjs-toast], [data-nextjs-toast-errors], [data-nextjs-dev-tools-button], [data-nextjs-dev-toolbar], .nextjs-toast-errors-parent";

  const ensureStyle = () => {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent = css;
  };

  const purge = () => {
    ensureStyle();
    document.querySelectorAll(SELECTOR).forEach((el) => {
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("visibility", "hidden", "important");
      el.style.setProperty("opacity", "0", "important");
      el.style.setProperty("pointer-events", "none", "important");
    });
  };

  purge();
  new MutationObserver(purge).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
`;

async function hideDevUi(page: Page) {
  await page.addStyleTag({ content: HIDE_DEV_UI_CSS });
  await page.evaluate(HIDE_DEV_UI_INIT_SCRIPT);
}

/** Bloqueia só o stream de vídeo — mantém API/embed do YouTube para o player reagir ao clique */
async function blockHeavyMedia(page: Page) {
  await page.route("**/*", async (route) => {
    const url = route.request().url();
    if (url.includes("googlevideo.com")) {
      await route.abort();
      return;
    }
    await route.continue();
  });
}

async function recordDemo() {
  log("iniciando navegador");
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
    ],
  });

  if (!SKIP_WARMUP) {
    log("warmup da página");
    await warmupPage(browser);
  }

  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: OUTPUT_DIR,
      size: { width: 393, height: 852 },
    },
  });
  await context.addInitScript(HIDE_DEV_UI_INIT_SCRIPT);

  const page = await context.newPage();
  page.setDefaultTimeout(45_000);
  await blockHeavyMedia(page);

  log("abrindo presente demo");
  await page.goto(DEMO_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForSelector(".panda-present", { timeout: 90_000 });
  await hideDevUi(page);
  await waitForCriticalAssets(page);
  await waitForPresentPreload(page);
  log("preload pronto — gravando tour");

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

  /** Contagem começa só depois do preload — interações usam o vídeo inteiro */
  const startedAt = Date.now();
  const tourElapsed = () => Date.now() - startedAt;
  const wait = async (ms: number) => page.waitForTimeout(ms);
  const holdUntilTarget = async (minTailMs = 2500) => {
    const tail = Math.max(minTailMs, TARGET_DURATION_MS - tourElapsed());
    await wait(tail);
  };

  const move = async (x: number, y: number) => {
    await page.mouse.move(x, y, { steps: 10 });
    await wait(50);
  };

  const clickAt = async (x: number, y: number) => {
    await move(x, y);
    await wait(100);
    await page.mouse.down();
    await wait(50);
    await page.mouse.up();
    await wait(150);
  };

  const scrollToCardById = async (cardId: string) => {
    const card = page.locator(`#card-${cardId}`).first();
    if ((await card.count()) === 0) return;
    await card.scrollIntoViewIfNeeded();
    await page.evaluate((id) => {
      const el = document.getElementById(`card-${id}`);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
    }, cardId);
    await wait(350);
  };

  const clickLocator = async (selector: string) => {
    const locator = page.locator(selector).first();
    if ((await locator.count()) === 0) return false;
    await locator.scrollIntoViewIfNeeded();
    await locator.waitFor({ state: "visible", timeout: 8000 }).catch(() => undefined);
    await wait(220);
    const box = await locator.boundingBox();
    if (!box) return false;
    await clickAt(box.x + box.width / 2, Math.min(box.y + box.height / 2, 820));
    return true;
  };

  const clickRole = async (name: RegExp, scope?: string) => {
    const root = scope ? page.locator(scope) : page;
    const btn = root.getByRole("button", { name }).first();
    if ((await btn.count()) === 0) return false;
    await btn.scrollIntoViewIfNeeded();
    await btn.waitFor({ state: "visible", timeout: 8000 }).catch(() => undefined);
    await wait(220);
    const box = await btn.boundingBox();
    if (!box) return false;
    await clickAt(box.x + box.width / 2, Math.min(box.y + box.height / 2, 820));
    return true;
  };

  const waitForHidden = async (selector: string, timeoutMs = 6000) => {
    await page
      .locator(selector)
      .first()
      .waitFor({ state: "hidden", timeout: timeoutMs })
      .catch(() => undefined);
  };

  // Começa no topo — música é o primeiro card
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await wait(1200);

  // 1 — Música: toca desde o início (~7s)
  log("música");
  await scrollToCardById("music");
  await wait(600);
  await page
    .locator(".panda-music-card__play")
    .first()
    .waitFor({ state: "visible", timeout: 15_000 })
    .catch(() => undefined);
  await wait(800);
  await clickLocator("#card-music .panda-music-card__play");
  await wait(5800);

  // 2 — Câmera polaroid: caixa → flash → 2 fotos (~12s)
  await scrollToCardById("hero");
  await wait(700);
  await clickLocator("#card-hero .gift-box");
  await wait(2800);
  await page
    .locator("#card-hero .cam-stage__camera-btn")
    .first()
    .waitFor({ state: "visible", timeout: 8000 })
    .catch(() => undefined);
  await clickLocator("#card-hero .cam-stage__camera-btn");
  await wait(7200);

  // 3 — Sobre o casal + contador (~6s)
  await scrollToCardById("about_couple");
  await wait(5800);

  // 4 — Memórias: abre galeria e navega (~7s)
  log("memórias");
  await scrollToCardById("memories");
  await wait(500);
  await clickLocator("#card-memories .panda-gallery__moment");
  await page
    .locator(".photo-stories")
    .first()
    .waitFor({ state: "visible", timeout: 8000 })
    .catch(() => undefined);
  await wait(1800);
  await clickLocator(".photo-stories__tap--next");
  await wait(1500);
  await clickLocator(".photo-stories__tap--next");
  await wait(1200);
  await clickLocator(".photo-stories__close");
  await waitForHidden(".photo-stories");
  await wait(600);

  // 5 — Museu: só rola e observa (sem clicar / ampliar)
  await scrollToCardById("project_museum");
  await wait(3200);

  // 6 — Bombons: abre a caixa e morde 2 (~6s)
  log("bombons");
  await scrollToCardById("project_chocolate");
  await wait(500);
  await clickRole(/abrir caixa de chocolates/i, "#card-project_chocolate");
  await page
    .locator("#card-project_chocolate .chocolate-placements-layer--visible")
    .first()
    .waitFor({ state: "visible", timeout: 8000 })
    .catch(() => undefined);
  await wait(1200);
  for (let i = 0; i < 2; i++) {
    await clickLocator("#card-project_chocolate .chocolate-viewer-bite");
    await wait(1300);
  }

  // 7 — Buquê (~5s)
  await scrollToCardById("bouquet");
  await wait(4800);

  // 8 — Carta: abre o envelope (~7s)
  log("carta");
  await scrollToCardById("letter");
  await wait(500);
  await clickLocator("#card-letter .evnelope-hit");
  await page
    .locator("#card-letter .envelope-gift-scene--open")
    .first()
    .waitFor({ state: "visible", timeout: 8000 })
    .catch(() => undefined);
  await wait(6200);

  // 9 — Despedida — segura até completar ~1 min de tour
  log("final");
  await scrollToCardById("forever");
  await holdUntilTarget(3000);

  log("finalizando vídeo");
  const video = page.video();
  await page.close();
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
  const durationSec = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`Vídeo salvo: ${OUTPUT_WEBM} (${durationSec}s)`);

  try {
    execSync(
      `ffmpeg -y -i "${OUTPUT_WEBM}" -c:v libx264 -crf 23 -preset medium -movflags +faststart "${OUTPUT_MP4}"`,
      { stdio: "ignore" }
    );
    console.log(`MP4 gerado: ${OUTPUT_MP4}`);
  } catch {
    console.log("ffmpeg não disponível — apenas WebM foi gerado.");
  }
}

async function warmupPage(browser: Browser) {
  const page = await browser.newPage();
  await blockHeavyMedia(page);
  await page.goto(DEMO_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForSelector(".panda-present", { timeout: 45_000 });
  await hideDevUi(page);
  await waitForCriticalAssets(page);
  await waitForPresentPreload(page);
  await page.close();
}

async function waitForPresentPreload(page: Page) {
  await page
    .waitForFunction(
      () => document.documentElement.getAttribute("data-present-preload") === "ready",
      undefined,
      { timeout: 60_000 }
    )
    .catch(() => undefined);
  await page.waitForTimeout(300);
}

async function waitForCriticalAssets(page: Page) {
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
  await page.waitForTimeout(300);
}

recordDemo().catch((error) => {
  console.error(error);
  process.exit(1);
});
