import { apiClient } from "./client";
import type { CreateOrderPayload, Order } from "@/types";

export const ordersApi = {
  createOrder: (payload: CreateOrderPayload) =>
    apiClient.post<Order>("/orders/", payload),

  getOrder: (id: string) => apiClient.get<Order>(`/orders/${id}/`),
};
