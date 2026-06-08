"use client";

import { useEffect } from "react";
import type { ScrapbookPresentData } from "@/lib/builder/types";
import { CAMERA_GIFT_ARROW, CAMERA_READY } from "@/lib/camera-assets";
import { preloadPresentAssets } from "@/lib/present-preload";

export function PresentAssetPreloader({ data }: { data: ScrapbookPresentData }) {
  useEffect(() => {
    preloadPresentAssets(data);
  }, [data]);

  return (
    <>
      <link rel="preload" href={CAMERA_READY} as="image" fetchPriority="high" />
      <link rel="preload" href={CAMERA_GIFT_ARROW} as="image" fetchPriority="high" />
    </>
  );
}
