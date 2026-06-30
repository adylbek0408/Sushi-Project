"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { useCartStore, selectTotalAmount, selectTotalCount } from "@/store/cart";
import { useUiStore } from "@/store/ui";
import { useHydrated } from "@/hooks/useHydrated";
import { formatPrice } from "@/lib/format";
import { mediaUrl } from "@/lib/config";
import type { ShopSettings } from "@/types";

interface CartSidebarProps {
  settings: ShopSettings;
}

/** Desktop-only persistent cart panel (right rail). */
export function CartSidebar({ settings }: CartSidebarProps) {
  const items = useCartStore((s) => s.items);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const total = useCartStore(selectTotalAmount);
  const count = useCartStore(selectTotalCount);
  const openCheckout = useUiStore((s) => s.openCheckout);
  const hydrated = useHydrated();

  return (
    <aside className="sticky top-0 z-30 hidden h-screen w-[380px] flex-col border-l border-surface-variant bg-surface-container-lowest shadow-elevation-1 lg:flex">
      <div className="border-b border-surface-variant p-6">
        <h2 className="flex items-center gap-2 font-headline-md text-headline-md">
          <Icon name="shopping_cart" />
          Корзина
        </h2>
      </div>

      <div className="no-scrollbar flex-1 space-y-6 overflow-y-auto p-6">
        {!hydrated || count === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Icon name="shopping_cart" className="text-4xl text-secondary" />
            <p className="font-body-md text-secondary">Корзина пуста</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-surface-container">
                {mediaUrl(item.image) ? (
                  <Image
                    src={mediaUrl(item.image) as string}
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
                <h4 className="font-body-md font-medium">{item.name}</h4>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">
                    {formatPrice(item.price * item.quantity, settings.currency)}
                  </span>
                  <div className="flex items-center gap-3 rounded-full bg-surface-container px-2 py-1">
                    <button
                      type="button"
                      aria-label="Уменьшить"
                      onClick={() => decrement(item.id)}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-container-highest text-xs transition-colors hover:bg-surface-variant"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Увеличить"
                      onClick={() => increment(item.id)}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-container-highest text-xs transition-colors hover:bg-surface-variant"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-surface-variant p-6 pb-8">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-body-lg text-on-surface-variant">Доставка</span>
          <span className="font-medium">
            {settings.delivery_is_free
              ? "Бесплатно"
              : formatPrice(settings.delivery_fee, settings.currency)}
          </span>
        </div>
        <div className="mb-8 flex items-center justify-between">
          <span className="font-headline-md text-headline-md">Итого:</span>
          <span className="font-headline-lg text-headline-lg text-primary">
            {formatPrice(total, settings.currency)}
          </span>
        </div>
        <button
          type="button"
          onClick={openCheckout}
          disabled={!hydrated || count === 0}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-whatsapp py-4 font-label-md text-label-md text-white shadow-elevation-1 transition-all hover:bg-whatsapp-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Icon name="chat" filled className="text-[20px]" />
          Заказать через WhatsApp
        </button>
      </div>
    </aside>
  );
}
