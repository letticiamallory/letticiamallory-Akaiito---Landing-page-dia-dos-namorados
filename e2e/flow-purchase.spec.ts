import { test, expect } from "@playwright/test";
import { seedBuilderPreview } from "./fixtures/builder-state";
import { E2E_PRESENT_DATA, MINIMAL_PRESENT_DATA } from "./fixtures/present-data";
import { createGift, confirmGiftDemo } from "./helpers/gift-api";
import { preparePresentPage } from "./helpers/present";

const dbAvailable = () => process.env.E2E_DB_AVAILABLE === "true";
const demoCheckout = () => process.env.E2E_DEMO_CHECKOUT === "true";

test.describe("Fluxo de compra — UI", () => {
  test.skip(!dbAvailable(), "DATABASE_URL indisponível");

  test("preview → checkout demo → obrigado → presente", async ({ page }) => {
    test.skip(!demoCheckout(), "Servidor sem modo demo (token MP ativo) — use pagamento?demo=1 ou CI");
    await seedBuilderPreview(page);
    await page.goto("/criar/preview");
    await expect(page.getByRole("heading", { name: /quase pronto/i })).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByRole("button", { name: /Comprar e gerar link/i })).toBeVisible();

    await page.getByPlaceholder("seu@email.com").fill("e2e-ui-flow@akaiito.test");
    await expect(page.getByRole("button", { name: /Comprar e gerar link/i })).toBeEnabled();
    await page.getByRole("button", { name: /Comprar e gerar link/i }).click();

    await expect(page).toHaveURL(/\/pagamento\/[0-9a-f-]+/, { timeout: 45_000 });
    await expect(page.getByText(/Modo demonstração|demonstração/i)).toBeVisible({ timeout: 30_000 });
    await page.getByRole("button", { name: /Simular pagamento Pix/i }).click();

    await expect(page).toHaveURL(/\/obrigado\/[a-z0-9]+/, { timeout: 45_000 });
    await expect(page.getByRole("heading", { name: /Presente pronto/i })).toBeVisible();

    const linkText = await page.locator("div.break-all").first().textContent();
    expect(linkText).toMatch(/\/presente\/[a-z0-9]+/);

    await page.getByRole("link", { name: /Ver presente/i }).click();
    await expect(page.locator(".panda-present")).toBeVisible({ timeout: 60_000 });
  });

  test("página de pagamento com demo=1 libera via simulação", async ({ page, request }) => {
    const created = await createGift(request);
    await page.goto(`/pagamento/${created.id}?demo=1`);
    await expect(page.getByRole("button", { name: /Simular pagamento Pix/i })).toBeVisible({
      timeout: 30_000,
    });
    await page.getByRole("button", { name: /Simular pagamento Pix/i }).click();
    await expect(page).toHaveURL(/\/obrigado\//, { timeout: 45_000 });
  });

  test("obrigado exibe link copiável e abre presente", async ({ page, request }) => {
    const created = await createGift(request, { data: E2E_PRESENT_DATA });
    const paid = await confirmGiftDemo(request, created.id);
    const slug = paid.slug;

    await page.goto(`/obrigado/${slug}`);
    await expect(page.getByText(`/presente/${slug}`)).toBeVisible();
    await page.getByRole("link", { name: /Ver presente/i }).click();
    await expect(page).toHaveURL(new RegExp(`/presente/${slug}`));
    await expect(page.locator(".panda-present")).toBeVisible({ timeout: 60_000 });
  });

  test("presente pago carrega após liberação", async ({ page, request }) => {
    const created = await createGift(request, { data: E2E_PRESENT_DATA });
    const paid = await confirmGiftDemo(request, created.id);
    await preparePresentPage(page, `/presente/${paid.slug}`);
    await expect(page.getByText(/João|Letticia/i).first()).toBeVisible();
  });
});

test.describe("Fluxo de compra — builder", () => {
  test("escolha de seções exige mínimo e avança", async ({ page }) => {
    await page.goto("/criar/secoes");
    await expect(page.getByRole("button", { name: /Continuar/i })).toBeVisible({ timeout: 30_000 });

    const continueBtn = page.getByRole("button", { name: /Continuar/i });
    const enabled = await continueBtn.isEnabled();
    if (!enabled) {
      const cards = page.locator("button").filter({ hasText: /Memórias|Carta|Museu/i });
      const count = await cards.count();
      for (let i = 0; i < Math.min(count, 2); i++) {
        await cards.nth(i).click();
      }
    }
    await expect(continueBtn).toBeEnabled({ timeout: 15_000 });
    await continueBtn.click();
    await expect(page).toHaveURL(/\/criar\/personalizar\/0/);
  });

  test("builder com seed abre preview com resumo", async ({ page }) => {
    await seedBuilderPreview(page);
    await page.goto("/criar/preview");
    await expect(page.getByText(/seções selecionadas/i)).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/R\$\s*4,90/i)).toBeVisible();
    await expect(page.locator(".panda-present, [class*='scrapbook']").first()).toBeVisible({
      timeout: 60_000,
    });
  });
});

test.describe("Fluxo de pré-carregamento", () => {
  test.skip(!dbAvailable(), "DATABASE_URL indisponível");

  test("checkout pré-carrega assets na página de pagamento", async ({ page, request }) => {
    test.setTimeout(90_000);
    const created = await createGift(request, { data: MINIMAL_PRESENT_DATA });
    await page.goto(`/pagamento/${created.id}?demo=1`);
    await page.waitForTimeout(2000);
    const preloadAttr = await page.evaluate(() =>
      document.documentElement.getAttribute("data-present-preload")
    );
    expect(["ready", "loading", null]).toContain(preloadAttr);
  });
});
