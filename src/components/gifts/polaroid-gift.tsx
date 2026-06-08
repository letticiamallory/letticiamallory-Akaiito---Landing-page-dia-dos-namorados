"use client";

import type { PolaroidData } from "@/lib/gift-types";
import { PolaroidExperience } from "@/components/polaroid/PolaroidExperience";

export function PolaroidGift({ data }: { data: PolaroidData }) {
  return <PolaroidExperience data={data} />;
}
