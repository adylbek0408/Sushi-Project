import type { Category, Product } from "@/types";

/** Teyva / Din-Din public catalog shapes (https://api.teyva.us). */
export interface TeyvaCategory {
  id: string;
  name: string;
  sort_order: number;
  photo_url: string | null;
}

export interface TeyvaProduct {
  id: string;
  kitchen_id: string;
  category_id: string;
  name: string;
  description: string;
  photo_url: string | null;
  weight_grams: number | null;
  /** Minor units (тыйын): 26000 → 260 сом. */
  price_amount: number;
  tags: string[];
  is_active: boolean;
  is_addon: boolean;
  is_recommended: boolean;
}

/** API stores money in тыйын (1 сом = 100). */
export function fromMinorUnits(amount: number): string {
  return (amount / 100).toFixed(2);
}

export function mapCategory(raw: TeyvaCategory): Category {
  return {
    id: raw.id,
    name: raw.name,
    // No slug in Teyva API — use id for filters and routes.
    slug: raw.id,
    image: raw.photo_url,
    sort_order: raw.sort_order,
  };
}

export function mapProduct(
  raw: TeyvaProduct,
  categoryNameById: Map<string, string>,
): Product {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.id,
    description: raw.description ?? "",
    price: fromMinorUnits(raw.price_amount),
    weight: raw.weight_grams,
    image: raw.photo_url,
    is_popular: raw.is_recommended,
    category: raw.category_id,
    category_name: categoryNameById.get(raw.category_id) ?? "",
  };
}
