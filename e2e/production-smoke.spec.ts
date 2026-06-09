import { test, expect } from "@playwright/test";

const productionUrl = process.env.PLAYWRIGHT_BASE_URL;
const isProduction =
  productionUrl && !/localhost|127\.0\.0\.1/i.test(productionUrl);

test.describe("Smoke produção", () => {
  test.skip(!isProduction, "Defina PLAYWRIGHT_BASE_URL=https://seu-dominio.vercel.app");

  test("landing abre", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("link", { name: /criar o presente/i }).first()).toBeVisible();
  });

  test("demo-preview carrega", async ({ page }) => {
    const res = await page.goto("/presente/demo-preview");
    expect(res?.status()).toBe(200);
    await expect(page.locator(".panda-present")).toBeVisible({ timeout: 90_000 });
  });

  test("assets LFS do museu não são ponteiros", async ({ request }) => {
    const head = await request.head("/museum/frame-1.svg", { timeout: 30_000 });
    expect(head.status()).toBe(200);
    const len = Number(head.headers()["content-length"] || 0);
    expect(len).toBeGreaterThan(1000);
    if (len < 500) {
      const body = await request.get("/museum/frame-1.svg");
      expect(await body.text()).not.toContain("git-lfs.github.com");
    }
  });
});
