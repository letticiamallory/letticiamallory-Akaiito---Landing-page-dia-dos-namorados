"use client";

import { useMemo } from "react";
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
  const viewerData = useMemo(
    () => ({
      senderName,
      receiverName,
      coupleName: module.coupleName,
      boxTitle: module.boxTitle,
      message: module.message,
      placements: module.placements,
    }),
    [
      senderName,
      receiverName,
      module.coupleName,
      module.boxTitle,
      module.message,
      module.placements,
    ]
  );

  return (
    <div className="hp-chocolates-scene">
      <ChocolateViewer embedded data={viewerData} />
    </div>
  );
}
