import "server-only";
import { catalogApi } from "./catalog";
import { settingsApi } from "./settings";
import { DEFAULT_SETTINGS } from "./defaults";
import type { Banner, Category, Product, ShopSettings } from "@/types";

export { DEFAULT_SETTINGS };

export interface StorefrontData {
  categories: Category[];
  products: Product[];
  banners: Banner[];
  settings: ShopSettings;
}

/**
 * Fetches everything the home page needs in parallel. Failures degrade
 * gracefully so a transient API outage never breaks the static build.
 */
export async function getStorefrontData(): Promise<StorefrontData> {
  const [categories, products, banners, settings] = await Promise.all([
    catalogApi.getCategories().catch(() => [] as Category[]),
    catalogApi.getProducts({}).catch(() => [] as Product[]),
    catalogApi.getBanners().catch(() => [] as Banner[]),
    settingsApi.getSettings().catch(() => DEFAULT_SETTINGS),
  ]);

  return { categories, products, banners, settings };
}

export async function getSettingsSafe(): Promise<ShopSettings> {
  return settingsApi.getSettings().catch(() => DEFAULT_SETTINGS);
}
