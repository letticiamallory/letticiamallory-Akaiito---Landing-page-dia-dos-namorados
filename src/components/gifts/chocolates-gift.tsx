"use client";

import type { ChocolatesData } from "@/lib/gift-types";
import { ChocolateViewer } from "@/components/chocolate/ChocolateViewer";

export function ChocolatesGift({ data }: { data: ChocolatesData }) {
  if (!data.placements?.length) {
    return (
      <div className="min-h-screen bg-[#120a08] flex items-center justify-center px-6">
        <p className="text-[var(--text-muted)]">Caixa em preparação...</p>
      </div>
    );
  }

  return <ChocolateViewer data={data} />;
}
