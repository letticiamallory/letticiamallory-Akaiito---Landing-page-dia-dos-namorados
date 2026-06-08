"use client";

import type { MuseumElement } from "@/lib/gift-types";
import { getSpectatorDef } from "@/data/museum-frames";

export function SpectatorInstance({ element }: { element: MuseumElement }) {
  const def = element.spectatorIndex ? getSpectatorDef(element.spectatorIndex) : null;
  if (!def) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={def.file}
      alt=""
      className="museum-spectator-img"
      draggable={false}
      loading="lazy"
    />
  );
}
