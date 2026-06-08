"use client";

import { CollageButterfly, CollageHeart } from "./CollageIcons";

export function CollageGlobalDecor() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/scrapbook/stickers/flower.svg" alt="" className="collage-decor-flower" />
      <CollageButterfly className="collage-decor-butterfly" />
      <CollageHeart className="collage-decor-heart collage-decor-heart--1" />
      <CollageHeart className="collage-decor-heart collage-decor-heart--2" />
      <CollageHeart className="collage-decor-heart collage-decor-heart--3" />
    </>
  );
}
