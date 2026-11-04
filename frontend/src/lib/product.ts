import type { Product, ProductVariant } from "@/types";

/** Active portion variants for a product (empty = sold at product.price). */
export function getVariants(product: Product): ProductVariant[] {
  return product.variants ?? [];
}

export function getDefaultVariant(product: Product): ProductVariant | null {
  const variants = getVariants(product);
  return variants[0] ?? null;
}

export function resolvePrice(
  product: Product,
  variant?: ProductVariant | null,
): number {
  if (variant) return Number(variant.price);
  const first = getDefaultVariant(product);
  return Number(first ? first.price : product.price);
}

export function resolveWeight(
  product: Product,
  variant?: ProductVariant | null,
): number | null {
  if (variant) return variant.weight;
  const first = getDefaultVariant(product);
  return first ? first.weight : product.weight;
}

/** Stable cart line key: product alone, or product+variant. */
export function cartLineId(
  productId: string,
  variantId?: string | null,
): string {
  return variantId ? `${productId}:${variantId}` : productId;
}
