import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  createGift,
  confirmGiftDemo,
  getGift,
  createAndPayGift,
} from "./helpers/gift-api";
import { E2E_PRESENT_DATA, MINIMAL_PRESENT_DATA } from "./fixtures/present-data";

const dbAvailable = () => process.env.E2E_DB_AVAILABLE === "true";

test.describe("API /api/gifts", () => {
  test.skip(!dbAvailable(), "DATABASE_URL indisponível");

  test("rejeita payload incompleto", async ({ request }) => {
    const res = await request.post("/api/gifts", { data: { productId: "historia" } });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/incompletos/i);
  });

  test("rejeita e-mail inválido", async ({ request }) => {
    const res = await request.post("/api/gifts", {
      data: {
        productId: "historia",
        buyerEmail: "nao-e-email",
        data: MINIMAL_PRESENT_DATA,
      },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/e-mail/i);
  });

  test("rejeita produto inexistente", async ({ request }) => {
    const res = await request.post("/api/gifts", {
      data: {
        productId: "produto-falso",
        buyerEmail: "test@akaiito.test",
        data: MINIMAL_PRESENT_DATA,
      },
    });
    expect(res.status()).toBe(404);
  });

  test("cria presente pendente com checkout", async ({ request }) => {
    const created = await createGift(request);
    expect(created.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );

    const isDemoCheckout = created.checkoutUrl.includes("/pagamento/");
    if (isDemoCheckout) {
      expect(created.checkoutUrl).toContain("demo=1");
    } else {
      expect(created.checkoutUrl).toMatch(/mercadopago\.com/i);
    }

    const info = await getGift(request, created.id);
    expect(info.status).toBe(200);
    expect(info.body.status).toBe("pending");
    expect(info.body.presentData).toBeTruthy();
    if (isDemoCheckout) {
      expect(info.body.demoMode).toBe(true);
    }
  });

  test("confirma pagamento demo e libera slug", async ({ request }) => {
    const created = await createGift(request);
    const paid = await confirmGiftDemo(request, created.id);
    expect(paid.slug).toMatch(/^[a-z0-9]{8}$/);
    expect(paid.link).toContain(`/presente/${paid.slug}`);

    const info = await getGift(request, created.id);
    expect(info.body.status).toBe("paid");
    expect(info.body.slug).toBe(paid.slug);
  });

  test("confirmação demo é idempotente", async ({ request }) => {
    const created = await createGift(request);
    const first = await confirmGiftDemo(request, created.id);
    const second = await confirmGiftDemo(request, created.id);
    expect(second.slug).toBe(first.slug);
  });

  test("POST pendente sem pagamento retorna 402", async ({ request }) => {
    const created = await createGift(request);
    const res = await request.post(`/api/gifts/${created.id}`, { data: {}, timeout: 60_000 });
    expect(res.status()).toBe(402);
  });

  test("GET presente inexistente retorna 404", async ({ request }) => {
    const res = await request.get("/api/gifts/00000000-0000-4000-8000-000000000000");
    expect(res.status()).toBe(404);
  });
});

test.describe("API /api/webhooks/mercadopago", () => {
  test("aceita ping GET sem quebrar", async ({ request }) => {
    const res = await request.get("/api/webhooks/mercadopago", { timeout: 60_000 });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  test("aceita POST vazio em modo demo", async ({ request }) => {
    const res = await request.post("/api/webhooks/mercadopago", { data: {} });
    expect(res.status()).toBe(200);
  });
});

test.describe("API /api/upload", () => {
  test("rejeita requisição sem arquivo", async ({ request }) => {
    const res = await request.post("/api/upload", {
      multipart: {},
    });
    expect([400, 500]).toContain(res.status());
  });

  test("aceita upload de imagem válida", async ({ request }) => {
    const imagePath = join(process.cwd(), "src/assets/demo/couple-1.jpg");
    const buffer = readFileSync(imagePath);
    const res = await request.post("/api/upload", {
      multipart: {
        file: {
          name: "couple-1.jpg",
          mimeType: "image/jpeg",
          buffer,
        },
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.url).toMatch(/^\/uploads\//);

    const asset = await request.get(body.url);
    expect(asset.status()).toBe(200);
  });
});

test.describe("API /api/music-metadata", () => {
  test("rejeita URL inválida", async ({ request }) => {
    const res = await request.get("/api/music-metadata?url=not-a-url");
    expect(res.status()).toBe(400);
  });

  test("aceita URL do YouTube", async ({ request }) => {
    const res = await request.get(
      "/api/music-metadata?url=https://www.youtube.com/watch?v=rtOvBOTyX00"
    );
    expect([200, 404]).toContain(res.status());
    if (res.status() === 200) {
      const body = await res.json();
      expect(body.songTitle || body.artistName || body.videoId).toBeTruthy();
    }
  });
});

test.describe("Presente pago via API", () => {
  test.skip(!dbAvailable(), "DATABASE_URL indisponível");

  test("slug pago abre página do presente", async ({ request, page }) => {
    const paid = await createAndPayGift(request, E2E_PRESENT_DATA);
    const res = await page.goto(`/presente/${paid.slug}`);
    expect(res?.status()).toBe(200);
    await expect(page.locator(".panda-present")).toBeVisible({ timeout: 60_000 });
  });

  test("slug pendente/inexistente retorna 404", async ({ page }) => {
    const res = await page.goto("/presente/sluginexistente");
    expect(res?.status()).toBe(404);
  });
});
