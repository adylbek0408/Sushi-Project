"use client";

import { useMutation } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";
import type { CreateOrderPayload, Order } from "@/types";

export function useCreateOrder() {
  return useMutation<Order, Error, CreateOrderPayload>({
    mutationFn: (payload) => ordersApi.createOrder(payload),
  });
}
