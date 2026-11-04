"use client";

import { clsx } from "@/lib/clsx";
import { formatPrice } from "@/lib/format";
import type { ProductVariant } from "@/types";

interface PortionPickerProps {
  variants: ProductVariant[];
  value: string;
  onChange: (variantId: string) => void;
  currency: string;
  className?: string;
}

/** Portion size selector for the product detail page (not delivery/pickup). */
export function PortionPicker({
  variants,
  value,
  onChange,
  currency,
  className,
}: PortionPickerProps) {
  if (variants.length === 0) return null;

  return (
    <fieldset className={clsx("m-0 min-w-0 border-0 p-0", className)}>
      <legend className="mb-2 font-label-md text-label-md text-secondary">
        Выберите порцию
      </legend>
      <div className="flex flex-col gap-2" role="radiogroup" aria-label="Порция">
        {variants.map((variant) => {
          const selected = variant.id === value;
          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(variant.id)}
              className={clsx(
                "flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                selected
                  ? "border-primary bg-primary/10 text-on-surface"
                  : "border-surface-variant bg-surface text-on-surface hover:border-primary/40",
              )}
            >
              <span className="font-label-md text-label-md">
                Порция: {variant.label}
              </span>
              <span className="shrink-0 font-body-md text-secondary">
                {[
                  variant.weight ? `${variant.weight} г` : null,
                  formatPrice(variant.price, currency),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
