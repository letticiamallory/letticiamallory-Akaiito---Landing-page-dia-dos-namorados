"use client";

import { useEffect, useState } from "react";
import type { PandaCardBlock, PandaCardId } from "@/lib/panda-present";

export function PandaNav({ cards }: { cards: PandaCardBlock[] }) {
  const [active, setActive] = useState<PandaCardId>(cards[0]?.def.id ?? "hero");

  useEffect(() => {
    const ids = cards.map((c) => c.def.id);
    const elements = ids
      .map((id) => document.getElementById(`card-${id}`))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          const id = visible[0].target.id.replace("card-", "") as PandaCardId;
          setActive(id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.2, 0.45] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [cards]);

  if (cards.length <= 2) return null;

  return (
    <nav className="panda-nav" aria-label="Navegação">
      {cards.map((card) => (
        <a
          key={card.def.id}
          href={`#card-${card.def.id}`}
          className={`panda-nav__item${active === card.def.id ? " panda-nav__item--active" : ""}`}
          title={card.def.title}
          aria-label={card.def.title}
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById(`card-${card.def.id}`)
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <span className="panda-nav__icon">{card.def.icon ?? "♡"}</span>
        </a>
      ))}
    </nav>
  );
}
