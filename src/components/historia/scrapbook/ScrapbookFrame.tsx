"use client";

import type { CSSProperties } from "react";
import {
  GALLERY_FRAME_CYCLE,
  GALLERY_ROTATIONS,
  SCRAPBOOK_FRAMES,
  type ScrapbookFrameVariant,
} from "@/lib/scrapbook-assets";

export function ScrapbookPhotoFrame({
  variant,
  src,
  alt = "",
  caption,
  rotation,
  onClick,
  className = "",
}: {
  variant: ScrapbookFrameVariant;
  src: string;
  alt?: string;
  caption?: string;
  rotation?: number;
  onClick?: () => void;
  className?: string;
}) {
  const frame = SCRAPBOOK_FRAMES[variant];
  const rot = rotation ?? 0;
  const interactive = Boolean(onClick);
  const showTape =
    variant === "polaroid" &&
    "tapeTop" in frame &&
    frame.tapeTop;

  return (
    <figure
      className={`sb-photo-frame sb-photo-frame--${variant} ${className}`.trim()}
      style={{ "--sb-rot": `${rot}deg` } as CSSProperties}
    >
      <div
        className={`sb-photo-frame__shell${interactive ? " sb-photo-frame__shell--clickable" : ""}`}
        style={{ aspectRatio: frame.aspect }}
        onClick={onClick}
        onKeyDown={
          interactive
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick?.();
                }
              }
            : undefined
        }
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="sb-photo-frame__photo"
          style={frame.photo}
          loading="lazy"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={frame.src}
          alt=""
          className="sb-photo-frame__overlay"
          aria-hidden
          draggable={false}
        />
        {showTape ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={frame.tapeTop}
            alt=""
            className="sb-photo-frame__tape-top"
            aria-hidden
            draggable={false}
          />
        ) : null}
      </div>
      {caption ? (
        <figcaption className="sb-photo-frame__caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export function ScrapbookTextPaper({
  children,
  variant = "scalloped",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "scalloped" | "textured";
  className?: string;
}) {
  const bg =
    variant === "textured"
      ? SCRAPBOOK_FRAMES.paperTextured.src
      : SCRAPBOOK_FRAMES.textScalloped.src;

  return (
    <div
      className={`sb-text-paper sb-text-paper--${variant} ${className}`.trim()}
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="sb-text-paper__content">{children}</div>
    </div>
  );
}

export function galleryFrameVariant(index: number): ScrapbookFrameVariant {
  return GALLERY_FRAME_CYCLE[index % GALLERY_FRAME_CYCLE.length];
}

export function galleryRotation(index: number): number {
  return GALLERY_ROTATIONS[index % GALLERY_ROTATIONS.length];
}
