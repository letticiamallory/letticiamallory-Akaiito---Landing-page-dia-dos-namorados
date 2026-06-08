"use client";

import { CollagePresentPage } from "./collage/CollagePresentPage";
import type { ScrapbookPresentData } from "@/lib/builder/types";

/** @deprecated Use CollagePresentPage — mantido para imports existentes */
export function ScrapbookPresentPage({
  data,
  preview = false,
}: {
  data: ScrapbookPresentData;
  preview?: boolean;
}) {
  return <CollagePresentPage data={data} preview={preview} />;
}

export { CollagePresentPage } from "./collage/CollagePresentPage";
