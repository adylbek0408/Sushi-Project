import "server-only";
import { catalogApi } from "./catalog";
import { settingsApi } from "./settings";
import type { Category, Product, ShopSettings } from "@/types";

export const DEFAULT_SETTINGS: ShopSettings = {
  shop_name: "Sushiya",
  whatsapp_number: "996700000000",
  currency: "сом",
  city: "Бишкек",
  pickup_address: "ул. Киевская 49А",
  min_order_amount: "0.00",
  delivery_is_free: true,
  delivery_fee: "0.00",
  working_hours: "10:00 – 23:00",
  is_accepting_orders: true,
};

export interface StorefrontData {
  categories: Category[];
  products: Product[];
  settings: ShopSettings;
}

/**
 * Fetches everything the home page needs in parallel. Failures degrade
 * gracefully so a transient API outage never breaks the static build.
 * Hero banners are static on the frontend (see lib/banners.ts).
 */
export async function getStorefrontData(): Promise<StorefrontData> {
  const [categories, products, settings] = await Promise.all([
    catalogApi.getCategories().catch(() => [] as Category[]),
    catalogApi.getProducts({}).catch(() => [] as Product[]),
    settingsApi.getSettings().catch(() => DEFAULT_SETTINGS),
  ]);

  return { categories, products, settings };
}

export async function getSettingsSafe(): Promise<ShopSettings> {
  return settingsApi.getSettings().catch(() => DEFAULT_SETTINGS);
}
