"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { PortionPicker } from "@/components/home/PortionPicker";
import { formatPrice } from "@/lib/format";
import {
  cartLineId,
  getDefaultVariant,
  getVariants,
  resolvePrice,
  resolveWeight,
} from "@/lib/product";
import { useCartStore } from "@/store/cart";
import { useUiStore } from "@/store/ui";
import { useHydrated } from "@/hooks/useHydrated";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
  currency: string;
}

export function AddToCartButton({ product, currency }: AddToCartButtonProps) {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const openCheckout = useUiStore((s) => s.openCheckout);
  const hydrated = useHydrated();
  const [justAdded, setJustAdded] = useState(false);

  const variants = useMemo(() => getVariants(product), [product]);
  const [variantId, setVariantId] = useState(
    () => getDefaultVariant(product)?.id ?? "",
  );

  const selected =
    variants.find((v) => v.id === variantId) ?? getDefaultVariant(product);
  const lineId = cartLineId(product.id, selected?.id);
  const inCart = hydrated ? items.find((item) => item.id === lineId) : undefined;
  const price = resolvePrice(product, selected);
  const weight = resolveWeight(product, selected);

  return (
    <div className="flex flex-col gap-5">
      <PortionPicker
        variants={variants}
        value={selected?.id ?? ""}
        onChange={setVariantId}
        currency={currency}
      />

      <div className="flex items-baseline gap-3">
        <span className="font-display-lg text-headline-lg text-primary">
          {formatPrice(price, currency)}
        </span>
        {weight ? (
          <span className="font-body-md text-secondary">{weight} г</span>
        ) : null}
      </div>

      {inCart ? (
        <div className="flex items-center gap-4">
          <QuantityStepper
            value={inCart.quantity}
            onIncrement={() => increment(lineId)}
            onDecrement={() => decrement(lineId)}
          />
          <button
            type="button"
            onClick={openCheckout}
            className="flex-1 rounded-full bg-primary px-6 py-4 font-label-md text-label-md text-on-primary transition-all active:scale-[0.98]"
          >
            Перейти к оформлению
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            addItem(product, selected);
            setJustAdded(true);
            window.setTimeout(() => setJustAdded(false), 1200);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-label-md text-label-md text-on-primary shadow-elevation-1 transition-all active:scale-[0.98]"
        >
          <Icon name={justAdded ? "check" : "add_shopping_cart"} />
          {justAdded ? "Добавлено" : "Добавить в корзину"}
        </button>
      )}
    </div>
  );
}
