"use client";

import type { PandaCardDef } from "@/lib/panda-present";

export function PandaCard({
  def,
  children,
  noPadding = false,
}: {
  def: PandaCardDef;
  children: React.ReactNode;
  noPadding?: boolean;
}) {
  const isProject = def.kind === "project";
  const isHero = def.variant === "hero";
  const isMuseum = def.id === "project_museum";
  const isLetter = def.id === "letter";

  return (
    <article
      id={`card-${def.id}`}
      className={[
        "panda-card",
        "panda-card--visible",
        `panda-card--${def.variant}`,
        isProject ? "panda-card--project" : "",
        isMuseum ? "panda-card--museum" : "",
        isLetter ? "panda-card--letter" : "",
        isHero ? "panda-card--full" : "",
        noPadding ? "panda-card--flush" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="panda-card__body">{children}</div>
    </article>
  );
}
