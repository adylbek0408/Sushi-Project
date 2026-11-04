"use client";

import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "@/lib/api/catalog";
import { settingsApi } from "@/lib/api/settings";
import type { Category, Product, ShopSettings } from "@/types";

const FIVE_MINUTES = 5 * 60 * 1000;

export function useCategories(initialData?: Category[]) {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => catalogApi.getCategories(),
    staleTime: FIVE_MINUTES,
    initialData,
    // iOS Safari: cart sheet mounts late — ensure cache is warm / refetch if empty
    refetchOnMount: true,
  });
}

export function useProducts(
  params: { category?: string; search?: string },
  initialData?: Product[],
) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => catalogApi.getProducts(params),
    staleTime: FIVE_MINUTES,
    initialData,
    refetchOnMount: true,
  });
}

export function useShopSettings(initialData?: ShopSettings) {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.getSettings(),
    staleTime: FIVE_MINUTES,
    initialData,
  });
}
