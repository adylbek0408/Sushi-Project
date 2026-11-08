/** Single static hero promo (frontend-only, not from the API). */
export interface HeroBanner {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
}

export const HERO_BANNER: HeroBanner = {
  id: "free-delivery",
  eyebrow: "Доставка",
  title: "Заказ от 7 порций — доставка бесплатно",
  subtitle: "Собери корзину из семи порций и мы привезём заказ без оплаты доставки.",
  image: "/banners/banner-discount-15.jpg",
};
