"use client";

import type { LoveLetterData } from "@/lib/builder/types";
import { DEFAULT_LETTER, resolveWaxId } from "@/lib/letter-catalog";
import { EnvelopeAnimation } from "@/components/letter/envelope-animation";
import { useCollageReveal } from "@/hooks/useCollageReveal";
import "./collage-carta.css";

export function CollageCartaSection({
  data,
  senderName,
  receiverName,
}: {
  data: LoveLetterData;
  senderName: string;
  receiverName: string;
}) {
  const reveal = useCollageReveal();
  if (!data.message?.trim()) return null;

  const letter = data.letter
    ? { ...data.letter, waxId: resolveWaxId(data.letter.waxId) }
    : DEFAULT_LETTER;

  return (
    <div className="collage-zone collage-carta-zone">
      <div ref={reveal.ref} className={`${reveal.className} collage-reveal--letter`}>
        <EnvelopeAnimation
          config={letter}
          senderName={senderName || "João"}
          receiverName={receiverName || "Letticia"}
          message={data.message}
        />
      </div>
    </div>
  );
}
