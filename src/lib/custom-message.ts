export const CUSTOM_MESSAGE_BODY_MAX_CHARS = 20;
export const CUSTOM_MESSAGE_CTA_MAX_CHARS = 12;

export function clampCustomMessageBody(text: string): string {
  return text.slice(0, CUSTOM_MESSAGE_BODY_MAX_CHARS);
}

export function clampCustomMessageCta(text: string): string {
  return text.slice(0, CUSTOM_MESSAGE_CTA_MAX_CHARS);
}
