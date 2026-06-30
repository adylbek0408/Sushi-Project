"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useUiStore } from "@/store/ui";
import { useCartStore, selectTotalCount } from "@/store/cart";
import { useHydrated } from "@/hooks/useHydrated";
import { clsx } from "@/lib/clsx";

const ITEMS = [
  { label: "Меню", icon: "restaurant_menu", href: "/" },
  { label: "Поиск", icon: "search", href: "/search" },
  { label: "Заказы", icon: "receipt_long", href: "/orders" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const openCheckout = useUiStore((s) => s.openCheckout);
  const count = useCartStore(selectTotalCount);
  const hydrated = useHydrated();
  const badge = hydrated ? count : 0;

  return (
    <nav className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around bg-surface/90 px-4 pt-3 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.04)] backdrop-blur-2xl lg:hidden">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex flex-col items-center justify-center transition-opacity active:scale-90",
              active ? "font-bold text-primary" : "text-secondary",
            )}
          >
            <Icon name={item.icon} filled={active} />
            <span className="mt-1 font-label-md text-label-sm">{item.label}</span>
          </Link>
        );
      })}
      <button
        type="button"
        onClick={openCheckout}
        className="relative flex flex-col items-center justify-center text-secondary transition-opacity active:scale-90"
      >
        <Icon name="shopping_cart" />
        {badge > 0 && (
          <span className="absolute right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-on-primary">
            {badge}
          </span>
        )}
        <span className="mt-1 font-label-md text-label-sm">Корзина</span>
      </button>
    </nav>
  );
}
