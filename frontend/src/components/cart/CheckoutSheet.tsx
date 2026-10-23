"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/components/ui/Icon";
import { Input, Textarea } from "@/components/ui/Input";
import { CartItemRow } from "./CartItemRow";
import { checkoutSchema, type CheckoutFormValues } from "./checkoutSchema";
import { useCartStore, selectTotalAmount } from "@/store/cart";
import { useUiStore } from "@/store/ui";
import { useOrderHistoryStore } from "@/store/orderHistory";
import { useHydrated } from "@/hooks/useHydrated";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { ApiError } from "@/lib/api/client";
import type { ShopSettings } from "@/types";

interface CheckoutSheetProps {
  settings: ShopSettings;
}

export function CheckoutSheet({ settings }: CheckoutSheetProps) {
  const isOpen = useUiStore((s) => s.isCheckoutOpen);
  const closeCheckout = useUiStore((s) => s.closeCheckout);
  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectTotalAmount);
  const clearCart = useCartStore((s) => s.clear);
  const addToHistory = useOrderHistoryStore((s) => s.addOrder);
  const hydrated = useHydrated();
  const router = useRouter();
  const createOrder = useCreateOrder();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryType: "delivery",
      address: "",
      customerName: "",
      phone: "",
      comment: "",
    },
  });

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!hydrated || !isOpen) return null;

  const onSubmit = async (values: CheckoutFormValues) => {
    if (items.length === 0) return;

    try {
      // Prefer server order when API allows it; Teyva public /orders needs auth,
      // so we fall back to WhatsApp + local history (same UX as the CTA).
      let orderId = crypto.randomUUID();
      let orderNumber = Date.now() % 100000;
      let orderTotal = String(total);
      const deliveryType = "delivery" as const;
      let createdAt = new Date().toISOString();

      try {
        const order = await createOrder.mutateAsync({
          delivery_type: deliveryType,
          items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })),
          customer_name: values.customerName?.trim() || undefined,
          phone: values.phone?.trim() || undefined,
          address: values.address?.trim() || undefined,
          comment: values.comment?.trim() || undefined,
        });
        orderId = order.id;
        orderNumber = order.number;
        orderTotal = order.total_amount;
        createdAt = order.created_at;
      } catch (error) {
        if (!(error instanceof ApiError && (error.status === 401 || error.status === 403 || error.status === 404))) {
          throw error;
        }
      }

      const message = buildWhatsAppMessage({
        deliveryType,
        items,
        total: Number(orderTotal),
        currency: settings.currency,
        address: values.address,
        customerName: values.customerName,
        phone: values.phone,
        comment: values.comment,
      });
      const url = buildWhatsAppUrl(settings.whatsapp_number, message);

      addToHistory({
        id: orderId,
        number: orderNumber,
        deliveryType,
        total: orderTotal,
        currency: settings.currency,
        itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
        createdAt,
      });

      window.open(url, "_blank", "noopener,noreferrer");

      clearCart();
      closeCheckout();
      router.push("/orders");
    } catch (error) {
      if (error instanceof ApiError) {
        const payload = error.payload as Record<string, unknown>;
        const fieldMap: Record<string, keyof CheckoutFormValues> = {
          address: "address",
          customer_name: "customerName",
          phone: "phone",
        };
        let matched = false;
        for (const [key, field] of Object.entries(fieldMap)) {
          const value = payload[key];
          if (value) {
            setError(field, {
              message: Array.isArray(value) ? String(value[0]) : String(value),
            });
            matched = true;
          }
        }
        if (!matched) {
          setError("root", { message: error.message });
        }
      } else {
        setError("root", { message: "Не удалось оформить заказ. Попробуйте ещё раз." });
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center overlay-blur md:items-center"
      onClick={closeCheckout}
    >
      <div
        className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-[32px] bg-surface-container-lowest shadow-[0_-10px_40px_rgba(0,0,0,0.12)] animate-slide-up md:max-w-lg md:rounded-[32px]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Оформление заказа"
      >
        <div className="flex w-full justify-center pt-3 pb-2 md:hidden">
          <span className="h-1 w-10 rounded-full bg-outline-variant" />
        </div>

        <div className="flex items-center justify-between px-margin-mobile py-2">
          <h2 className="font-headline-md text-headline-md text-on-surface">Ваш заказ</h2>
          <button
            type="button"
            aria-label="Закрыть"
            onClick={closeCheckout}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high transition-transform active:scale-95"
          >
            <Icon name="close" className="text-on-surface-variant" />
          </button>
        </div>

        <form
          id="checkout-form"
          onSubmit={handleSubmit(onSubmit)}
          className="no-scrollbar flex-1 overflow-y-auto px-margin-mobile pb-6"
        >
          {items.length === 0 ? (
            <div className="mt-stack-lg flex flex-col items-center gap-2 py-10 text-center">
              <Icon name="shopping_cart" className="text-4xl text-secondary" />
              <p className="font-body-md text-secondary">Корзина пуста</p>
            </div>
          ) : (
            <>
              <div className="mt-stack-lg space-y-stack-md">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} currency={settings.currency} />
                ))}
              </div>

              <div className="mt-stack-lg flex items-center justify-between border-t border-dashed border-outline-variant pt-4">
                <span className="font-headline-md text-on-surface-variant">Итого</span>
                <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
                  {formatPrice(total, settings.currency)}
                </span>
              </div>

              <div className="mt-stack-lg space-y-4">
                <Input
                  label="Адрес доставки"
                  placeholder="Улица, дом, квартира"
                  icon={<Icon name="location_on" />}
                  error={errors.address?.message}
                  {...register("address")}
                />

                <Textarea
                  label="Комментарий"
                  rows={2}
                  placeholder="Пожелания к заказу..."
                  error={errors.comment?.message}
                  {...register("comment")}
                />
              </div>

              {errors.root && (
                <p className="mt-4 rounded-xl bg-error-container px-4 py-3 font-body-md text-on-error-container">
                  {errors.root.message}
                </p>
              )}
            </>
          )}
        </form>

        <div className="bg-surface-container-lowest p-margin-mobile shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <button
            type="submit"
            form="checkout-form"
            disabled={items.length === 0 || isSubmitting}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-primary font-headline-md text-on-primary shadow-lg transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Оформляем..." : "Заказать"}
          </button>
        </div>
      </div>
    </div>
  );
}
