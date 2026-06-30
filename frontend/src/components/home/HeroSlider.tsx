"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Hero } from "./Hero";
import { useCatalogStore } from "@/store/catalog";
import { mediaUrl } from "@/lib/config";
import { clsx } from "@/lib/clsx";
import type { Banner } from "@/types";

const AUTOPLAY_MS = 3000;
const SWIPE_THRESHOLD = 40;

interface HeroSliderProps {
  banners: Banner[];
}

export function HeroSlider({ banners }: HeroSliderProps) {
  const setSelectedSlug = useCatalogStore((s) => s.setSelectedSlug);
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const count = banners.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActive(((index % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (count <= 1) return;
    const id = window.setInterval(
      () => setActive((prev) => (prev + 1) % count),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(id);
  }, [count]);

  if (count === 0) {
    return <Hero />;
  }

  const handleCta = (banner: Banner) => {
    setSelectedSlug(banner.category ?? null);
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      goTo(active + (delta < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  return (
    <section className="px-margin-mobile pt-4 md:px-0 md:pt-8">
      <div
        className="relative h-[220px] w-full overflow-hidden rounded-[24px] bg-surface-container-high shadow-elevation-1 md:h-[400px] md:rounded-3xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {banners.map((banner, index) => {
            const src = mediaUrl(banner.image);
            return (
              <div key={banner.id} className="relative h-full w-full shrink-0">
                {src ? (
                  <Image
                    src={src}
                    alt={banner.title}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 768px) 100vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#d93717_0%,#b41f00_45%,#7a1500_100%)]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                <div className="relative z-10 flex h-full max-w-2xl flex-col justify-center gap-3 px-6 md:px-12">
                  <h2 className="max-w-[240px] font-headline-lg-mobile text-headline-lg-mobile text-white md:max-w-none md:text-display-lg md:font-display-lg">
                    {banner.title}
                  </h2>
                  {banner.subtitle ? (
                    <p className="hidden max-w-md text-body-lg text-white/90 md:block">
                      {banner.subtitle}
                    </p>
                  ) : null}
                  <Button
                    variant="primary"
                    onClick={() => handleCta(banner)}
                    className="w-fit bg-white text-primary hover:bg-white/90 md:bg-primary md:text-on-primary md:hover:bg-primary/90"
                  >
                    {banner.button_text}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {count > 1 ? (
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:bottom-5">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                aria-label={`Перейти к слайду ${index + 1}`}
                aria-current={index === active}
                onClick={() => goTo(index)}
                className={clsx(
                  "h-2 rounded-full transition-all duration-300",
                  index === active ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
