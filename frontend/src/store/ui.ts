import { create } from "zustand";

interface UiState {
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isCheckoutOpen: false,
  openCheckout: () => set({ isCheckoutOpen: true }),
  closeCheckout: () => set({ isCheckoutOpen: false }),
}));
