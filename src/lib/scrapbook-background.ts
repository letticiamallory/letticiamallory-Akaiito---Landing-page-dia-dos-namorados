/**
 * Fundo da página do scrapbook.
 *
 * - `v2`     → textura vermelha gerada (CSS + grain SVG) — padrão atual
 * - `canva`  → foto veludo original do Canva (`bg-texture.jpeg`) — mantida intacta
 */
export type ScrapbookBackgroundVariant = "v2" | "canva";

export const SCRAPBOOK_BACKGROUND: ScrapbookBackgroundVariant = "v2";

export const SCRAPBOOK_BG_CANVA_IMAGE = "/scrapbook/canva/hero/bg-texture.jpeg";
