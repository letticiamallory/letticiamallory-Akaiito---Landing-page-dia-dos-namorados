"use client";

import type { ScrapbookPresentData } from "@/lib/builder/types";
import { ScrapbookPresentPage } from "@/components/present/ScrapbookPresentPage";

export function ScrapbookPresentGift({
  data,
}: {
  data: ScrapbookPresentData;
  slug?: string;
}) {
  return <ScrapbookPresentPage data={data} />;
}
