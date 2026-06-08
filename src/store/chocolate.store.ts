import { create } from "zustand";
import { nanoid } from "nanoid";
import type { ChocolatePlacement } from "@/lib/gift-types";
import {
  getChocolateType,
  getMaxBiteStage,
  normalizeChocolateIndex,
} from "@/data/chocolate-catalog";

interface ChocolateState {
  placements: ChocolatePlacement[];
  selectedSlot: number | null;
  boxTitle: string;
  coupleName: string;

  setMeta: (meta: Partial<Pick<ChocolateState, "boxTitle" | "coupleName">>) => void;
  loadPlacements: (
    placements: ChocolatePlacement[],
    meta?: Partial<Pick<ChocolateState, "boxTitle" | "coupleName">>
  ) => void;
  placeInSlot: (slotIndex: number, chocolateIndex: number) => void;
  biteInSlot: (slotIndex: number) => void;
  removeFromSlot: (slotIndex: number) => void;
  selectSlot: (slotIndex: number | null) => void;
  reset: () => void;
}

const initialMeta = {
  boxTitle: "Caixa de Chocolates",
  coupleName: "",
};

function normalizePlacement(p: ChocolatePlacement): ChocolatePlacement {
  const { id, biteStage } = normalizeChocolateIndex(p.chocolateIndex);
  return {
    ...p,
    chocolateIndex: id,
    biteStage: p.biteStage ?? biteStage,
  };
}

export const useChocolateStore = create<ChocolateState>((set) => ({
  placements: [],
  selectedSlot: null,
  ...initialMeta,

  setMeta: (meta) => set(meta),

  loadPlacements: (placements, meta) =>
    set({
      placements: placements.map(normalizePlacement),
      selectedSlot: null,
      ...initialMeta,
      ...meta,
    }),

  placeInSlot: (slotIndex, chocolateIndex) =>
    set((state) => ({
      placements: [
        ...state.placements.filter((p) => p.slotIndex !== slotIndex),
        { id: nanoid(10), slotIndex, chocolateIndex, biteStage: 0 },
      ],
      selectedSlot: slotIndex,
    })),

  biteInSlot: (slotIndex) =>
    set((state) => {
      const placement = state.placements.find((p) => p.slotIndex === slotIndex);
      if (!placement) return state;

      const type = getChocolateType(placement.chocolateIndex);
      if (!type) return state;

      const current = placement.biteStage ?? 0;
      const next = current + 1;

      if (next > getMaxBiteStage(type)) {
        return {
          placements: state.placements.filter((p) => p.slotIndex !== slotIndex),
          selectedSlot: null,
        };
      }

      return {
        placements: state.placements.map((p) =>
          p.slotIndex === slotIndex ? { ...p, biteStage: next } : p
        ),
        selectedSlot: slotIndex,
      };
    }),

  removeFromSlot: (slotIndex) =>
    set((state) => ({
      placements: state.placements.filter((p) => p.slotIndex !== slotIndex),
      selectedSlot: state.selectedSlot === slotIndex ? null : state.selectedSlot,
    })),

  selectSlot: (slotIndex) => set({ selectedSlot: slotIndex }),

  reset: () => set({ placements: [], selectedSlot: null, ...initialMeta }),
}));
