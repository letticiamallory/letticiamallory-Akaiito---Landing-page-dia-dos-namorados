"use client";

import type { HistoriaMuseuModule } from "@/lib/gift-types";
import { MuseumViewer } from "@/components/museum/MuseumViewer";

export function HistoriaMuseuSection({
  module,
  senderName,
  receiverName,
}: {
  module: HistoriaMuseuModule;
  senderName: string;
  receiverName: string;
}) {
  return (
    <div className="hp-museu-scene">
      <MuseumViewer
        embedded
        data={{
          senderName,
          receiverName,
          coupleName: module.coupleName,
          museumTitle: module.museumTitle,
          museumDate: module.museumDate,
          elements: module.elements,
        }}
      />
    </div>
  );
}
