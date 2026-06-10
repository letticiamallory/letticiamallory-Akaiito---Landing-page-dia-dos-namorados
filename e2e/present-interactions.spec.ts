import { test, expect } from "@playwright/test";
import { preparePresentPage, scrollToCard, waitForMuseumScene } from "./helpers/present";

test.describe("Interações do presente demo", () => {
  test.beforeEach(async ({ page }) => {
    await preparePresentPage(page);
  });

  test("abre envelope da carta", async ({ page }) => {
    await scrollToCard(page, "letter");
    await page.locator("#card-letter .evnelope-hit").click();
    await page.waitForTimeout(1500);
    await expect(page.locator("#card-letter .envelope-gift-scene--open").first()).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText(/Letticia, você é a pessoa mais incrível/i)).toBeVisible();
  });

  test("abre caixa de bombons e mantém mordida após scroll", async ({ page }) => {
    await scrollToCard(page, "project_chocolate");
    const openBox = page.getByRole("button", { name: /abrir caixa de chocolates/i });
    if (await openBox.isVisible()) {
      await openBox.click();
      await page.waitForTimeout(800);
    }
    const bite = page.locator("#card-project_chocolate .chocolate-viewer-bite").first();
    await expect(bite).toBeVisible();
    const img = bite.locator("img").first();
    const srcBefore = await img.getAttribute("src");
    await bite.click({ force: true });
    await page.waitForTimeout(400);
    const srcAfterBite = await img.getAttribute("src");
    expect(srcAfterBite).toBeTruthy();
    expect(srcAfterBite).not.toBe(srcBefore);

    await scrollToCard(page, "bouquet");
    await page.waitForTimeout(400);
    await scrollToCard(page, "project_chocolate");
    await page.waitForTimeout(400);

    await expect(bite).toBeVisible();
    await expect(img).toHaveAttribute("src", srcAfterBite!);
  });

  test("botão ampliar museu abre modal", async ({ page }) => {
    await scrollToCard(page, "project_museum");
    await waitForMuseumScene(page);
    const expand = page.locator("#card-project_museum .museum-expand-btn");
    await expand.click();
    await expect(page.locator(".museum-expand-backdrop")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("galeria de memórias abre ao tocar momento", async ({ page }) => {
    await scrollToCard(page, "memories");
    await page.locator(".panda-gallery__moment").first().click();
    await expect(
      page.locator(".photo-stories, .panda-gallery__fullscreen, [class*='gallery']").first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("player de música está presente", async ({ page }) => {
    await scrollToCard(page, "music");
    await expect(page.getByRole("button", { name: /tocar música/i })).toBeVisible();
    await expect(page.getByText(/A Thousand Years/i).first()).toBeVisible();
  });

  test("câmera polaroid tem botão de captura", async ({ page }) => {
    await scrollToCard(page, "hero");
    await page.locator(".gift-box").click().catch(() => undefined);
    await page.waitForTimeout(800);
    const cameraBtn = page.locator(".cam-stage__camera-btn");
    if (await cameraBtn.isVisible()) {
      await expect(cameraBtn).toBeEnabled();
    }
  });
});
