/** Decorações por seção — assets Canva em public/scrapbook/stickers/canva/ */

import type { CSSProperties } from "react";
import { SCRAPBOOK_CANVA_STICKERS } from "./scrapbook-assets";

export type ScrapbookSectionId =
  | "hero"
  | "counter"
  | "timeline"
  | "music"
  | "gallery"
  | "letter"
  | "carta"
  | "polaroid"
  | "joguinho"
  | "museu"
  | "chocolates"
  | "slot"
  | "stars"
  | "map"
  | "facts"
  | "footer";

export interface ScrapbookSticker {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
}

export const SCRAPBOOK_SPREAD_VARIANT: Record<
  ScrapbookSectionId,
  "cream" | "maroon"
> = {
  hero: "maroon",
  counter: "maroon",
  timeline: "cream",
  music: "maroon",
  gallery: "maroon",
  letter: "cream",
  carta: "cream",
  polaroid: "maroon",
  joguinho: "cream",
  museu: "maroon",
  chocolates: "cream",
  slot: "maroon",
  stars: "cream",
  map: "maroon",
  facts: "cream",
  footer: "maroon",
};

const S = SCRAPBOOK_CANVA_STICKERS;

export const SCRAPBOOK_STICKERS: Record<ScrapbookSectionId, ScrapbookSticker[]> = {
  hero: [
    {
      src: S.bannerWide,
      className: "sb-sticker sb-sticker--hero-flower",
      style: { top: "2%", right: "-2%", width: "min(15rem, 40vw)", transform: "rotate(2deg)" },
    },
    {
      src: S.ring,
      className: "sb-sticker",
      style: { bottom: "14%", left: "5%", width: "3.5rem", transform: "rotate(-15deg)" },
    },
    {
      src: S.tapeHeart,
      className: "sb-sticker",
      style: { top: "18%", left: "4%", width: "min(11rem, 30vw)", transform: "rotate(-5deg)" },
    },
    {
      src: S.swirl,
      className: "sb-sticker",
      style: { bottom: "8%", right: "8%", width: "2.75rem", transform: "rotate(8deg)", opacity: 0.9 },
    },
  ],
  counter: [
    {
      src: S.heartBadge,
      className: "sb-sticker",
      style: { top: "0.25rem", right: "0.75rem", width: "3.25rem", transform: "rotate(10deg)" },
    },
    {
      src: S.strip95,
      className: "sb-sticker",
      style: { top: "-0.25rem", left: "0.5rem", width: "min(7rem, 20vw)", transform: "rotate(-2deg)" },
    },
  ],
  timeline: [
    {
      src: S.tapeHeart,
      className: "sb-sticker",
      style: { top: "0", right: "0.5rem", width: "min(8rem, 22vw)", transform: "rotate(5deg)" },
    },
    {
      src: S.heartTiltedSquare,
      className: "sb-sticker",
      style: { bottom: "0.5rem", left: "0.25rem", width: "min(6rem, 16vw)", transform: "rotate(-8deg)" },
    },
  ],
  music: [
    {
      src: S.strip93,
      className: "sb-sticker sb-sticker--deco-bg",
      style: { top: "-0.5rem", left: "-0.5rem", width: "min(5rem, 14vw)", opacity: 0.8 },
    },
    {
      src: S.heartTilted,
      className: "sb-sticker",
      style: { bottom: "0.5rem", right: "0.5rem", width: "4rem", transform: "rotate(8deg)" },
    },
  ],
  gallery: [
    {
      src: S.strip94,
      className: "sb-sticker sb-sticker--deco-bg",
      style: { top: "3%", right: "1%", width: "min(4.5rem, 12vw)", transform: "rotate(5deg)", opacity: 0.85 },
    },
    {
      src: S.heartTiltedSquare,
      className: "sb-sticker",
      style: { bottom: "1.5rem", right: "4%", width: "min(5.5rem, 15vw)", transform: "rotate(12deg)" },
    },
    {
      src: S.stamp,
      className: "sb-sticker",
      style: { bottom: "1rem", left: "3%", width: "4rem", transform: "rotate(-10deg)" },
    },
    {
      src: S.swirl,
      className: "sb-sticker",
      style: { top: "1rem", left: "2%", width: "2.5rem", transform: "rotate(-6deg)" },
    },
  ],
  letter: [
    {
      src: S.stamp,
      className: "sb-sticker",
      style: { top: "0.5rem", right: "0.75rem", width: "4rem", transform: "rotate(8deg)", zIndex: 4 },
    },
    {
      src: S.tapeHeart,
      className: "sb-sticker",
      style: { top: "-0.75rem", left: "1rem", width: "min(9rem, 24vw)", transform: "rotate(-4deg)", zIndex: 4 },
    },
    {
      src: S.ring,
      className: "sb-sticker",
      style: { bottom: "0.75rem", right: "1.25rem", width: "2.75rem", transform: "rotate(12deg)", zIndex: 4 },
    },
  ],
  carta: [
    {
      src: S.heartBadge,
      className: "sb-sticker",
      style: { top: "0.5rem", right: "0.5rem", width: "3rem", transform: "rotate(6deg)" },
    },
    {
      src: S.tapeHeart,
      className: "sb-sticker",
      style: { top: "0", left: "0.5rem", width: "6rem", transform: "rotate(-4deg)" },
    },
  ],
  polaroid: [
    {
      src: S.strip95,
      className: "sb-sticker",
      style: { top: "0.25rem", left: "0.25rem", width: "min(7rem, 18vw)", transform: "rotate(-3deg)" },
    },
    {
      src: S.heartSquare,
      className: "sb-sticker",
      style: { top: "0.5rem", right: "0.5rem", width: "3rem" },
    },
  ],
  joguinho: [
    {
      src: S.heartBadge,
      className: "sb-sticker",
      style: { top: "0.5rem", right: "0.5rem", width: "3rem", transform: "rotate(10deg)" },
    },
  ],
  museu: [
    {
      src: S.stamp,
      className: "sb-sticker",
      style: { top: "0.5rem", left: "0.5rem", width: "3.5rem", transform: "rotate(-10deg)" },
    },
    {
      src: S.swirl,
      className: "sb-sticker",
      style: { top: "0.25rem", right: "0.75rem", width: "2.25rem", transform: "rotate(6deg)" },
    },
  ],
  chocolates: [
    {
      src: S.heartTilted,
      className: "sb-sticker",
      style: { bottom: "0.5rem", right: "0.5rem", width: "3.25rem", transform: "rotate(8deg)" },
    },
  ],
  slot: [
    {
      src: S.stamp,
      className: "sb-sticker",
      style: { top: "0.5rem", right: "0.5rem", width: "3.5rem" },
    },
    {
      src: S.heartBadge,
      className: "sb-sticker",
      style: { top: "0.5rem", left: "0.5rem", width: "2.5rem", transform: "rotate(-8deg)" },
    },
  ],
  stars: [
    {
      src: S.flowers,
      className: "sb-sticker",
      style: { top: "0", right: "0", width: "8rem", opacity: 0.85 },
    },
    {
      src: S.ring,
      className: "sb-sticker",
      style: { bottom: "0.5rem", left: "0.75rem", width: "2.5rem", transform: "rotate(-10deg)" },
    },
  ],
  map: [
    {
      src: S.tapeHeart,
      className: "sb-sticker",
      style: { top: "0.25rem", left: "0.25rem", width: "min(8rem, 22vw)", transform: "rotate(3deg)" },
    },
    {
      src: S.bannerWide,
      className: "sb-sticker sb-sticker--deco-bg",
      style: { bottom: "0", right: "0", width: "min(11rem, 30vw)", opacity: 0.7 },
    },
  ],
  facts: [
    {
      src: S.heartBadge,
      className: "sb-sticker",
      style: { top: "0.25rem", right: "0.25rem", width: "2.75rem", transform: "rotate(8deg)" },
    },
    {
      src: S.stamp,
      className: "sb-sticker",
      style: { top: "0.25rem", left: "0.25rem", width: "3rem", transform: "rotate(-12deg)" },
    },
    {
      src: S.swirl,
      className: "sb-sticker",
      style: { bottom: "0.5rem", right: "1rem", width: "2rem", transform: "rotate(4deg)", opacity: 0.85 },
    },
  ],
  footer: [
    {
      src: S.stamp,
      className: "sb-sticker",
      style: { bottom: "1rem", right: "1rem", width: "4rem", transform: "rotate(5deg)" },
    },
    {
      src: S.ring,
      className: "sb-sticker",
      style: { bottom: "1.25rem", left: "1rem", width: "2.25rem", transform: "rotate(-12deg)" },
    },
  ],
};
