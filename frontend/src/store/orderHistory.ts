import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order } from "@/types";

export interface HistoryOrder {
  id: string;
  number: number;
  deliveryType: Order["delivery_type"];
  total: string;
  currency: string;
  itemCount: number;
  createdAt: string;
}

interface OrderHistoryState {
  orders: HistoryOrder[];
  addOrder: (order: HistoryOrder) => void;
  clear: () => void;
}

/**
 * Lightweight, client-side order history. The storefront is anonymous
 * (no customer accounts), so placed orders are remembered locally to
 * power the "Заказы" tab.
 */
export const useOrderHistoryStore = create<OrderHistoryState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders].slice(0, 50) })),
      clear: () => set({ orders: [] }),
    }),
    { name: "sushiya-order-history", version: 1 },
  ),
);
