import { ApiError, apiClient } from "./client";
import {
  mapCategory,
  mapProduct,
  type TeyvaCategory,
  type TeyvaProduct,
} from "./mappers";
import type { Banner, Category, Product } from "@/types";

const REVALIDATE_SECONDS = 60;

let categoryNameCache: Map<string, string> | null = null;

async function loadCategoryNames(): Promise<Map<string, string>> {
  if (categoryNameCache) return categoryNameCache;
  const raw = await apiClient.get<TeyvaCategory[]>("/catalog/categories", {
    next: { revalidate: REVALIDATE_SECONDS, tags: ["categories"] },
  });
  categoryNameCache = new Map(raw.map((c) => [c.id, c.name]));
  return categoryNameCache;
}

function isMenuProduct(raw: TeyvaProduct): boolean {
  return raw.is_active && !raw.is_addon;
}

export const catalogApi = {
  getCategories: async (): Promise<Category[]> => {
    const raw = await apiClient.get<TeyvaCategory[]>("/catalog/categories", {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["categories"] },
    });
    categoryNameCache = new Map(raw.map((c) => [c.id, c.name]));
    return raw
      .map(mapCategory)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  getBanners: async (): Promise<Banner[]> => {
    // Public Teyva API has no banners endpoint yet.
    return [];
  },

  getProducts: async (params?: {
    category?: string;
    search?: string;
  }): Promise<Product[]> => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category_id", params.category);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();

    const [raw, names] = await Promise.all([
      apiClient.get<TeyvaProduct[]>(
        `/catalog/products${qs ? `?${qs}` : ""}`,
        { next: { revalidate: REVALIDATE_SECONDS, tags: ["products"] } },
      ),
      loadCategoryNames().catch(() => new Map<string, string>()),
    ]);

    return raw.filter(isMenuProduct).map((p) => mapProduct(p, names));
  },

  getProduct: async (slugOrId: string): Promise<Product> => {
    // No GET /catalog/products/{id} on public API — resolve from list.
    const products = await catalogApi.getProducts({});
    const product = products.find((p) => p.id === slugOrId || p.slug === slugOrId);
    if (!product) {
      throw new ApiError(404, { detail: "Not Found" });
    }
    return product;
  },
};
