import { apiClient } from "./client";
import type { Banner, Category, Product } from "@/types";

const REVALIDATE_SECONDS = 60;

export const catalogApi = {
  getCategories: () =>
    apiClient.get<Category[]>("/categories/", {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["categories"] },
    }),

  getBanners: () =>
    apiClient.get<Banner[]>("/banners/", {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["banners"] },
    }),

  getProducts: (params?: { category?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    return apiClient.get<Product[]>(`/products/${qs ? `?${qs}` : ""}`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["products"] },
    });
  },

  getProduct: (slug: string) =>
    apiClient.get<Product>(`/products/${slug}/`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [`product:${slug}`] },
    }),
};
