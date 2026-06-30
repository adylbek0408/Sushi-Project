"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { formatPrice } from "@/lib/format";
import { mediaUrl } from "@/lib/config";
import { useCartStore, type CartItem } from "@/store/cart";

interface CartItemRowProps {
  item: CartItem;
  currency: string;
}

export function CartItemRow({ item, currency }: CartItemRowProps) {
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const image = mediaUrl(item.image);

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-surface-container-low p-3">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-surface-container">
        {image ? (
          <Image
            src={image}
            alt={item.name}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon name="ramen_dining" className="text-secondary" />
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-headline-md text-[16px] text-on-surface">{item.name}</h3>
        <p className="font-body-md text-secondary">
          {formatPrice(item.price * item.quantity, currency)}
        </p>
      </div>

      <QuantityStepper
        value={item.quantity}
        onIncrement={() => increment(item.id)}
        onDecrement={() => decrement(item.id)}
      />
    </div>
  );
}
