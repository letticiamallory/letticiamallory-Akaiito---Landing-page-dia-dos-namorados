import type { CSSProperties } from "react";
import type { LetterConfig } from "@/lib/letter-catalog";
import { ENVELOPE_STYLES, SEAL_OVERLAY } from "@/lib/letter-catalog";
import { EnvelopeImage } from "./envelope-image";
import { WaxSealImage } from "./wax-seal-image";
import { LetterPaper } from "./letter-paper";

export type LetterPreviewMode = "envelope" | "envelope-with-seal" | "letter";

function SealOverlay({ waxId, fitWidth }: { waxId: LetterConfig["waxId"]; fitWidth: number }) {
  const sealSize = fitWidth * SEAL_OVERLAY.sizeRatio;
  return (
    <div
      className="absolute pointer-events-none z-[1]"
      style={{
        left: SEAL_OVERLAY.left,
        top: SEAL_OVERLAY.top,
        transform: "translate(-50%, -50%)",
      }}
    >
      <WaxSealImage sealId={waxId} fitWidth={sealSize} />
    </div>
  );
}

function LetterPaperPreview({ message, fitWidth }: { message: string; fitWidth: number }) {
  const preview = message.trim() || "Querida Ana, hoje eu quero te dizer...";

  return (
    <LetterPaper variant="preview" className="mx-auto" style={{ width: fitWidth * 0.85 } satisfies CSSProperties}>
      <p className="letter-line letter-line--message line-clamp-6 whitespace-pre-wrap">{preview}</p>
    </LetterPaper>
  );
}

export function LetterPreview({
  config,
  mode = "envelope",
  message = "",
  className = "",
  fitWidth = 260,
}: {
  config: LetterConfig;
  mode?: LetterPreviewMode;
  message?: string;
  className?: string;
  fitWidth?: number;
}) {
  if (mode === "letter") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <LetterPaperPreview message={message} fitWidth={fitWidth} />
      </div>
    );
  }

  const envelope = ENVELOPE_STYLES[config.envelopeId];
  const width = Math.round(fitWidth);
  const height = Math.round(width / envelope.closedAspect);

  return (
    <div
      className={`relative mx-auto overflow-hidden leading-none ${className}`}
      style={{ width, height }}
    >
      <EnvelopeImage envelopeId={config.envelopeId} fitWidth={width} className="h-full w-full" />
      {mode === "envelope-with-seal" && <SealOverlay waxId={config.waxId} fitWidth={width} />}
    </div>
  );
}

export function EnvelopeThumb({
  envelopeId,
  fitWidth = 80,
}: {
  envelopeId: LetterConfig["envelopeId"];
  fitWidth?: number;
}) {
  return <EnvelopeImage envelopeId={envelopeId} fitWidth={fitWidth} />;
}
