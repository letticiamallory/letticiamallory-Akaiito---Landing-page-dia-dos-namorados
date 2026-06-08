export const POLAROID_LABEL_MAX_CHARS = 20;

export function clampPolaroidLabel(text: string): string {
  return text.slice(0, POLAROID_LABEL_MAX_CHARS);
}
