"use client";

import { ValentineCameraExperience } from "@/components/present/panda/ValentineCameraExperience";
import { MockupShell } from "../MockupShell";

export function CameraSequenceAuto({
  active,
  shots = [
    { label: "para sempre ♡" },
    { label: "te amo muito" },
  ],
}: {
  active: boolean;
  shots?: { label?: string }[];
}) {
  const photos = shots.map((s) => ({ url: "", label: s.label }));

  return (
    <MockupShell center className="mockup-camera">
      <ValentineCameraExperience compact autoPlay={active} photos={photos} />
    </MockupShell>
  );
}

export function CameraMockupPreview({ active }: { active: boolean }) {
  return (
    <CameraSequenceAuto active={active} />
  );
}
