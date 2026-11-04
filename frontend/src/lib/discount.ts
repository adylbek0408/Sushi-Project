/**
 * Volume discount by portion count of *main* dishes only (not addons):
 *  10+ → 15%,  30+ → 20%,  50+ → 25%.
 * Addon lines (salads/drinks) stay full price.
 */

import type { CartItem } from "@/store/cart";

export const DISCOUNT_TIERS = [
  { minPortions: 50, percent: 25 },
  { minPortions: 30, percent: 20 },
  { minPortions: 10, percent: 15 },
] as const;

export function getDiscountPercent(portionCount: number): number {
  for (const tier of DISCOUNT_TIERS) {
    if (portionCount >= tier.minPortions) return tier.percent;
  }
  return 0;
}

/** Next tier the customer can reach, if any. */
export function getNextDiscountTier(portionCount: number): {
  minPortions: number;
  percent: number;
  remaining: number;
} | null {
  const ascending = [...DISCOUNT_TIERS].sort(
    (a, b) => a.minPortions - b.minPortions,
  );
  for (const tier of ascending) {
    if (portionCount < tier.minPortions) {
      return {
        minPortions: tier.minPortions,
        percent: tier.percent,
        remaining: tier.minPortions - portionCount,
      };
    }
  }
  return null;
}

export function applyDiscount(subtotal: number, percent: number): number {
  if (percent <= 0) return Math.round(subtotal);
  return Math.round(subtotal * (1 - percent / 100));
}

export interface CartPricing {
  /** Full cart total before discount. */
  subtotal: number;
  /** Payable total after discount on main dishes. */
  discountedSubtotal: number;
  discountPercent: number;
  saved: number;
  /** Main-dish portions only (drives the tier). */
  foodPortions: number;
  foodSubtotal: number;
  addonSubtotal: number;
}

export function calcCartPricing(items: CartItem[]): CartPricing {
  let foodSubtotal = 0;
  let addonSubtotal = 0;
  let foodPortions = 0;

  for (const item of items) {
    const line = item.price * item.quantity;
    if (item.isAddon) {
      addonSubtotal += line;
    } else {
      foodSubtotal += line;
      foodPortions += item.quantity;
    }
  }

  const discountPercent = getDiscountPercent(foodPortions);
  const discountedFood = applyDiscount(foodSubtotal, discountPercent);
  const subtotal = Math.round(foodSubtotal + addonSubtotal);
  const discountedSubtotal = Math.round(discountedFood + addonSubtotal);
  const saved = Math.max(0, subtotal - discountedSubtotal);

  return {
    subtotal,
    discountedSubtotal,
    discountPercent,
    saved,
    foodPortions,
    foodSubtotal: Math.round(foodSubtotal),
    addonSubtotal: Math.round(addonSubtotal),
  };
}
