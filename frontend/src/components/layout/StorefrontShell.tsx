import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { CartBar } from "@/components/cart/CartBar";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { CheckoutSheet } from "@/components/cart/CheckoutSheet";
import type { ShopSettings } from "@/types";

interface StorefrontShellProps {
  settings: ShopSettings;
  /** Render the desktop right-rail cart (home/menu pages only). */
  withSidebar?: boolean;
  children: React.ReactNode;
}

/**
 * App chrome shared across storefront pages: header, mobile bottom nav,
 * mobile cart bar, optional desktop cart rail, and the checkout sheet.
 */
export function StorefrontShell({
  settings,
  withSidebar = true,
  children,
}: StorefrontShellProps) {
  return (
    <>
      <div className="lg:flex lg:h-screen lg:overflow-hidden">
        <div className="no-scrollbar flex flex-1 flex-col pb-32 lg:overflow-y-auto lg:pb-8">
          <Header settings={settings} />
          <main className="mx-auto w-full max-w-container-max md:px-margin-desktop">
            {children}
          </main>
        </div>
        {withSidebar && <CartSidebar settings={settings} />}
      </div>

      <CartBar currency={settings.currency} />
      <BottomNav />
      <CheckoutSheet settings={settings} />
    </>
  );
}
