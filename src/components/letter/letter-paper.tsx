import { LETTER_PAPER } from "@/lib/letter-catalog";
import "./letter-paper.css";

type LetterPaperVariant = "beside" | "inside" | "preview";

export function LetterPaper({
  children,
  variant = "beside",
  className = "",
  style,
}: {
  children: React.ReactNode;
  variant?: LetterPaperVariant;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`letter-paper letter-paper--${variant} ${className}`.trim()}
      style={{ aspectRatio: `1 / ${LETTER_PAPER.aspect}`, ...style }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LETTER_PAPER.texture}
        alt=""
        className="letter-paper__texture"
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LETTER_PAPER.decoFlower}
        alt=""
        className="letter-paper__deco letter-paper__deco--flower"
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LETTER_PAPER.decoBotanical}
        alt=""
        className="letter-paper__deco letter-paper__deco--botanical"
        draggable={false}
      />
      <div className="letter-paper__body">{children}</div>
    </div>
  );
}
