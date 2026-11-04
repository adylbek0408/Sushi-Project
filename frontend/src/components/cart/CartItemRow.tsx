"use client";

import { Icon } from "@/components/ui/Icon";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { CartThumb } from "./CartThumb";
import { formatPrice } from "@/lib/format";
import { useCartStore, type CartItem } from "@/store/cart";

interface CartItemRowProps {
  item: CartItem;
  currency: string;
}

export function CartItemRow({ item, currency }: CartItemRowProps) {
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low p-2.5 pr-3">
      <CartThumb src={item.image} alt={item.name} />

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 font-headline-md text-[15px] leading-tight text-on-surface">
          {item.name}
        </h3>
        {item.variantLabel ? (
          <p className="mt-0.5 font-label-md text-label-sm text-secondary">
            Порция: {item.variantLabel}
            {item.weight ? ` · ${item.weight} г` : ""}
          </p>
        ) : item.weight ? (
          <p className="mt-0.5 font-label-md text-label-sm text-secondary">
            {item.weight} г
          </p>
        ) : null}
        <p className="mt-1 font-body-md font-medium text-on-surface">
          {formatPrice(item.price * item.quantity, currency)}
        </p>
      </div>

      <QuantityStepper
        value={item.quantity}
        onIncrement={() => increment(item.id)}
        onDecrement={() => decrement(item.id)}
      />

      <button
        type="button"
        aria-label={`Удалить ${item.name} из корзины`}
        onClick={() => removeItem(item.id)}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-secondary transition-colors hover:bg-error-container hover:text-error active:scale-90"
      >
        <Icon name="delete" className="text-[20px]" />
      </button>
    </div>
  );
}
