"use client";

import { MockupShell } from "../MockupShell";

const BOUQUET_CARD_IMAGE = "/marketing/previews/bouquet-card.png";

export function BouquetMockupPreview({ active: _active }: { active: boolean }) {
  return (
    <MockupShell className="mockup-shell--bouquet" center>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BOUQUET_CARD_IMAGE}
        alt="Buquê personalizado, Letticia escolheu as flores pra você"
        className="mockup-bouquet-card-image"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </MockupShell>
  );
}
