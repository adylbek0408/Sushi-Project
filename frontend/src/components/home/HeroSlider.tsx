"use client";

import Image from "next/image";
import { HERO_BANNER } from "@/lib/banners";

/** Promo banner — free delivery from 7 portions. */
export function HeroSlider() {
  const banner = HERO_BANNER;

  return (
    <section className="px-margin-mobile pt-4 md:px-0 md:pt-8">
      <div className="relative h-[240px] w-full overflow-hidden rounded-[24px] bg-surface-container-high shadow-elevation-1 md:h-[380px] md:rounded-3xl">
        <Image
          src={banner.image}
          alt={banner.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/15" />

        <div className="relative z-10 flex h-full flex-col justify-center gap-3 px-5 md:max-w-2xl md:gap-5 md:px-12">
          <p className="font-label-md text-[12px] uppercase tracking-wide text-primary md:text-label-md">
            {banner.eyebrow}
          </p>
          <h2 className="max-w-[300px] font-headline-lg-mobile text-headline-lg-mobile text-white md:max-w-xl md:text-display-lg md:font-display-lg">
            {banner.title}
          </h2>
          <p className="max-w-[280px] text-[13px] leading-snug text-white/85 md:max-w-md md:text-body-lg md:text-white/90">
            {banner.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
