"use client";

import type { MuseumElement } from "@/lib/gift-types";
import { InlineSvg } from "@/components/InlineSvg";
import { getSpectatorDef } from "@/data/museum-frames";

export function SpectatorInstance({ element }: { element: MuseumElement }) {
  const def = element.spectatorIndex ? getSpectatorDef(element.spectatorIndex) : null;
  if (!def) return null;

  return <InlineSvg src={def.file} className="museum-spectator-img" />;
}
