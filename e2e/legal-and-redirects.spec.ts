import { test, expect } from "@playwright/test";

test.describe("Páginas legais", () => {
  test("termos de uso", async ({ page }) => {
    await page.goto("/termos");
    await expect(page.getByRole("heading", { level: 1, name: /termos de uso/i })).toBeVisible();
  });

  test("política de privacidade", async ({ page }) => {
    await page.goto("/privacidade");
    await expect(
      page.getByRole("heading", { level: 1, name: /política de privacidade/i })
    ).toBeVisible();
  });

  test("contato", async ({ page }) => {
    await page.goto("/contato");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("Redirects do builder", () => {
  test("/criar redireciona para seções", async ({ page }) => {
    await page.goto("/criar");
    await expect(page).toHaveURL(/\/criar\/secoes/);
  });

  test("/criar/historia redireciona para seções", async ({ page }) => {
    await page.goto("/criar/historia");
    await expect(page).toHaveURL(/\/criar\/secoes/);
  });

  test("rotas legadas de produto redirecionam para o builder", async ({ page }) => {
    for (const legacy of ["/criar/carta", "/criar/museu", "/criar/chocolates"]) {
      await page.goto(legacy);
      await expect(page).toHaveURL(/\/criar\/secoes/);
    }
  });
});
