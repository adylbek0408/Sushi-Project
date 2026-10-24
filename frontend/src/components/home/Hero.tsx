"use client";

import { Button } from "@/components/ui/Button";

interface HeroProps {
  onCtaClick?: () => void;
}

export function Hero({ onCtaClick }: HeroProps) {
  const handleClick = () => {
    if (onCtaClick) {
      onCtaClick();
      return;
    }
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="px-margin-mobile pt-4 md:px-0 md:pt-8">
      <div className="relative flex h-[220px] w-full items-center overflow-hidden rounded-[24px] bg-surface-container-high shadow-elevation-1 md:h-[400px] md:rounded-3xl">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/60 to-transparent md:from-surface/90 md:via-surface/70 md:to-transparent" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#FF9A4A_0%,#FE8128_45%,#C45F12_100%)] md:opacity-90"
        />
        <div className="relative z-10 flex h-full flex-col justify-center gap-3 px-6 md:max-w-2xl md:px-12">
          <h1 className="max-w-[220px] font-headline-lg-mobile text-headline-lg-mobile text-white md:max-w-none md:text-display-lg md:font-display-lg">
            Свежие роллы
            <br className="hidden md:inline" /> за 30 минут
          </h1>
          <p className="hidden max-w-md text-body-lg text-white/90 md:block">
            Премиальные ингредиенты, быстрая доставка. Наслаждайтесь вкусом
            настоящей Японии.
          </p>
          <Button
            variant="primary"
            onClick={handleClick}
            className="w-fit bg-white text-primary hover:bg-white/90 md:bg-primary md:text-on-primary md:hover:bg-primary/90"
          >
            Заказать
          </Button>
        </div>
      </div>
    </section>
  );
}
