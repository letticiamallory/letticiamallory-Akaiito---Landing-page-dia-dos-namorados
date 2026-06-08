"use client";

import { PresentPageScreenshot } from "./PresentPageScreenshot";

const HERO_MUSEUM_SHOT = "/marketing/previews/hero-museum.png";

export function MuseumPreview({ active: _active }: { active: boolean }) {
  return (
    <PresentPageScreenshot
      src={HERO_MUSEUM_SHOT}
      alt="Museu de Nós no presente digital"
    />
  );
}
