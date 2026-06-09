import { test, expect } from "@playwright/test";

test.describe("Landing e marketing", () => {
  test("home carrega com CTA para criar presente", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Akaiito/i);
    const createLink = page.getByRole("link", { name: /criar o presente/i }).first();
    await expect(createLink).toBeVisible();
    await expect(createLink).toHaveAttribute("href", /\/criar\/secoes/);
  });

  test("home exibe preço do produto", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/R\$\s*4,90/i).first()).toBeVisible();
  });

  test("seção de produtos e FAQ estão na página", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#produtos")).toBeVisible();
    await expect(page.getByRole("heading", { name: /perguntas frequentes/i })).toBeVisible();
  });

  test("footer com links legais", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /termos/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /privacidade/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /contato/i })).toBeVisible();
  });
});
