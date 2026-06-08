/** Pool de adesivos "Scrapbook Diary Elements" — public/scrapbook/stickers/diary/ */

import type { CSSProperties } from "react";
import type { ScrapbookSectionId } from "./scrapbook-decor";
import type { ScrapbookSticker } from "./scrapbook-decor";

const D = (name: string) => `/scrapbook/stickers/diary/${name}`;

/** Todos os elementos do pack Diary (02–35 + faixa polaroid) */
export const DIARY_STICKER_FILES = {
  "02": D("diary-02.svg"),
  "03": D("diary-03.svg"),
  "04": D("diary-04.svg"),
  "05": D("diary-05.svg"),
  "06": D("diary-06.svg"),
  "07": D("diary-07.svg"),
  "08": D("diary-08.svg"),
  "09": D("diary-09.svg"),
  "10": D("diary-10.svg"),
  "11": D("diary-11.svg"),
  "12": D("diary-12.svg"),
  "13": D("diary-13.svg"),
  "14": D("diary-14.svg"),
  "15": D("diary-15.svg"),
  "16": D("diary-16.svg"),
  "17": D("diary-17.svg"),
  "18": D("diary-18.svg"),
  "19": D("diary-19.svg"),
  "20": D("diary-20.svg"),
  "21": D("diary-21.svg"),
  "22": D("diary-22.svg"),
  "23": D("diary-23.svg"),
  "24": D("diary-24.svg"),
  "25": D("diary-25.svg"),
  "26": D("diary-26.svg"),
  "27": D("diary-27.svg"),
  "28": D("diary-28.svg"),
  "29": D("diary-29.svg"),
  "30": D("diary-30.svg"),
  "31": D("diary-31.svg"),
  "32": D("diary-32.svg"),
  "33": D("diary-33.svg"),
  "34": D("diary-34.svg"),
  "35": D("diary-35.svg"),
  polaroidStrip: D("diary-polaroid-strip.svg"),
} as const;

type DiaryKey = keyof typeof DIARY_STICKER_FILES;

interface DiaryPlacement {
  key: DiaryKey;
  className?: string;
  style?: CSSProperties;
}

/** Posições típicas de colagem por seção */
const DIARY_SECTION_PLACEMENTS: Record<ScrapbookSectionId, DiaryPlacement[]> = {
  hero: [
    { key: "34", className: "sb-sticker--diary-bg", style: { top: "-2%", right: "-8%", width: "min(20rem, 50vw)", transform: "rotate(4deg)", opacity: 0.88 } },
    { key: "06", style: { top: "16%", left: "2%", width: "min(12rem, 32vw)", transform: "rotate(-6deg)" } },
    { key: "polaroidStrip", style: { bottom: "8%", right: "0", width: "min(14rem, 38vw)", transform: "rotate(2deg)", opacity: 0.92 } },
  ],
  counter: [
    { key: "09", style: { top: "0", right: "0", width: "min(7rem, 18vw)", transform: "rotate(8deg)" } },
    { key: "15", style: { bottom: "0.5rem", left: "0", width: "min(6rem, 16vw)", transform: "rotate(-10deg)" } },
  ],
  timeline: [
    { key: "12", style: { top: "0", right: "0", width: "min(10rem, 28vw)", transform: "rotate(3deg)" } },
    { key: "28", className: "sb-sticker--diary-bg", style: { bottom: "0", left: "-1rem", width: "min(4rem, 10vw)", opacity: 0.75 } },
  ],
  music: [
    { key: "10", style: { top: "-0.5rem", left: "-0.5rem", width: "min(11rem, 30vw)", transform: "rotate(-4deg)" } },
    { key: "30", className: "sb-sticker--diary-bg", style: { bottom: "0", right: "0", width: "min(12rem, 32vw)", opacity: 0.7 } },
  ],
  gallery: [
    { key: "17", className: "sb-sticker--diary-bg", style: { top: "0", right: "-1rem", width: "min(6rem, 15vw)", transform: "rotate(5deg)", opacity: 0.8 } },
    { key: "07", style: { bottom: "1rem", left: "0", width: "min(5.5rem, 14vw)", transform: "rotate(-8deg)" } },
    { key: "polaroidStrip", style: { top: "1rem", left: "1rem", width: "min(9rem, 24vw)", transform: "rotate(-3deg)", opacity: 0.85 } },
  ],
  letter: [
    { key: "05", style: { top: "0.5rem", left: "-0.5rem", width: "min(6.5rem, 17vw)", transform: "rotate(-5deg)", zIndex: 3 } },
    { key: "19", style: { bottom: "0.5rem", right: "0", width: "min(5rem, 13vw)", transform: "rotate(6deg)", zIndex: 3 } },
  ],
  carta: [
    { key: "14", style: { top: "0.5rem", right: "0.5rem", width: "min(6rem, 16vw)", transform: "rotate(5deg)" } },
    { key: "27", style: { bottom: "0.5rem", left: "0", width: "min(5rem, 13vw)", transform: "rotate(-6deg)" } },
  ],
  polaroid: [
    { key: "23", style: { top: "0.25rem", left: "0", width: "min(9rem, 24vw)", transform: "rotate(-4deg)" } },
    { key: "33", style: { top: "0.5rem", right: "0.5rem", width: "min(5.5rem, 14vw)", transform: "rotate(7deg)" } },
  ],
  joguinho: [
    { key: "16", style: { top: "0.5rem", right: "0.5rem", width: "min(5.5rem, 14vw)", transform: "rotate(8deg)" } },
  ],
  museu: [
    { key: "24", style: { top: "0", left: "0", width: "min(8rem, 22vw)", transform: "rotate(-3deg)" } },
    { key: "13", style: { bottom: "0.5rem", right: "0", width: "min(10rem, 26vw)", transform: "rotate(4deg)", opacity: 0.85 } },
  ],
  chocolates: [
    { key: "20", style: { bottom: "0.5rem", right: "0.5rem", width: "min(5.5rem, 14vw)", transform: "rotate(6deg)" } },
  ],
  slot: [
    { key: "21", style: { top: "0.5rem", left: "0.5rem", width: "min(5rem, 13vw)", transform: "rotate(-5deg)" } },
    { key: "18", style: { top: "0.5rem", right: "0", width: "min(9rem, 24vw)", transform: "rotate(3deg)", opacity: 0.9 } },
  ],
  stars: [
    { key: "29", className: "sb-sticker--diary-bg", style: { top: "-1rem", right: "-0.5rem", width: "min(7rem, 18vw)", opacity: 0.75 } },
    { key: "08", style: { bottom: "0.5rem", left: "0", width: "min(5.5rem, 14vw)", transform: "rotate(-7deg)" } },
  ],
  map: [
    { key: "22", className: "sb-sticker--diary-bg", style: { top: "0", left: "-1rem", width: "min(14rem, 38vw)", opacity: 0.65 } },
    { key: "31", style: { bottom: "0.5rem", right: "0", width: "min(11rem, 30vw)", transform: "rotate(2deg)", opacity: 0.85 } },
  ],
  facts: [
    { key: "25", style: { top: "0", right: "0", width: "min(6rem, 16vw)", transform: "rotate(5deg)" } },
    { key: "26", style: { bottom: "0.25rem", left: "0", width: "min(5.5rem, 14vw)", transform: "rotate(-8deg)" } },
  ],
  footer: [
    { key: "11", style: { bottom: "0.5rem", left: "0", width: "min(8rem, 22vw)", transform: "rotate(-3deg)", opacity: 0.8 } },
    { key: "32", className: "sb-sticker--diary-bg", style: { bottom: "0", right: "-0.5rem", width: "min(4.5rem, 12vw)", opacity: 0.7 } },
  ],
};

export function getDiaryStickers(section: ScrapbookSectionId): ScrapbookSticker[] {
  const placements = DIARY_SECTION_PLACEMENTS[section] ?? [];
  return placements.map((p, i) => ({
    src: DIARY_STICKER_FILES[p.key],
    className: ["sb-sticker", "sb-sticker--diary", p.className].filter(Boolean).join(" "),
    style: p.style,
  }));
}

/** Mescla adesivos Canva fixos + elementos Diary por seção */
export function mergeScrapbookStickers(
  base: ScrapbookSticker[],
  section: ScrapbookSectionId
): ScrapbookSticker[] {
  return [...base, ...getDiaryStickers(section)];
}
