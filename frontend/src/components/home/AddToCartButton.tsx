"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCartStore } from "@/store/cart";
import { useUiStore } from "@/store/ui";
import { useHydrated } from "@/hooks/useHydrated";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const openCheckout = useUiStore((s) => s.openCheckout);
  const hydrated = useHydrated();
  const [justAdded, setJustAdded] = useState(false);

  const inCart = hydrated ? items.find((item) => item.id === product.id) : undefined;

  if (inCart) {
    return (
      <div className="flex items-center gap-4">
        <QuantityStepper
          value={inCart.quantity}
          onIncrement={() => increment(product.id)}
          onDecrement={() => decrement(product.id)}
        />
        <button
          type="button"
          onClick={openCheckout}
          className="flex-1 rounded-full bg-primary px-6 py-4 font-label-md text-label-md text-on-primary transition-all active:scale-[0.98]"
        >
          Перейти к оформлению
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        addItem(product);
        setJustAdded(true);
        window.setTimeout(() => setJustAdded(false), 1200);
      }}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-label-md text-label-md text-on-primary shadow-elevation-1 transition-all active:scale-[0.98]"
    >
      <Icon name={justAdded ? "check" : "add_shopping_cart"} />
      {justAdded ? "Добавлено" : "Добавить в корзину"}
    </button>
  );
}
