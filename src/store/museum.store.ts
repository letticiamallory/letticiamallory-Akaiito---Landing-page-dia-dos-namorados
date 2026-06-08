import { create } from "zustand";
import { nanoid } from "nanoid";
import type { MuseumElement } from "@/lib/gift-types";

interface MuseumState {
  elements: MuseumElement[];
  selectedId: string | null;
  museumTitle: string;
  museumDate: string;
  coupleName: string;

  setMeta: (meta: Partial<Pick<MuseumState, "museumTitle" | "museumDate" | "coupleName">>) => void;
  loadFromElements: (elements: MuseumElement[], meta?: Partial<Pick<MuseumState, "museumTitle" | "museumDate" | "coupleName">>) => void;
  addElement: (el: Omit<MuseumElement, "id" | "zIndex"> & { zIndex?: number }) => string;
  updateElement: (id: string, updates: Partial<MuseumElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  reorder: (id: string, direction: "up" | "down") => void;
  reset: () => void;
}

const initialMeta = {
  museumTitle: "Museu de Nós",
  museumDate: "",
  coupleName: "",
};

export const useMuseumStore = create<MuseumState>((set, get) => ({
  elements: [],
  selectedId: null,
  ...initialMeta,

  setMeta: (meta) => set(meta),

  loadFromElements: (elements, meta) =>
    set({
      elements,
      selectedId: null,
      ...initialMeta,
      ...meta,
    }),

  addElement: (el) => {
    const id = nanoid(10);
    const maxZ = get().elements.reduce((m, e) => Math.max(m, e.zIndex), 1);
    const zIndex = el.zIndex ?? (el.type === "spectator" ? 2 : 3);
    set((state) => ({
      elements: [...state.elements, { ...el, id, zIndex: Math.max(zIndex, maxZ + 1) }],
      selectedId: id,
    }));
    return id;
  },

  updateElement: (id, updates) =>
    set((state) => ({
      elements: state.elements.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    })),

  removeElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((e) => e.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  selectElement: (id) => set({ selectedId: id }),

  reorder: (id, direction) =>
    set((state) => {
      const sorted = [...state.elements].sort((a, b) => a.zIndex - b.zIndex);
      const idx = sorted.findIndex((e) => e.id === id);
      if (idx < 0) return state;
      const swapIdx = direction === "up" ? idx + 1 : idx - 1;
      if (swapIdx < 0 || swapIdx >= sorted.length) return state;
      const a = sorted[idx];
      const b = sorted[swapIdx];
      return {
        elements: state.elements.map((e) => {
          if (e.id === a.id) return { ...e, zIndex: b.zIndex };
          if (e.id === b.id) return { ...e, zIndex: a.zIndex };
          return e;
        }),
      };
    }),

  reset: () => set({ elements: [], selectedId: null, ...initialMeta }),
}));
