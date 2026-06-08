"use client";

import type { CSSProperties, ReactNode } from "react";
import "./mockup-preview.css";

const PHONE_SIZES = {
  md: { screenW: 270, screenH: 540, contentW: 393, contentH: 852 },
  sm: { screenW: 195, screenH: 390, contentW: 393, contentH: 852 },
} as const;

export function PhoneMockup({
  children,
  priority = false,
  size = "md",
}: {
  children: ReactNode;
  /** @deprecated Escala calculada internamente (270 / 393) */
  scale?: number;
  priority?: boolean;
  size?: keyof typeof PHONE_SIZES;
}) {
  const dims = PHONE_SIZES[size];
  const contentScale = dims.screenW / dims.contentW;

  const screenStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    width: dims.screenW,
    height: dims.screenH,
    aspectRatio: "auto",
  };

  const contentStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: dims.contentW,
    height: dims.contentH,
    transform: `scale(${contentScale})`,
    transformOrigin: "top left",
  };

  return (
    <div className={`feature-phone mx-auto w-fit${size === "sm" ? " feature-phone--sm" : ""}`}>
      <div className="feature-phone__bezel">
        <div className="feature-phone__notch" aria-hidden />
        <div className="feature-phone__screen feature-phone__screen--live" style={screenStyle}>
          <div style={contentStyle} data-priority={priority ? "true" : undefined}>
            {children}
          </div>
        </div>
        <div className="feature-phone__bar" aria-hidden />
      </div>
      <div className="feature-phone__glow" aria-hidden />
    </div>
  );
}

export function MockupPlaceholder() {
  return (
    <PhoneMockup>
      <div className="mockup-shell" aria-hidden />
    </PhoneMockup>
  );
}
