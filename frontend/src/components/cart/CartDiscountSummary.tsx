"use client";

import { formatPrice } from "@/lib/format";
import { calcCartPricing, getNextDiscountTier } from "@/lib/discount";
import type { CartItem } from "@/store/cart";

interface CartDiscountSummaryProps {
  items: CartItem[];
  currency: string;
  /** Compact layout for the mobile cart bar. */
  compact?: boolean;
}

/** Bright discount badge + price with/without discount (addons excluded from %). */
export function CartDiscountSummary({
  items,
  currency,
  compact = false,
}: CartDiscountSummaryProps) {
  const {
    discountPercent,
    discountedSubtotal,
    saved,
    subtotal,
    foodPortions,
  } = calcCartPricing(items);
  const next = getNextDiscountTier(foodPortions);

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
      {discountPercent > 0 ? (
        <div className="rounded-2xl bg-gradient-to-r from-primary to-[#FF9A4A] px-4 py-3 text-on-primary shadow-elevation-1">
          <p className="font-label-md text-[13px] uppercase tracking-wide text-white/90">
            Ваша скидка
          </p>
          <p className="mt-0.5 font-headline-lg text-headline-lg-mobile md:text-headline-lg">
            −{discountPercent}%
          </p>
          <p className="mt-1 font-body-md text-[13px] text-white/90">
            Экономия {formatPrice(saved, currency)} · {foodPortions} порц. блюд
          </p>
        </div>
      ) : next ? (
        <div className="rounded-2xl bg-primary/10 px-4 py-3 text-on-surface">
          <p className="font-body-md text-[13px] text-secondary">
            Ещё {next.remaining} порц. блюд — и скидка{" "}
            <span className="font-bold text-primary">{next.percent}%</span>
          </p>
        </div>
      ) : null}

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
