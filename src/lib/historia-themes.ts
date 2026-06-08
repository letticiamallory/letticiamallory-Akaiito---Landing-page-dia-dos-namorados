export type HistoriaThemeId = "colagem";

export interface HistoriaTheme {
  id: HistoriaThemeId;
  name: string;
  description: string;
  preview: { bg: string; accent: string; surface: string };
  vars: Record<string, string>;
}

export const SCRAPBOOK_THEME: HistoriaTheme = {
  id: "colagem",
  name: "Scrapbook",
  description: "Colagem romântica: bordô, creme, adesivos e polaroids",
  preview: { bg: "#f4e8d8", accent: "#6b1c24", surface: "#fff9f0" },
  vars: {
    "--hp-bg": "#f4e8d8",
    "--hp-bg2": "#ebe0d0",
    "--hp-surface": "#fff9f0",
    "--hp-text": "#2a1215",
    "--hp-text-muted": "#6b5344",
    "--hp-accent": "#6b1c24",
    "--hp-accent-soft": "#9a3040",
    "--hp-gold": "#b8860b",
    "--hp-border": "rgba(107, 28, 36, 0.15)",
    "--hp-hero-overlay":
      "linear-gradient(180deg, rgba(74,18,24,0.15) 0%, rgba(74,18,24,0.75) 100%)",
    "--hp-font-display": 'var(--font-caveat), "Caveat", cursive',
    "--hp-font-body": 'var(--font-lora), "Lora", Georgia, serif',
    "--hp-font-script": 'var(--font-caveat), "Caveat", cursive',
  },
};

/** Único tema ativo; links antigos com outros ids caem no scrapbook */
export const HISTORIA_THEMES: HistoriaTheme[] = [SCRAPBOOK_THEME];

export function getHistoriaTheme(_id?: HistoriaThemeId | string): HistoriaTheme {
  return SCRAPBOOK_THEME;
}
