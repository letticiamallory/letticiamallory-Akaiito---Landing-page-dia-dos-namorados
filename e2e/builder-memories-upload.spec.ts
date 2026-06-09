import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DEMO_PRESENT } from "../src/data/demo-present";
import type { BuilderSection, PhotoCollageData } from "../src/lib/builder/types";
import { DEFAULT_PHOTO_MOMENTS, COLLAGE_PHOTOS_PER_MOMENT } from "../src/lib/photo-moments";

const BUILDER_STORAGE_KEY = "linkamor-builder-v2";
const DEMO_JPEGS = [1, 2, 3, 4, 5, 6].map((n) =>
  join(process.cwd(), `public/assets/demo/couple-${n}.jpg`)
);
const DEMO_JPG = DEMO_JPEGS[0];

function buildMemoriesBuilderSections(): BuilderSection[] {
  return DEMO_PRESENT.sections.map((section, order) => {
    const base: BuilderSection = {
      id: section.id,
      sectionId: section.sectionId,
      order,
      data: section.data,
      isComplete: true,
    };

    if (section.sectionId === "photo_collage") {
      return {
        ...base,
        data: {
          layout: "scattered",
          moments: DEFAULT_PHOTO_MOMENTS,
          photos: [],
        } satisfies PhotoCollageData,
        isComplete: false,
      };
    }

    return base;
  });
}

function buildMemoriesPersistState() {
  return {
    state: {
      pageConfig: {
        coupleNames: DEMO_PRESENT.pageConfig.coupleNames,
        theme: "scrapbook_red" as const,
      },
      sections: buildMemoriesBuilderSections(),
      builderStep: "customize" as const,
      currentSectionIndex: 3,
      buyerEmail: "",
    },
    version: 0,
  };
}

/** Simula upload serverless (base64) — cenário que estourava o localStorage. */
function dataUrlFromDemoJpeg(): string {
  const buffer = readFileSync(DEMO_JPG);
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

test.describe("Builder — memórias (quota localStorage)", () => {
  test("5 fotos por momento (15 total) não estoura o rascunho", async ({ page }) => {
    test.setTimeout(300_000);

    const dataUrl = dataUrlFromDemoJpeg();

    await page.route("**/api/upload", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: dataUrl }),
      });
    });

    await page.addInitScript(
      ({ key, value }) => {
        localStorage.setItem(key, JSON.stringify(value));
      },
      { key: BUILDER_STORAGE_KEY, value: buildMemoriesPersistState() }
    );

    await page.goto("/criar/personalizar/3");
    await expect(page.getByText("Fotos do casal")).toBeVisible({ timeout: 60_000 });

    const fileInputs = page.locator('input[type="file"][accept="image/*"][multiple]');
    await expect(fileInputs.first()).toBeAttached();

    const momentCount = await fileInputs.count();
    expect(momentCount).toBeGreaterThanOrEqual(3);

    const batch = Array.from(
      { length: COLLAGE_PHOTOS_PER_MOMENT },
      (_, i) => DEMO_JPEGS[i % DEMO_JPEGS.length]
    );

    for (let i = 0; i < momentCount; i++) {
      await fileInputs.nth(i).setInputFiles(batch);
      await expect(page.getByText(/exceeded the quota/i)).toHaveCount(0);
      await expect(page.getByText(`${COLLAGE_PHOTOS_PER_MOMENT}/${COLLAGE_PHOTOS_PER_MOMENT}`).nth(i)).toBeVisible({
        timeout: 60_000,
      });
      await page.waitForTimeout(400);
    }

    await expect(page.getByText(/exceeded the quota/i)).toHaveCount(0);

    const expectedTotal = momentCount * COLLAGE_PHOTOS_PER_MOMENT;
    const thumbs = page.locator(".grid.grid-cols-3 img");
    await expect(thumbs).toHaveCount(expectedTotal, { timeout: 60_000 });

    const storage = await page.evaluate((key) => {
      const raw = localStorage.getItem(key) ?? "";
      const inlineHugeBase64 = /data:image\/[^;]+;base64,[A-Za-z0-9+/=]{80_000,}/.test(raw);
      return {
        bytes: raw.length,
        usesIdbRefs: raw.includes("__linkamor_img:"),
        inlineHugeBase64,
      };
    }, BUILDER_STORAGE_KEY);

    expect(storage.bytes).toBeLessThan(800_000);
    expect(storage.usesIdbRefs || !storage.inlineHugeBase64).toBeTruthy();

    const photosInStore = await page.evaluate(() => {
      const raw = localStorage.getItem("linkamor-builder-v2");
      if (!raw) return 0;
      const parsed = JSON.parse(raw) as {
        state?: { sections?: { sectionId?: string; data?: { photos?: unknown[] } }[] };
      };
      const collage = parsed.state?.sections?.find((s) => s.sectionId === "photo_collage");
      return collage?.data?.photos?.length ?? 0;
    });

    expect(photosInStore).toBe(expectedTotal);
  });
});
