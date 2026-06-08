"use client";

import { useMemo } from "react";
import type { PolaroidData } from "@/lib/gift-types";
import { ValentineCameraExperience } from "@/components/present/panda/ValentineCameraExperience";
import "@/components/present/panda/valentine-camera.css";
import "./polaroid.css";

export function PolaroidExperience({
  data,
  embedded = false,
}: {
  data: PolaroidData;
  embedded?: boolean;
}) {
  const photos = useMemo(() => {
    const raw = data.photos ?? [];
    const slots = [0, 1].map((i) => ({
      url: raw[i]?.url ?? "",
      label: raw[i]?.label || data.labelTexts?.[i] || "",
    }));

    if (!slots.some((p) => p.url || p.label) && data.message?.trim()) {
      slots[0].label = data.message;
    }

    if (!slots.some((p) => p.url || p.label)) {
      return [
        { url: "", label: "Com amor ♡" },
        { url: "", label: "" },
      ];
    }

    return slots;
  }, [data.photos, data.labelTexts, data.message]);

  return (
    <div className={`polaroid-stage${embedded ? " polaroid-stage--embedded" : ""}`}>
      <ValentineCameraExperience photos={photos} compact={embedded} />
    </div>
  );
}
