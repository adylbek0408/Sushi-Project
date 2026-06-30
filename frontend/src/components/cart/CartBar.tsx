"use client";

import { Icon } from "@/components/ui/Icon";
import { useCartStore, selectTotalCount, selectTotalAmount } from "@/store/cart";
import { useUiStore } from "@/store/ui";
import { useHydrated } from "@/hooks/useHydrated";
import { formatPrice, pluralizeItems } from "@/lib/format";

interface CartBarProps {
  currency: string;
}

/** Mobile-only sticky bar floating above the bottom navigation. */
export function CartBar({ currency }: CartBarProps) {
  const count = useCartStore(selectTotalCount);
  const total = useCartStore(selectTotalAmount);
  const openCheckout = useUiStore((s) => s.openCheckout);
  const hydrated = useHydrated();

  if (!hydrated || count === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-[88px] left-0 right-0 z-30 px-margin-mobile lg:hidden">
      <button
        type="button"
        onClick={openCheckout}
        className="pointer-events-auto flex h-14 w-full items-center justify-between rounded-[24px] bg-primary/90 px-6 text-on-primary shadow-cart-bar backdrop-blur-xl transition-all duration-300 hover:bg-primary active:scale-[0.98]"
      >
        <span className="flex items-center gap-2 font-body-md text-[15px] font-bold">
          <Icon name="shopping_cart" className="text-[20px]" />
          {pluralizeItems(count)} • {formatPrice(total, currency)}
        </span>
        <Icon name="chevron_right" />
      </button>
    </div>
  );
}
