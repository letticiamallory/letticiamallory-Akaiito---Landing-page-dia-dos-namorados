"use client";

import type { HistoriaSlotModule } from "@/lib/gift-types";
import { SlotGift } from "@/components/gifts/slot-gift";

export function HistoriaSlotSection({
  module,
  senderName,
  receiverName,
}: {
  module: HistoriaSlotModule;
  senderName: string;
  receiverName: string;
}) {
  return (
    <div className="hp-slot-scene">
      <SlotGift
        embedded
        data={{
          senderName,
          receiverName,
          surprises: module.surprises,
        }}
      />
    </div>
  );
}
