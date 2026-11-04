import type { CartItem } from "@/store/cart";
import type { DeliveryType } from "@/types";
import { formatPrice } from "./format";

export interface WhatsAppOrderData {
  deliveryType?: DeliveryType;
  items: CartItem[];
  /** Final amount after discount (what the customer pays for food). */
  total: number;
  subtotal?: number;
  discountPercent?: number;
  currency: string;
  address?: string;
  customerName?: string;
  phone?: string;
  comment?: string;
}

/**
 * Builds the human-readable order message that is pre-filled into WhatsApp.
 * Output mirrors the format requested by the business.
 */
export function buildWhatsAppMessage(data: WhatsAppOrderData): string {
  const lines: string[] = [];
  lines.push("Новый заказ");
  lines.push("");
  lines.push("Способ получения:");
  lines.push("Доставка");
  lines.push("");

  lines.push("Имя:");
  lines.push(data.customerName?.trim() || "—");
  lines.push("");
  lines.push("Телефон:");
  lines.push(data.phone?.trim() || "—");
  lines.push("");

  lines.push("Адрес:");
  lines.push(data.address?.trim() || "—");
  lines.push("");

  if (data.comment?.trim()) {
    lines.push("Комментарий:");
    lines.push(data.comment.trim());
    lines.push("");
  }

  lines.push("Товары:");
  for (const item of data.items) {
    const label = item.variantLabel ? ` — порция: ${item.variantLabel}` : "";
    lines.push(`${item.name}${label} ×${item.quantity}`);
  }
  lines.push("");

  if (data.discountPercent && data.discountPercent > 0 && data.subtotal != null) {
    lines.push(`Сумма без скидки: ${formatPrice(data.subtotal, data.currency)}`);
    lines.push(`Скидка: ${data.discountPercent}%`);
    lines.push(`Итого со скидкой: ${formatPrice(data.total, data.currency)}`);
  } else {
    lines.push("Итого:");
    lines.push(formatPrice(data.total, data.currency));
  }

  return lines.join("\n");
}

/** Builds the wa.me deep link with the URL-encoded message. */
export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const sanitizedNumber = phoneNumber.replace(/[^\d]/g, "");
  return `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(message)}`;
}
