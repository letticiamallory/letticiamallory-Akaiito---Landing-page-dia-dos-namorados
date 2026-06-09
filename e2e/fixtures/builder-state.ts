import { DEMO_PRESENT } from "../../src/data/demo-present";
import type { BuilderSection } from "../../src/lib/builder/types";

const BUILDER_STORAGE_KEY = "linkamor-builder-v2";

function toBuilderSections(): BuilderSection[] {
  return DEMO_PRESENT.sections.map((section, order) => ({
    id: section.id,
    sectionId: section.sectionId,
    order,
    data: section.data,
    isComplete: true,
  }));
}

/** Estado persistido do Zustand para pular o builder nos testes */
export function buildBuilderPersistState() {
  return {
    state: {
      pageConfig: {
        coupleNames: DEMO_PRESENT.pageConfig.coupleNames,
        theme: "scrapbook_red" as const,
      },
      sections: toBuilderSections(),
      builderStep: "preview" as const,
      currentSectionIndex: 0,
      buyerEmail: "e2e-buyer@akaiito.test",
    },
    version: 0,
  };
}

export async function seedBuilderPreview(page: import("@playwright/test").Page) {
  const payload = buildBuilderPersistState();
  await page.addInitScript(
    ({ key, value }) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    { key: BUILDER_STORAGE_KEY, value: payload }
  );
}
