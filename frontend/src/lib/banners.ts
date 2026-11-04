/** Static hero promo slides (frontend-only, not from the API). */
export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "discount-15",
    title: "От 10 порций — скидка 15%",
    subtitle:
      "Собирайте заказ на компанию: уже с десятой порции действует скидка 15%.",
    image: "/banners/banner-discount-15.jpg",
  },
  {
    id: "discount-20",
    title: "От 30 порций — скидка 20%",
    subtitle:
      "Для офиса, праздника или большого застолья — чем больше порций, тем выгоднее.",
    image: "/banners/banner-discount-20.jpg",
  },
  {
    id: "discount-25",
    title: "От 50 порций — скидка 25%",
    subtitle:
      "Максимальная выгода на крупный заказ: 50+ порций — и скидка уже 25%.",
    image: "/banners/banner-discount-25.jpg",
  },
];
