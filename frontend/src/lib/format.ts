/** Formats a numeric/string amount as an integer price with a currency suffix. */
export function formatPrice(amount: number | string, currency = "сом"): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  const rounded = Number.isFinite(value) ? Math.round(value) : 0;
  return `${rounded.toLocaleString("ru-RU")} ${currency}`;
}

/** Russian pluralization for item counts: 1 товар, 2 товара, 5 товаров. */
export function pluralizeItems(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} товар`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} товара`;
  return `${count} товаров`;
}
