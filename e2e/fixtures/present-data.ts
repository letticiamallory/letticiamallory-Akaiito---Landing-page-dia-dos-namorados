import type { ScrapbookPresentData } from "../../src/lib/builder/types";
import { DEMO_PRESENT } from "../../src/data/demo-present";

/** Payload completo para testes de compra / presente pago */
export const E2E_PRESENT_DATA: ScrapbookPresentData = structuredClone(DEMO_PRESENT);

/** Payload mínimo aceito pela API */
export const MINIMAL_PRESENT_DATA: ScrapbookPresentData = {
  version: 2,
  pageConfig: {
    coupleNames: "E2E Test & Partner",
    theme: "scrapbook_red",
    createdAt: new Date().toISOString(),
  },
  sections: DEMO_PRESENT.sections.filter((s) =>
    ["hero_couple", "counter_together", "favorite_song", "custom_message"].includes(s.sectionId)
  ),
};
