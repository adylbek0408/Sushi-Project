/** Single static hero promo (frontend-only, not from the API). */
export interface HeroBanner {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  tiers: { portions: string; percent: string }[];
}

export const HERO_BANNER: HeroBanner = {
  id: "volume-discount",
  eyebrow: "Акция",
  title: "Чем больше порций — тем выше скидка",
  subtitle: "Скидка на основные блюда. Салаты и напитки — без скидки.",
  image: "/banners/banner-discount-15.jpg",
  tiers: [
    { portions: "от 10", percent: "15%" },
    { portions: "от 30", percent: "20%" },
    { portions: "от 50", percent: "25%" },
  ],
};
