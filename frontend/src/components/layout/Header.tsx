"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useUiStore } from "@/store/ui";
import { useCartStore, selectTotalCount } from "@/store/cart";
import { useHydrated } from "@/hooks/useHydrated";
import type { ShopSettings } from "@/types";

interface HeaderProps {
  settings: ShopSettings;
}

export function Header({ settings }: HeaderProps) {
  const openCheckout = useUiStore((s) => s.openCheckout);
  const count = useCartStore(selectTotalCount);
  const hydrated = useHydrated();
  const badge = hydrated ? count : 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/80 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex w-full max-w-container-max items-center justify-between px-margin-mobile py-4 md:px-margin-desktop">
        {/* Brand on every breakpoint; nav only on desktop. */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Icon name="ramen_dining" className="text-primary md:hidden" />
            <span className="font-headline-lg text-headline-md font-bold tracking-tight text-primary md:text-headline-lg">
              {settings.shop_name}
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="rounded-full px-3 py-1 font-label-md text-label-md font-bold text-primary transition-colors hover:bg-surface-variant/50"
            >
              Меню
            </Link>
            <Link
              href="/orders"
              className="rounded-full px-3 py-1 font-label-md text-label-md text-secondary transition-colors hover:bg-surface-variant/50"
            >
              Мои заказы
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Поиск"
            className="rounded-full p-2 text-on-surface transition-colors hover:bg-surface-variant/50 active:scale-95"
          >
            <Icon name="search" />
          </Link>
          <button
            type="button"
            aria-label="Открыть корзину"
            onClick={openCheckout}
            className="relative hidden rounded-full p-2 text-secondary transition-colors hover:bg-surface-variant/50 active:scale-95 lg:block"
          >
            <Icon name="shopping_cart" />
            {badge > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-on-primary">
                {badge}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
