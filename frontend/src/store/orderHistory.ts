import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order } from "@/types";

/** Keep local order history for 3 days, then drop. */
export const ORDER_HISTORY_RETENTION_MS = 3 * 24 * 60 * 60 * 1000;

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
  pruneExpired: () => void;
  clear: () => void;
}

function isFresh(order: HistoryOrder, now = Date.now()): boolean {
  const created = new Date(order.createdAt).getTime();
  if (Number.isNaN(created)) return false;
  return now - created < ORDER_HISTORY_RETENTION_MS;
}

function keepFresh(orders: HistoryOrder[], now = Date.now()): HistoryOrder[] {
  return orders.filter((order) => isFresh(order, now));
}

/**
 * Lightweight, client-side order history. The storefront is anonymous
 * (no customer accounts), so placed orders are remembered locally to
 * power the "Заказы" tab. Entries older than 3 days are pruned.
 */
export const useOrderHistoryStore = create<OrderHistoryState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) =>
        set((state) => ({
          orders: keepFresh([order, ...state.orders]).slice(0, 50),
        })),
      pruneExpired: () => {
        const next = keepFresh(get().orders);
        if (next.length !== get().orders.length) {
          set({ orders: next });
        }
      },
      clear: () => set({ orders: [] }),
    }),
    {
      name: "sushiya-order-history",
      version: 2,
      migrate: (persisted) => {
        const state = persisted as { orders?: HistoryOrder[] } | null;
        return {
          orders: keepFresh(state?.orders ?? []),
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.pruneExpired();
      },
    },
  ),
);
