"use client";

import {
  CHOCOLATE_ASSETS,
  getBiteStage,
  isBiteImage,
  type ChocolateType,
} from "@/data/chocolate-catalog";

export function ChocolateSprite({
  type,
  biteStage = 0,
  className,
}: {
  type: ChocolateType;
  biteStage?: number;
  className?: string;
}) {
  if (biteStage === 0) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={type.file}
        alt=""
        className={className}
        draggable={false}
      />
    );
  }

  const stage = getBiteStage(type, biteStage);

  if (isBiteImage(stage)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={stage}
        alt=""
        className={className}
        draggable={false}
      />
    );
  }

  const [x, y, w, h] = stage;

  return (
    <svg
      viewBox={`${x} ${y} ${w} ${h}`}
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <image
        href={CHOCOLATE_ASSETS.components}
        x={-x}
        y={-y}
        width={CHOCOLATE_ASSETS.sheetW}
        height={CHOCOLATE_ASSETS.sheetH}
      />
    </svg>
  );
}
