import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartLineId, resolvePrice, resolveWeight } from "@/lib/product";
import type { Product, ProductVariant } from "@/types";

export interface CartItem {
  /** Unique line id (product id, or product:variant). */
  id: string;
  productId: string;
  variantId: string | null;
  variantLabel: string | null;
  name: string;
  price: number;
  image: string | null;
  weight: number | null;
  quantity: number;
  /** Addon (salad/drink) — excluded from volume-discount portions. */
  isAddon: boolean;
}

export interface AddItemOptions {
  isAddon?: boolean;
}

interface CartState {
  items: CartItem[];
  addItem: (
    product: Product,
    variant?: ProductVariant | null,
    options?: AddItemOptions,
  ) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, variant = null, options) =>
        set((state) => {
          const chosen = variant ?? null;
          const lineId = cartLineId(product.id, chosen?.id);
          const isAddon = Boolean(options?.isAddon);
          const existing = state.items.find((item) => item.id === lineId);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === lineId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: lineId,
                productId: product.id,
                variantId: chosen?.id ?? null,
                variantLabel: chosen?.label ?? null,
                name: product.name,
                price: resolvePrice(product, chosen),
                image: product.image,
                weight: resolveWeight(product, chosen),
                quantity: 1,
                isAddon,
              },
            ],
          };
        }),

      increment: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        })),

      decrement: (id) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
            )
            .filter((item) => item.quantity > 0),
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      clear: () => set({ items: [] }),
    }),
    {
      name: "sushiya-cart",
      version: 3,
      migrate: (persisted) => {
        const state = (persisted ?? { items: [] }) as CartState;
        return {
          ...state,
          items: (state.items ?? []).map((item) => ({
            ...item,
            isAddon: Boolean(item.isAddon),
          })),
        };
      },
    },
  ),
);

export const selectTotalCount = (state: CartState): number =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectTotalAmount = (state: CartState): number =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

/** Portions that count toward volume discount (main dishes only). */
export const selectDiscountablePortions = (state: CartState): number =>
  state.items
    .filter((item) => !item.isAddon)
    .reduce((sum, item) => sum + item.quantity, 0);
