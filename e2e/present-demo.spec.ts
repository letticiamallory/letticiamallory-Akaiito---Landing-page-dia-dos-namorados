import { test, expect } from "@playwright/test";
import {
  preparePresentPage,
  scrollToCard,
  waitForMuseumScene,
  PRESENT_CARD_IDS,
} from "./helpers/present";

test.describe("Presente demo-preview", () => {
  test.beforeEach(async ({ page }) => {
    await preparePresentPage(page);
  });

  test("carrega shell do presente e preload", async ({ page }) => {
    await expect(page.locator(".panda-present")).toBeVisible();
    const preload = await page.evaluate(() =>
      document.documentElement.getAttribute("data-present-preload")
    );
    expect(preload).toBe("ready");
  });

  test("exibe nomes do casal demo", async ({ page }) => {
    await expect(page.getByText(/João e Letticia|João & Letticia/i).first()).toBeVisible();
    await expect(page.getByText(/A Thousand Years/i).first()).toBeVisible();
  });

  test("todos os cards principais existem no DOM", async ({ page }) => {
    for (const cardId of PRESENT_CARD_IDS) {
      await expect(page.locator(`#card-${cardId}`)).toHaveCount(1);
    }
  });

  test("assets demo (jpg) carregam com tamanho real", async ({ request }) => {
    for (const name of ["couple-1.jpg", "couple-3.jpg"]) {
      const res = await request.get(`/assets/demo/${name}`);
      expect(res.status()).toBe(200);
      const buf = await res.body();
      expect(buf.byteLength).toBeGreaterThan(10_000);
    }
  });

  test("museu embutido renderiza fotos nos quadros", async ({ page }) => {
    await scrollToCard(page, "project_museum");
    await waitForMuseumScene(page);
    const photos = page.locator("#card-project_museum .museum-frame-photo");
    await expect(photos).toHaveCount(3, { timeout: 60_000 });
    await expect(page.locator("#card-project_museum .museum-viewer--embedded")).toBeVisible();
  });

  test("SVGs do museu não são ponteiros Git LFS", async ({ request }) => {
    test.setTimeout(90_000);
    for (const asset of ["museum/frame-1.svg", "museum/museum-of-us.svg", "museum/spectator-1.svg"]) {
      const head = await request.head(`/${asset}`, { timeout: 60_000 });
      expect(head.status()).toBe(200);
      const len = Number(head.headers()["content-length"] || 0);
      expect(len).toBeGreaterThan(500);
    }
    const sample = await request.get("/museum/frame-1.svg", { timeout: 60_000 });
    const text = await sample.text();
    expect(text).not.toContain("git-lfs.github.com");
  });

  test("caixa de presente tem SVG inline carregado", async ({ page }) => {
    await scrollToCard(page, "hero");
    const hasSvg = await page.evaluate(() => {
      const svg = document.querySelector(".gift-box__svg");
      return Boolean(svg && svg.innerHTML.trim().length > 80);
    });
    expect(hasSvg).toBe(true);
  });

  test("carta usa envelope fechado inicialmente", async ({ page }) => {
    await scrollToCard(page, "letter");
    await expect(page.locator("#card-letter .evnelope.close")).toBeVisible();
    await expect(page.locator("#card-letter .evnelope-hit")).toBeVisible();
  });

  test("contador de tempo juntos está visível", async ({ page }) => {
    await scrollToCard(page, "about_couple");
    await expect(page.getByText(/Estamos juntos há/i)).toBeVisible();
    await expect(page.locator("#card-about_couple")).toBeVisible();
  });

  test("memórias exibem momentos clicáveis", async ({ page }) => {
    await scrollToCard(page, "memories");
    await expect(page.getByText("Nossos Dates").first()).toBeVisible();
    await expect(page.locator(".panda-gallery__moment").first()).toBeVisible();
  });
});
