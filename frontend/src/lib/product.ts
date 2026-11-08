import type { Product, ProductVariant } from "@/types";

const LARGE_PORTION_WEIGHT = 400;

function isLargeVariant(variant: ProductVariant): boolean {
  if (variant.weight === LARGE_PORTION_WEIGHT) return true;
  const label = variant.label.toLowerCase();
  return label.includes("больш") || label.includes("large");
}

/** Active portion variants for a product (empty = sold at product.price). */
export function getVariants(product: Product): ProductVariant[] {
  return product.variants ?? [];
}

/**
 * Storefront sells only the large portion (≈400 г).
 * Prefer weight 400 / «Большой», otherwise the heaviest / last variant.
 */
export function getDefaultVariant(product: Product): ProductVariant | null {
  const variants = getVariants(product);
  if (variants.length === 0) return null;

  const large = variants.find(isLargeVariant);
  if (large) return large;

  return [...variants].sort(
    (a, b) => (b.weight ?? 0) - (a.weight ?? 0) || Number(b.price) - Number(a.price),
  )[0];
}

export function resolvePrice(
  product: Product,
  variant?: ProductVariant | null,
): number {
  if (variant) return Number(variant.price);
  const chosen = getDefaultVariant(product);
  return Number(chosen ? chosen.price : product.price);
}

export function resolveWeight(
  product: Product,
  variant?: ProductVariant | null,
): number | null {
  if (variant) return variant.weight;
  const chosen = getDefaultVariant(product);
  return chosen ? chosen.weight : product.weight;
}

/** Stable cart line key: product alone, or product+variant. */
export function cartLineId(
  productId: string,
  variantId?: string | null,
): string {
  return variantId ? `${productId}:${variantId}` : productId;
}
