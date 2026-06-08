"use client";

import type { HistoriaJoguinhoModule } from "@/lib/gift-types";
import { JoguinhoGift } from "@/components/gifts/joguinho-gift";

export function HistoriaJoguinhoSection({
  module,
  senderName,
  receiverName,
}: {
  module: HistoriaJoguinhoModule;
  senderName: string;
  receiverName: string;
}) {
  return (
    <div className="hp-joguinho-scene">
      <JoguinhoGift
        embedded
        data={{
          senderName,
          receiverName,
          senderPhoto: module.senderPhoto,
          receiverPhoto: module.receiverPhoto,
          loveMessage: module.loveMessage,
        }}
      />
    </div>
  );
}
