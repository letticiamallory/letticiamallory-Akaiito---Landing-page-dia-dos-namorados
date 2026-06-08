"use client";

import type { PolaroidCameraData } from "@/lib/builder/types";
import { ValentineCameraExperience } from "@/components/present/panda/ValentineCameraExperience";
import "./valentine-camera.css";

export function PandaHeroCard({ polaroid }: { polaroid?: PolaroidCameraData }) {
  const raw = polaroid?.photos ?? [];
  const photos = [0, 1].map((i) => ({
    url: raw[i]?.url ?? "",
    label: raw[i]?.label || polaroid?.labelTexts?.[i] || "",
  }));

  const hasAnyContent =
    photos.some((p) => p.url || p.label) || Boolean(polaroid?.message?.trim());

  if (!photos[0].url && !photos[0].label && polaroid?.message?.trim()) {
    photos[0].label = polaroid.message;
  }

  return (
    <div className="panda-hero">
      <div className="panda-hero__glass">
        <div className="panda-hero__camera">
          <ValentineCameraExperience
            compact
            photos={
              hasAnyContent
                ? photos
                : [
                    { url: "", label: "Com amor ♡" },
                    { url: "", label: "" },
                  ]
            }
          />
        </div>
      </div>
    </div>
  );
}
