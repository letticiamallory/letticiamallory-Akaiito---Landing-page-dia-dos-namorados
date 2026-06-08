"use client";

import type { HistoriaCartaModule } from "@/lib/gift-types";
import { DEFAULT_BOUQUET, resolveBouquetConfig } from "@/lib/bouquet-catalog";
import { DEFAULT_LETTER, resolveWaxId } from "@/lib/letter-catalog";
import { EnvelopeAnimation } from "@/components/letter/envelope-animation";

export function HistoriaCartaSection({
  module,
  senderName,
  receiverName,
}: {
  module: HistoriaCartaModule;
  senderName: string;
  receiverName: string;
}) {
  const bouquet = resolveBouquetConfig(module.bouquet ?? DEFAULT_BOUQUET);
  const letter = module.letter
    ? { ...module.letter, waxId: resolveWaxId(module.letter.waxId) }
    : DEFAULT_LETTER;

  return (
    <div className="hp-carta-scene">
      <EnvelopeAnimation
        config={letter}
        senderName={senderName}
        receiverName={receiverName}
        message={module.message}
        bouquet={bouquet}
      />
    </div>
  );
}
