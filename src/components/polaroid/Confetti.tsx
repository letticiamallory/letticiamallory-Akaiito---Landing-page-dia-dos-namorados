"use client";

import { useMemo } from "react";

const COLORS = ["#C52929", "#FACAC9", "#F29F9F", "#FFE3E3", "#11414B"];

export function Confetti({ active }: { active: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.8}s`,
        duration: `${1.8 + Math.random() * 1.2}s`,
        color: COLORS[i % COLORS.length],
      })),
    []
  );

  if (!active) return null;

  return (
    <div className="polaroid-confetti" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="polaroid-confetti-piece"
          style={{
            left: p.left,
            background: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
