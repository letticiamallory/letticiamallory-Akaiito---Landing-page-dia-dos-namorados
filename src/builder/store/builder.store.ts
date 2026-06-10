"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createBuilderPersistStorage } from "@/lib/builder-persist-storage";
import { nanoid } from "nanoid";
import type {
  BuilderSection,
  CustomMessageData,
  HeroCoupleData,
  LoveLetterData,
  MuseumOfUsData,
  SectionData,
  SectionId,
} from "@/lib/builder/types";
import type { BouquetConfig } from "@/lib/bouquet-catalog";
import { DEFAULT_BOUQUET } from "@/lib/bouquet-catalog";
import { DEFAULT_LETTER } from "@/lib/letter-catalog";
import { clampCustomMessageBody, clampCustomMessageCta } from "@/lib/custom-message";
import {
  HERO_PHOTO_STORAGE_FIX,
  normalizeHeroPhotoForStore,
  resolveHeroPhoto,
} from "@/lib/hero-photo";
import {
  createSection,
  initialSections,
  sortSections,
  updateSectionData,
  validateSection,
} from "@/lib/builder/utils";
import { FIRST_SECTION, LAST_SECTION, LOCKED_SECTIONS, MIN_SECTIONS } from "@/lib/builder/sections.catalog";

export type BuilderStep = "choose" | "customize" | "preview";

interface BuilderStore {
  pageConfig: {
    coupleNames: string;
    theme: "scrapbook_red";
  };
  sections: BuilderSection[];
  builderStep: BuilderStep;
  currentSectionIndex: number;
  buyerEmail: string;

  toggleSection: (sectionId: SectionId) => void;
  togglePresentCard: (sectionIds: SectionId[], locked?: boolean) => void;
  reorderSections: (from: number, to: number) => void;
  updateSectionData: (id: string, data: Partial<SectionData>) => void;
  setStep: (step: BuilderStep) => void;
  setCurrentSectionIndex: (index: number) => void;
  setBuyerEmail: (email: string) => void;
  nextSection: () => number;
  prevSection: () => number;
  getSectionProgress: () => { done: number; total: number };
  reset: () => void;
}

function migrateSections(sections: BuilderSection[]): BuilderSection[] {
  let next = sections.filter((s) => s.sectionId !== "our_map");

  if (!next.some((s) => s.sectionId === "hero_couple")) {
    const museum = next.find((s) => s.sectionId === "museum_of_us");
    const md = museum?.data as MuseumOfUsData | undefined;
    const hero = createSection("hero_couple", 0);
    const heroData = hero.data as HeroCoupleData;
    hero.data = {
      ...heroData,
      person1Name: md?.person1Name?.trim() || heroData.person1Name,
      person2Name: md?.person2Name?.trim() || heroData.person2Name,
    };
    next = [hero, ...next];
  }

  if (!next.some((s) => s.sectionId === "counter_together")) {
    const heroIdx = next.findIndex((s) => s.sectionId === "hero_couple");
    const counter = createSection("counter_together", heroIdx >= 0 ? heroIdx + 1 : 1);
    if (heroIdx >= 0) {
      next.splice(heroIdx + 1, 0, counter);
    } else {
      next.push(counter);
    }
  }

  if (!next.some((s) => s.sectionId === "favorite_song")) {
    next.unshift(createSection("favorite_song", 0));
  }

  if (!next.some((s) => s.sectionId === "polaroid_camera")) {
    const musicIdx = next.findIndex((s) => s.sectionId === "favorite_song");
    const polaroid = createSection("polaroid_camera", musicIdx >= 0 ? musicIdx + 1 : 1);
    if (musicIdx >= 0) {
      next.splice(musicIdx + 1, 0, polaroid);
    } else {
      next.unshift(polaroid);
    }
  }

  if (!next.some((s) => s.sectionId === "custom_message")) {
    next.push(createSection("custom_message", next.length));
  }

  const letterSection = next.find((s) => s.sectionId === "love_letter");
  const legacyLetterBouquet = (
    letterSection?.data as LoveLetterData & { bouquet?: BouquetConfig }
  )?.bouquet;

  const applyUploadFix =
    typeof window !== "undefined" && !localStorage.getItem(HERO_PHOTO_STORAGE_FIX);

  const migrated = next.map((s) => {
    if (s.sectionId === "love_letter") {
      const d = s.data as LoveLetterData & {
        body?: string;
        recipientName?: string;
        signature?: string;
        showEnvelope?: boolean;
        bouquet?: BouquetConfig;
      };
      const message = d.message ?? (typeof d.body === "string" ? d.body : "");
      const letter = d.letter ?? { ...DEFAULT_LETTER };
      if (
        d.message === undefined ||
        typeof d.body === "string" ||
        !d.letter ||
        d.bouquet !== undefined
      ) {
        return {
          ...s,
          data: { message, letter } satisfies LoveLetterData,
        };
      }
    }

    if (s.sectionId === "hero_couple") {
      const data = s.data as HeroCoupleData & {
        bouquet?: BouquetConfig;
      };
      const backgroundPhoto = applyUploadFix
        ? normalizeHeroPhotoForStore(data.backgroundPhoto)
        : resolveHeroPhoto(data.backgroundPhoto);
      const bouquet = data.bouquet ?? legacyLetterBouquet ?? { ...DEFAULT_BOUQUET };
      if (backgroundPhoto === data.backgroundPhoto && data.bouquet === bouquet) return s;
      return {
        ...s,
        data: { ...data, backgroundPhoto, bouquet } as SectionData,
      };
    }

    if (s.sectionId === "custom_message") {
      const data = s.data as CustomMessageData;
      const body = clampCustomMessageBody(data.body ?? "");
      const ctaText = data.ctaText ? clampCustomMessageCta(data.ctaText) : data.ctaText;
      if (body === data.body && ctaText === data.ctaText) return s;
      return {
        ...s,
        data: { ...data, body, ctaText },
      };
    }

    return s;
  });

  if (applyUploadFix && typeof window !== "undefined") {
    localStorage.setItem(HERO_PHOTO_STORAGE_FIX, "1");
  }

  return migrated;
}

function reindex(sections: BuilderSection[]): BuilderSection[] {
  return sortSections(migrateSections(sections));
}

function syncCoupleNames(sections: BuilderSection[], current: string): string {
  const hero = sections.find((s) => s.sectionId === "hero_couple");
  if (hero) {
    const h = hero.data as HeroCoupleData;
    if (h.person1Name?.trim() && h.person2Name?.trim()) {
      return `${h.person1Name.trim()} & ${h.person2Name.trim()}`;
    }
  }
  return current;
}

export const useBuilderStore = create<BuilderStore>()(
  persist(
    (set, get) => ({
      pageConfig: { coupleNames: "", theme: "scrapbook_red" },
      sections: initialSections(),
      builderStep: "choose",
      currentSectionIndex: 0,
      buyerEmail: "",

      toggleSection: (sectionId) => {
        if (LOCKED_SECTIONS.includes(sectionId)) return;
        set((state) => {
          const exists = state.sections.some((s) => s.sectionId === sectionId);
          if (exists) {
            if (state.sections.length <= MIN_SECTIONS) return state;
            return {
              sections: reindex(
                state.sections.filter((s) => s.sectionId !== sectionId)
              ),
            };
          }
          const sorted = sortSections(state.sections);
          const withoutFinal = sorted.filter((s) => s.sectionId !== LAST_SECTION);
          const finale = sorted.find((s) => s.sectionId === LAST_SECTION);
          const custom = createSection(sectionId, withoutFinal.length);
          const next = sortSections([
            ...withoutFinal,
            custom,
            ...(finale ? [finale] : []),
          ]);
          return { sections: next };
        });
      },

      togglePresentCard: (sectionIds, locked) => {
        if (locked) return;
        set((state) => {
          const allSelected = sectionIds.every((id) =>
            state.sections.some((s) => s.sectionId === id)
          );

          if (allSelected) {
            const filtered = state.sections.filter((s) => !sectionIds.includes(s.sectionId));
            if (filtered.length < MIN_SECTIONS) return state;
            return { sections: reindex(filtered) };
          }

          let next = [...state.sections];
          for (const id of sectionIds) {
            if (!next.some((s) => s.sectionId === id)) {
              next.push(createSection(id, next.length));
            }
          }
          return { sections: reindex(next) };
        });
      },

      reorderSections: (from, to) => {
        set((state) => {
          const sorted = sortSections(state.sections);
          if (LOCKED_SECTIONS.includes(sorted[from]?.sectionId)) return state;
          if (LOCKED_SECTIONS.includes(sorted[to]?.sectionId)) return state;
          const next = [...sorted];
          const [moved] = next.splice(from, 1);
          next.splice(to, 0, moved);
          return { sections: next.map((s, i) => ({ ...s, order: i })) };
        });
      },

      updateSectionData: (id, data) => {
        set((state) => {
          const current = state.sections.find((s) => s.id === id);
          if (!current) return state;

          const merged = { ...current.data, ...data } as SectionData;
          if (JSON.stringify(current.data) === JSON.stringify(merged)) {
            return state;
          }

          const updated = updateSectionData(state.sections, id, data);
          const coupleNames = syncCoupleNames(updated, state.pageConfig.coupleNames);
          return {
            sections: updated.map((s) => ({
              ...s,
              isComplete: validateSection(s),
            })),
            pageConfig: { ...state.pageConfig, coupleNames },
          };
        });
      },

      setStep: (step) => set({ builderStep: step }),
      setCurrentSectionIndex: (index) => set({ currentSectionIndex: index }),
      setBuyerEmail: (email) => set({ buyerEmail: email }),

      nextSection: () => {
        const total = get().sections.length;
        const next = Math.min(get().currentSectionIndex + 1, total - 1);
        set({ currentSectionIndex: next });
        return next;
      },

      prevSection: () => {
        const prev = Math.max(get().currentSectionIndex - 1, 0);
        set({ currentSectionIndex: prev });
        return prev;
      },

      getSectionProgress: () => {
        const total = get().sections.length;
        return {
          done: get().currentSectionIndex + 1,
          total,
        };
      },

      reset: () =>
        set({
          pageConfig: { coupleNames: "", theme: "scrapbook_red" },
          sections: initialSections(),
          builderStep: "choose",
          currentSectionIndex: 0,
          buyerEmail: "",
        }),
    }),
    {
      name: "linkamor-builder-v2",
      storage: createJSONStorage(() => createBuilderPersistStorage()),
      partialize: (s) => ({
        pageConfig: s.pageConfig,
        sections: s.sections.filter((sec) => (sec.sectionId as string) !== "quiz_couple"),
        builderStep: s.builderStep,
        currentSectionIndex: s.currentSectionIndex,
        buyerEmail: s.buyerEmail,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<BuilderStore> | undefined;
        if (!p?.sections) return { ...current, ...p };
        const sections = reindex(
          p.sections.filter((s) => (s.sectionId as string) !== "quiz_couple")
        );
        return { ...current, ...p, sections };
      },
    }
  )
);

export function isSectionSelected(sections: BuilderSection[], id: SectionId): boolean {
  return sections.some((s) => s.sectionId === id);
}

export { nanoid };
