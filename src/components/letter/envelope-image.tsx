import type { EnvelopeStyleId } from "@/lib/letter-catalog";
import { ENVELOPE_STYLES } from "@/lib/letter-catalog";

export function EnvelopeImage({
  envelopeId,
  variant = "closed",
  fitWidth = 260,
  className = "",
}: {
  envelopeId: EnvelopeStyleId;
  variant?: "closed" | "open";
  fitWidth?: number;
  className?: string;
}) {
  const envelope = ENVELOPE_STYLES[envelopeId];
  const aspect = variant === "open" ? envelope.openAspect : envelope.closedAspect;
  const width = Math.round(fitWidth);
  const height = Math.round(width / aspect);
  const src = variant === "open" ? envelope.openSrc : envelope.closedSrc;

  return (
    <div
      className={`overflow-hidden leading-none ${className}`}
      style={{ width, height }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={envelope.name}
        width={width}
        height={height}
        className="block h-full w-full"
        style={{ objectFit: "fill" }}
        draggable={false}
      />
    </div>
  );
}
