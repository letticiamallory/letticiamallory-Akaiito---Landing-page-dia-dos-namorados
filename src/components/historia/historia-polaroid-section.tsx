"use client";

import type { HistoriaPolaroidModule } from "@/lib/gift-types";
import { PolaroidExperience } from "@/components/polaroid/PolaroidExperience";

export function HistoriaPolaroidSection({
  module,
  senderName,
  receiverName,
}: {
  module: HistoriaPolaroidModule;
  senderName: string;
  receiverName: string;
}) {
  return (
    <div className="hp-polaroid-scene">
      <PolaroidExperience
        embedded
        data={{
          senderName,
          receiverName,
          message: module.message,
          photos: module.photos,
          labelTexts: module.labelTexts,
        }}
      />
    </div>
  );
}
