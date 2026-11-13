import type { Product } from "@/types";

/**
 * «Нет в наличии» from admin «В продаже» (`Product.is_active`).
 * False / missing → treat as available (backward compatible).
 */
export function isOutOfStock(product: Product): boolean {
  return product.is_active === false;
}
