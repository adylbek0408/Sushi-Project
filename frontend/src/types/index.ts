export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  sort_order: number;
  /** When true, products belong in the cart «Добавить к заказу» strip. */
  is_addon?: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  button_text: string;
  image: string | null;
  category: string | null;
  sort_order: number;
}

export interface ProductVariant {
  id: string;
  label: string;
  weight: number | null;
  price: string | number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  /** Lowest / default portion price when variants exist. */
  price: string | number;
  weight: number | null;
  image: string | null;
  is_popular: boolean;
  category: string;
  category_name: string;
  /** Portion sizes from API. Storefront always uses the large (~400 г) one. */
  variants?: ProductVariant[];
}

export interface ShopSettings {
  shop_name: string;
  whatsapp_number: string;
  currency: string;
  city: string;
  pickup_address: string;
  min_order_amount: string;
  delivery_is_free: boolean;
  delivery_fee: string;
  working_hours: string;
  is_accepting_orders: boolean;
}

export type DeliveryType = "delivery" | "pickup";

export interface OrderItemInput {
  product_id: string;
  variant_id?: string | null;
  quantity: number;
}

export interface CreateOrderPayload {
  delivery_type: DeliveryType;
  items: OrderItemInput[];
  customer_name?: string;
  phone?: string;
  address?: string;
  comment?: string;
}

export interface OrderItem {
  product_name: string;
  price: string;
  quantity: number;
  line_total: string;
}

export interface Order {
  id: string;
  number: number;
  delivery_type: DeliveryType;
  status: string;
  customer_name: string;
  phone: string;
  address: string;
  comment: string;
  total_amount: string;
  items: OrderItem[];
  created_at: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
