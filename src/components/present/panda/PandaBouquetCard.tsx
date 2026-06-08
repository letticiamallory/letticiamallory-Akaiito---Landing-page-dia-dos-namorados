"use client";

import type { HeroCoupleData } from "@/lib/builder/types";
import { BouquetPreview } from "@/components/bouquet/bouquet-preview";
import { DEFAULT_BOUQUET, resolveBouquetConfig } from "@/lib/bouquet-catalog";

export function PandaBouquetCard({
  hero,
  senderName,
}: {
  hero?: HeroCoupleData;
  senderName: string;
}) {
  const bouquet = resolveBouquetConfig(hero?.bouquet ?? DEFAULT_BOUQUET);
  const who = senderName?.trim() || hero?.person1Name?.trim() || "Alguém especial";

  return (
    <div className="panda-bouquet">
      <p className="panda-bouquet__message">
        {who} escolheu as flores e o arranjo especialmente pra você.
      </p>
      <div className="panda-bouquet__visual">
        <BouquetPreview config={bouquet} showLabel={false} />
        <span className="panda-bouquet__glow" aria-hidden />
      </div>
    </div>
  );
}
