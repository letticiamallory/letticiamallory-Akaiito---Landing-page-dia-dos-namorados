"use client";

import { useEffect } from "react";
import type { ScrapbookPresentData } from "@/lib/builder/types";
import { startPresentPreloadForGift } from "@/lib/present-preload";

export function PresentCheckoutPreloader({
  giftId,
  presentData,
}: {
  giftId: string;
  presentData?: ScrapbookPresentData | null;
}) {
  useEffect(() => {
    startPresentPreloadForGift(giftId, presentData);
  }, [giftId, presentData]);

  return null;
}
