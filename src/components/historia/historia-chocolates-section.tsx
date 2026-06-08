"use client";

import type { HistoriaChocolatesModule } from "@/lib/gift-types";
import { ChocolateViewer } from "@/components/chocolate/ChocolateViewer";

export function HistoriaChocolatesSection({
  module,
  senderName,
  receiverName,
}: {
  module: HistoriaChocolatesModule;
  senderName: string;
  receiverName: string;
}) {
  return (
    <div className="hp-chocolates-scene">
      <ChocolateViewer
        embedded
        data={{
          senderName,
          receiverName,
          coupleName: module.coupleName,
          boxTitle: module.boxTitle,
          message: module.message,
          placements: module.placements,
        }}
      />
    </div>
  );
}
