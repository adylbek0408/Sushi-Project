import type { Metadata } from "next";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { OrderHistoryList } from "@/components/orders/OrderHistoryList";
import { getSettingsSafe } from "@/lib/api/server";

export const metadata: Metadata = {
  title: "Мои заказы",
  robots: { index: false, follow: false },
};

export default async function OrdersPage() {
  const settings = await getSettingsSafe();

  return (
    <StorefrontShell settings={settings} withSidebar={false}>
      <div className="px-margin-mobile pt-4 md:px-0 md:pt-8">
        <h1 className="mb-stack-lg font-headline-lg text-headline-lg-mobile text-on-surface md:text-headline-lg">
          Мои заказы
        </h1>
        <OrderHistoryList />
      </div>
    </StorefrontShell>
  );
}
