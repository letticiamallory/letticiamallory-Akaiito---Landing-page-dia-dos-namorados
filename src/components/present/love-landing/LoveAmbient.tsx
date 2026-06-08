"use client";

export function LoveAmbient() {
  const hearts = ["♥", "♡", "✦", "♥", "♡"];

  return (
    <div className="love-ambient" aria-hidden>
      <div className="love-ambient__gradient" />
      <div className="love-ambient__glow love-ambient__glow--1" />
      <div className="love-ambient__glow love-ambient__glow--2" />
      {hearts.map((h, i) => (
        <span
          key={i}
          className="love-ambient__heart"
          style={{
            left: `${12 + i * 18}%`,
            animationDelay: `${i * 1.4}s`,
            animationDuration: `${6 + i}s`,
          }}
        >
          {h}
        </span>
      ))}
    </div>
  );
}
