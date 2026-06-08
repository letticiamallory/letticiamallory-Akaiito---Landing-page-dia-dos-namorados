"use client";

import { useEffect, useRef, useState } from "react";
import type { LoveScreenDef, LoveScreenId } from "@/lib/love-present";

const EMBEDDED_IDS: LoveScreenId[] = ["museum", "polaroid", "chocolate"];

export function LoveScreen({
  def,
  children,
  isFirst = false,
}: {
  def: LoveScreenDef;
  children: React.ReactNode;
  isFirst?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(isFirst);
  const isEmbedded = EMBEDDED_IDS.includes(def.id);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={`screen-${def.id}`}
      className={`love-screen${visible ? " love-screen--visible" : ""}${isFirst ? " love-screen--welcome" : ""}${isEmbedded ? " love-screen--embedded" : ""}`.trim()}
      aria-labelledby={isFirst ? undefined : `screen-title-${def.id}`}
    >
      {!isFirst && (
        <header className="love-screen__header">
          <span className="love-screen__icon" aria-hidden>
            {def.icon}
          </span>
          <div>
            <h2 className="love-screen__title" id={`screen-title-${def.id}`}>
              {def.title}
            </h2>
            <p className="love-screen__subtitle">{def.subtitle}</p>
          </div>
        </header>
      )}
      <div className="love-screen__content">{children}</div>
    </section>
  );
}
