"use client";

import { formatPrice } from "@/lib/format";
import { calcCartPricing } from "@/lib/discount";
import type { CartItem } from "@/store/cart";

const FREE_DELIVERY_PORTIONS = 7;

interface CartDiscountSummaryProps {
  items: CartItem[];
  currency: string;
  /** Compact layout for the mobile cart bar. */
  compact?: boolean;
}

/** Cart total + free-delivery hint from 7 main-dish portions. */
export function CartDiscountSummary({
  items,
  currency,
  compact = false,
}: CartDiscountSummaryProps) {
  const {
    discountPercent,
    discountedSubtotal,
    subtotal,
    foodPortions,
  } = calcCartPricing(items);
  const freeDeliveryUnlocked = foodPortions >= FREE_DELIVERY_PORTIONS;
  const remainingForFreeDelivery = Math.max(
    0,
    FREE_DELIVERY_PORTIONS - foodPortions,
  );

  if (compact) {
    return (
      <span className="flex items-center gap-2">
        {discountPercent > 0 ? (
          <>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold">
              −{discountPercent}%
            </span>
            <span className="text-[13px] line-through opacity-70">
              {formatPrice(subtotal, currency)}
            </span>
            <span className="font-bold">{formatPrice(discountedSubtotal, currency)}</span>
          </>
        ) : (
          <span className="font-bold">{formatPrice(subtotal, currency)}</span>
        )}
      </span>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-primary/10 px-4 py-3 text-on-surface">
        {freeDeliveryUnlocked ? (
          <p className="font-body-md text-[13px] text-secondary">
            Доставка{" "}
            <span className="font-bold text-primary">бесплатно</span>
            {" "}· от 7 порций
          </p>
        ) : (
          <p className="font-body-md text-[13px] text-secondary">
            От 7 порций — доставка{" "}
            <span className="font-bold text-primary">бесплатно</span>
            {remainingForFreeDelivery > 0 ? (
              <>
                {" "}
                · ещё {remainingForFreeDelivery} порц.
              </>
            ) : null}
          </p>
        )}
      </div>

      <div className="flex items-end justify-between gap-3">
        <span className="font-headline-md text-headline-md">Итого:</span>
        <div className="flex flex-col items-end">
          {discountPercent > 0 ? (
            <>
              <span className="font-body-md text-secondary line-through">
                {formatPrice(subtotal, currency)}
              </span>
              <span className="font-headline-lg text-headline-lg text-primary">
                {formatPrice(discountedSubtotal, currency)}
              </span>
            </>
          ) : (
            <span className="font-headline-lg text-headline-lg text-primary">
              {formatPrice(subtotal, currency)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
