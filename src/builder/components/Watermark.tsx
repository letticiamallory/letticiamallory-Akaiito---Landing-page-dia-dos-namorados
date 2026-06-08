"use client";

const LABEL = "PREVIEW • akaiito.com.br";
const TILE_COUNT = 280;
const CARD_TILE_COUNT = 96;

type WatermarkProps = {
  variant?: "default" | "panda";
};

export function Watermark({ variant = "default" }: WatermarkProps) {
  const rootClass =
    variant === "panda" ? "builder-watermark builder-watermark--panda" : "builder-watermark";

  return (
    <div className={rootClass} aria-hidden>
      <div className="builder-watermark__grid">
        {Array.from({ length: TILE_COUNT }).map((_, i) => (
          <span key={i} className="builder-watermark__tile">
            {LABEL}
          </span>
        ))}
      </div>

      <div className="builder-watermark__cards">
        <div className="builder-watermark__cards-grid">
          {Array.from({ length: CARD_TILE_COUNT }).map((_, i) => (
            <span key={i} className="builder-watermark__tile builder-watermark__tile--card">
              {LABEL}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
