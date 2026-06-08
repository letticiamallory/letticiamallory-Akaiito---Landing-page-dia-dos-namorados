"use client";

import { PresentPageScreenshot } from "./PresentPageScreenshot";

const HERO_LETTER_SHOT = "/marketing/previews/hero-letter.png";

export function LetterMockupPreview({ active: _active }: { active: boolean }) {
  return (
    <PresentPageScreenshot
      src={HERO_LETTER_SHOT}
      alt="Carta de amor aberta no presente digital"
    />
  );
}
