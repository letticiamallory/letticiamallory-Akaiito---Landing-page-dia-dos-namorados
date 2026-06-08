"use client";

import type { MuseumOfUsData } from "@/lib/builder/types";
import { HistoriaMuseuSection } from "@/components/historia/historia-museu-section";
import "@/components/historia/historia-page.css";
import { useCollageReveal } from "@/hooks/useCollageReveal";
import "./collage-museum-hero.css";

export function CollageMuseumHeroSection({
  data,
  person1,
  person2,
}: {
  data: MuseumOfUsData;
  person1: string;
  person2: string;
}) {
  const reveal = useCollageReveal();
  const sender = data.person1Name?.trim() || person1 || "João";
  const receiver = data.person2Name?.trim() || person2 || "Letticia";

  return (
    <div className="collage-zone collage-museum-hero">
      <div ref={reveal.ref} className={`${reveal.className} collage-reveal--counter`}>
        <HistoriaMuseuSection
          module={{
            elements: data.elements,
            museumTitle: data.museumTitle,
            museumDate: data.museumDate,
            coupleName: `${sender} & ${receiver}`,
          }}
          senderName={sender}
          receiverName={receiver}
        />
      </div>
    </div>
  );
}
