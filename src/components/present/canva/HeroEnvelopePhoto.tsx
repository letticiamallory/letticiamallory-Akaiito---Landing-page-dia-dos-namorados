"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_HERO_PHOTO } from "@/lib/hero-photo";

export function HeroEnvelopePhoto({
  candidate,
  alt,
  onResolved,
}: {
  candidate?: string;
  alt: string;
  onResolved?: (url: string) => void;
}) {
  const [src, setSrc] = useState(DEFAULT_HERO_PHOTO);
  const onResolvedRef = useRef(onResolved);
  onResolvedRef.current = onResolved;

  useEffect(() => {
    const url = candidate?.trim() || DEFAULT_HERO_PHOTO;
    if (url === DEFAULT_HERO_PHOTO) {
      setSrc(DEFAULT_HERO_PHOTO);
      onResolvedRef.current?.(DEFAULT_HERO_PHOTO);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setSrc(url);
      onResolvedRef.current?.(url);
    };
    img.onerror = () => {
      setSrc(DEFAULT_HERO_PHOTO);
      onResolvedRef.current?.(DEFAULT_HERO_PHOTO);
    };
    img.src = url;
  }, [candidate]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="canva-hero__photo"
      src={src}
      alt={alt}
      onError={() => {
        if (src !== DEFAULT_HERO_PHOTO) {
          setSrc(DEFAULT_HERO_PHOTO);
          onResolvedRef.current?.(DEFAULT_HERO_PHOTO);
        }
      }}
    />
  );
}
