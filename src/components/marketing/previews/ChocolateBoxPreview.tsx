"use client";

import { PresentPageScreenshot } from "./PresentPageScreenshot";

const HERO_CHOCOLATE_SHOT = "/marketing/previews/hero-chocolate.png";

export function ChocolateBoxPreview({ active: _active }: { active: boolean }) {
  return (
    <PresentPageScreenshot
      src={HERO_CHOCOLATE_SHOT}
      alt="Caixa de bombons aberta no presente digital"
    />
  );
}
