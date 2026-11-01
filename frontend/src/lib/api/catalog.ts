import { apiClient } from "./client";
import type { Banner, Category, Product } from "@/types";

/** Per-request fetch — never write into the shared Next.js Data Cache. */
const NO_STORE = { cache: "no-store" as const };

export const catalogApi = {
  getCategories: () =>
    apiClient.get<Category[]>("/categories/", NO_STORE),

  getBanners: () =>
    apiClient.get<Banner[]>("/banners/", NO_STORE),

  getProducts: (params?: { category?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    return apiClient.get<Product[]>(`/products/${qs ? `?${qs}` : ""}`, NO_STORE);
  },

  getProduct: (slug: string) =>
    apiClient.get<Product>(`/products/${slug}/`, NO_STORE),
};
