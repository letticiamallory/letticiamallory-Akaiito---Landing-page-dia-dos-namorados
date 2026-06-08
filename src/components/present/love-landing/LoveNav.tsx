"use client";

import { useEffect, useState } from "react";
import type { LoveScreenBlock, LoveScreenId } from "@/lib/love-present";

export function LoveNav({ screens }: { screens: LoveScreenBlock[] }) {
  const [active, setActive] = useState<LoveScreenId>(screens[0]?.def.id ?? "welcome");

  useEffect(() => {
    const ids = screens.map((s) => s.def.id);
    const elements = ids
      .map((id) => document.getElementById(`screen-${id}`))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          const id = visible[0].target.id.replace("screen-", "") as LoveScreenId;
          setActive(id);
        }
      },
      { rootMargin: "-25% 0px -50% 0px", threshold: [0, 0.25, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [screens]);

  if (screens.length <= 2) return null;

  return (
    <nav className="love-nav" aria-label="Navegação da página">
      {screens.map((screen) => (
        <a
          key={screen.def.id}
          href={`#screen-${screen.def.id}`}
          className={`love-nav__item${active === screen.def.id ? " love-nav__item--active" : ""}`}
          title={screen.def.title}
          aria-label={screen.def.title}
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById(`screen-${screen.def.id}`)
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <span className="love-nav__icon">{screen.def.icon}</span>
        </a>
      ))}
    </nav>
  );
}
