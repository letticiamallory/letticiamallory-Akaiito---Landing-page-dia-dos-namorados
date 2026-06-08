"use client";

import { useCallback, useState } from "react";

export type PolaroidScreen =
  | "loading"
  | "splash"
  | "character"
  | "camera"
  | "flash"
  | "polaroids"
  | "gift"
  | "share";

const ORDER: PolaroidScreen[] = [
  "loading",
  "splash",
  "character",
  "camera",
  "flash",
  "polaroids",
  "gift",
  "share",
];

export function useScreenSequence(initial: PolaroidScreen = "loading") {
  const [screen, setScreen] = useState<PolaroidScreen>(initial);

  const goTo = useCallback((next: PolaroidScreen) => setScreen(next), []);

  const next = useCallback(() => {
    const idx = ORDER.indexOf(screen);
    if (idx >= 0 && idx < ORDER.length - 1) {
      setScreen(ORDER[idx + 1]);
    }
  }, [screen]);

  return { screen, goTo, next, setScreen };
}

export function vibrate(ms = 12) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(ms);
  }
}
