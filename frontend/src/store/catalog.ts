import { create } from "zustand";

interface CatalogState {
  /** Currently selected category slug, or null for "Все". */
  selectedSlug: string | null;
  setSelectedSlug: (slug: string | null) => void;
}

/**
 * Shared selected-category state so the hero slider (outside the catalog)
 * can scroll the menu straight to a category when its CTA is pressed.
 */
export const useCatalogStore = create<CatalogState>((set) => ({
  selectedSlug: null,
  setSelectedSlug: (slug) => set({ selectedSlug: slug }),
}));
