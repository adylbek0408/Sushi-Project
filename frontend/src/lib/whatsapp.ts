import type { CartItem } from "@/store/cart";
import type { DeliveryType } from "@/types";
import { formatPrice } from "./format";

export interface WhatsAppOrderData {
  deliveryType: DeliveryType;
  items: CartItem[];
  total: number;
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
  lines.push(data.deliveryType === "delivery" ? "Доставка" : "Самовывоз");
  lines.push("");

  if (data.deliveryType === "delivery") {
    lines.push("Адрес:");
    lines.push(data.address?.trim() || "—");
  } else {
    lines.push("Имя:");
    lines.push(data.customerName?.trim() || "—");
    lines.push("");
    lines.push("Телефон:");
    lines.push(data.phone?.trim() || "—");
  }
  lines.push("");

  if (data.comment?.trim()) {
    lines.push("Комментарий:");
    lines.push(data.comment.trim());
    lines.push("");
  }

  lines.push("Товары:");
  for (const item of data.items) {
    lines.push(`${item.name} ×${item.quantity}`);
  }
  lines.push("");

  lines.push("Итого:");
  lines.push(formatPrice(data.total, data.currency));

  return lines.join("\n");
}

/** Builds the wa.me deep link with the URL-encoded message. */
export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const sanitizedNumber = phoneNumber.replace(/[^\d]/g, "");
  return `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(message)}`;
}
