export const HERO_TAGLINE_MAX_CHARS = 40;

export function clampHeroTagline(text: string): string {
  return text.slice(0, HERO_TAGLINE_MAX_CHARS);
}
