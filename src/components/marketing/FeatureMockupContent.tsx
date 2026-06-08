"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { PhoneMockup, MockupPlaceholder } from "./PhoneMockup";

const previewLoaders: Record<
  string,
  () => Promise<{ default: ComponentType<{ active: boolean }> }>
> = {
  music: () =>
    import("./previews/MusicMockupPreview").then((m) => ({
      default: m.MusicMockupPreview,
    })),
  hero: () =>
    import("./previews/CameraMockupPreview").then((m) => ({
      default: m.CameraMockupPreview,
    })),
  about_couple: () =>
    import("./previews/AboutMockupPreview").then((m) => ({
      default: m.AboutMockupPreview,
    })),
  memories: () =>
    import("./previews/MemoriesMockupPreview").then((m) => ({
      default: m.MemoriesMockupPreview,
    })),
  letter: () =>
    import("./previews/LetterMockupPreview").then((m) => ({
      default: m.LetterMockupPreview,
    })),
  museum: () =>
    import("./previews/MuseumPreview").then((m) => ({
      default: m.MuseumPreview,
    })),
  chocolate: () =>
    import("./previews/ChocolateBoxPreview").then((m) => ({
      default: m.ChocolateBoxPreview,
    })),
  bouquet: () =>
    import("./previews/BouquetMockupPreview").then((m) => ({
      default: m.BouquetMockupPreview,
    })),
  forever: () =>
    import("./previews/FarewellMockupPreview").then((m) => ({
      default: m.FarewellMockupPreview,
    })),
};

const lazyPreviews = Object.fromEntries(
  Object.entries(previewLoaders).map(([id, loader]) => [
    id,
    dynamic(loader, { loading: () => <MockupPlaceholder /> }),
  ])
) as Record<string, ComponentType<{ active: boolean }>>;

export function FeatureMockupContent({
  featureId,
  active,
  priority = false,
}: {
  featureId: string;
  active: boolean;
  priority?: boolean;
}) {
  const Preview = lazyPreviews[featureId];
  if (!Preview) return null;

  return (
    <PhoneMockup priority={priority}>
      <Preview active={active} />
    </PhoneMockup>
  );
}

export const FEATURE_MOCKUP_IDS = new Set(Object.keys(previewLoaders));
