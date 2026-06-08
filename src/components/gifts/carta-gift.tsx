"use client";

import type { CartaData } from "@/lib/gift-types";
import { DEFAULT_BOUQUET, resolveBouquetConfig } from "@/lib/bouquet-catalog";
import { DEFAULT_LETTER, resolveWaxId } from "@/lib/letter-catalog";
import { EnvelopeAnimation } from "@/components/letter/envelope-animation";

export function CartaGift({ data }: { data: CartaData }) {
  const bouquet = resolveBouquetConfig(data.bouquet ?? DEFAULT_BOUQUET);
  const letter = data.letter
    ? { ...data.letter, waxId: resolveWaxId(data.letter.waxId) }
    : DEFAULT_LETTER;

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center">
      <EnvelopeAnimation
        config={letter}
        senderName={data.senderName}
        receiverName={data.receiverName}
        message={data.message}
        bouquet={bouquet}
      />
    </div>
  );
}
