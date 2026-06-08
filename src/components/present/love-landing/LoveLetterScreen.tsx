"use client";

import type { LoveLetterData } from "@/lib/builder/types";
import { DEFAULT_LETTER, resolveWaxId } from "@/lib/letter-catalog";
import { EnvelopeAnimation } from "@/components/letter/envelope-animation";

export function LoveLetterScreen({
  data,
  senderName,
  receiverName,
}: {
  data: LoveLetterData;
  senderName: string;
  receiverName: string;
}) {
  if (!data.message?.trim()) return null;

  const letter = data.letter
    ? { ...data.letter, waxId: resolveWaxId(data.letter.waxId) }
    : DEFAULT_LETTER;

  return (
    <div className="love-letter">
      <p className="love-letter__hint">Toque no envelope para abrir</p>
      <EnvelopeAnimation
        config={letter}
        senderName={senderName}
        receiverName={receiverName}
        message={data.message}
        compact
      />
    </div>
  );
}
