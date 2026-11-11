import type { Product } from "@/types";

/**
 * Frontend-only «нет в наличии» flag.
 * Remove entries / salad rule when items are back in stock.
 */

const OUT_OF_STOCK_NAMES = new Set([
  "гуляш с гарниром",
  "нежное фрикасе",
]);

const SALAD_CATEGORY_SLUGS = new Set([
  "salaty",
  "salat",
  "salads",
  "salad",
]);

const SALAD_NAME_FRAGMENTS = ["салат"];

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/ё/g, "е");
}

/** Whether product belongs to a salad category (used for addon strip). */
export function isSaladProduct(product: Product): boolean {
  if (SALAD_CATEGORY_SLUGS.has(product.category)) return true;
  const categoryName = normalize(product.category_name ?? "");
  return SALAD_NAME_FRAGMENTS.some((fragment) => categoryName.includes(fragment));
}

/** Whether the product should show as unavailable on the storefront. */
export function isOutOfStock(product: Product): boolean {
  if (OUT_OF_STOCK_NAMES.has(normalize(product.name))) return true;
  // All salads in the cart «Добавить к заказу» addon strip.
  if (isSaladProduct(product)) return true;
  return false;
}
