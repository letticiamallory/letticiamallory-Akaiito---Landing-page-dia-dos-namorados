"use client";

import type { ScrapbookSectionId } from "@/lib/scrapbook-decor";
import {
  SCRAPBOOK_SPREAD_VARIANT,
  SCRAPBOOK_STICKERS,
} from "@/lib/scrapbook-decor";
import { mergeScrapbookStickers } from "@/lib/scrapbook-diary-pool";

export function ScrapbookDecor({ section }: { section: ScrapbookSectionId }) {
  const stickers = mergeScrapbookStickers(
    SCRAPBOOK_STICKERS[section],
    section
  );
  if (!stickers.length) return null;

  return (
    <div className="sb-decor" aria-hidden>
      {stickers.map((s, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${section}-${i}`}
          src={s.src}
          alt=""
          className={`sb-sticker ${s.className ?? ""}`}
          style={s.style}
          draggable={false}
        />
      ))}
    </div>
  );
}

export function ScrapbookSpread({
  section,
  variant = "auto",
  children,
  className = "",
}: {
  section: ScrapbookSectionId;
  variant?: "cream" | "maroon" | "auto";
  children: React.ReactNode;
  className?: string;
}) {
  const resolved =
    variant === "auto" ? SCRAPBOOK_SPREAD_VARIANT[section] : variant;
  const variantClass =
    resolved === "cream" ? "hp-spread--cream" : "hp-spread--maroon";

  return (
    <div className={`hp-spread ${variantClass} ${className}`.trim()}>
      <ScrapbookDecor section={section} />
      <div className="hp-spread-inner">{children}</div>
    </div>
  );
}
