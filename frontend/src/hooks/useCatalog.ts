"use client";

import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "@/lib/api/catalog";
import { settingsApi } from "@/lib/api/settings";
import type { Category, Product, ShopSettings } from "@/types";

export function useCategories(initialData?: Category[]) {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => catalogApi.getCategories(),
    initialData,
  });
}

export function useProducts(
  params: { category?: string; search?: string },
  initialData?: Product[],
) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => catalogApi.getProducts(params),
    initialData,
  });
}

export function useShopSettings(initialData?: ShopSettings) {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.getSettings(),
    initialData,
  });
}
