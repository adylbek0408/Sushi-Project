import type { Category, Product } from "@/types";

/**
 * Temporarily hidden on the storefront (category chip + products).
 * Remove from this list when ready to show again.
 */
const FROZEN_CATEGORY_SLUGS = new Set([
  "sendvichi",
  "sendwichi",
  "sandwiches",
  "sandwich",
  "category-2",
]);

const FROZEN_NAME_FRAGMENTS = ["сендвич", "сэндвич", "sandwich"];

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/ё/g, "е");
}

/** Whether this category is temporarily frozen on the frontend. */
export function isFrozenCategory(
  category: Pick<Category, "slug" | "name">,
): boolean {
  if (FROZEN_CATEGORY_SLUGS.has(category.slug)) return true;
  const name = normalize(category.name);
  return FROZEN_NAME_FRAGMENTS.some((fragment) => name.includes(fragment));
}

/** Whether a product belongs to a frozen category (by slug or category_name). */
export function isFrozenProduct(product: Product): boolean {
  if (FROZEN_CATEGORY_SLUGS.has(product.category)) return true;
  const name = normalize(product.category_name ?? "");
  return FROZEN_NAME_FRAGMENTS.some((fragment) => name.includes(fragment));
}

export function filterVisibleCategories(categories: Category[]): Category[] {
  return categories.filter((c) => !isFrozenCategory(c));
}

export function filterVisibleProducts(products: Product[]): Product[] {
  return products.filter((p) => !isFrozenProduct(p));
}
