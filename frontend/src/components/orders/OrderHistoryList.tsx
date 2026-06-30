"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useOrderHistoryStore } from "@/store/orderHistory";
import { useHydrated } from "@/hooks/useHydrated";
import { formatPrice, pluralizeItems } from "@/lib/format";

export function OrderHistoryList() {
  const orders = useOrderHistoryStore((s) => s.orders);
  const hydrated = useHydrated();

  if (!hydrated) {
    return <p className="py-16 text-center font-body-md text-secondary">Загрузка…</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <Icon name="receipt_long" className="text-5xl text-secondary" />
        <p className="font-body-lg text-on-surface-variant">У вас пока нет заказов</p>
        <Link
          href="/"
          className="mt-2 rounded-full bg-primary px-6 py-3 font-label-md text-label-md text-on-primary transition-all active:scale-95"
        >
          Перейти в меню
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-stack-md">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center justify-between rounded-3xl bg-surface-container-lowest p-5 shadow-elevation-1"
        >
          <div>
            <h3 className="font-headline-md text-[16px] text-on-surface">
              Заказ #{order.number}
            </h3>
            <p className="mt-1 font-body-md text-secondary">
              {order.deliveryType === "delivery" ? "Доставка" : "Самовывоз"} ·{" "}
              {pluralizeItems(order.itemCount)}
            </p>
            <p className="mt-1 font-label-md text-label-sm text-tertiary-container">
              {new Date(order.createdAt).toLocaleString("ru-RU", {
                day: "2-digit",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <span className="font-headline-md text-headline-md text-primary">
            {formatPrice(order.total, order.currency)}
          </span>
        </div>
      ))}
    </div>
  );
}
