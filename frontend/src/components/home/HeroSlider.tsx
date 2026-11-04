"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { HERO_SLIDES } from "@/lib/banners";
import { clsx } from "@/lib/clsx";

const AUTOPLAY_MS = 2500;
const SWIPE_THRESHOLD = 40;

export function HeroSlider() {
  const slides = HERO_SLIDES;
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const pointerStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActive(((index % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    const id = window.setInterval(() => {
      setActive((prevIndex) => (prevIndex + 1) % count);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [count, paused]);

  const handleTouchStart = (event: React.TouchEvent) => {
    setPaused(true);
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta < 0) next();
      else prev();
    }
    touchStartX.current = null;
    window.setTimeout(() => setPaused(false), AUTOPLAY_MS);
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === "touch") return;
    setPaused(true);
    pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    const delta = event.clientX - pointerStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta < 0) next();
      else prev();
    }
    pointerStartX.current = null;
    window.setTimeout(() => setPaused(false), AUTOPLAY_MS);
  };

  return (
    <section className="px-margin-mobile pt-4 md:px-0 md:pt-8">
      <div
        className="relative h-[220px] w-full cursor-grab overflow-hidden rounded-[24px] bg-surface-container-high shadow-elevation-1 active:cursor-grabbing md:h-[400px] md:rounded-3xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          pointerStartX.current = null;
          setPaused(false);
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={slide.id} className="relative h-full w-full shrink-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="(min-width: 768px) 100vw, 100vw"
                className="object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
              <div className="relative z-10 flex h-full max-w-2xl flex-col justify-center gap-2 px-5 md:gap-3 md:px-12">
                <p className="font-label-md text-[12px] uppercase tracking-wide text-primary md:text-label-md">
                  Акция
                </p>
                <h2 className="max-w-[260px] font-headline-lg-mobile text-headline-lg-mobile text-white md:max-w-xl md:text-display-lg md:font-display-lg">
                  {slide.title}
                </h2>
                <p className="hidden max-w-md text-body-lg text-white/90 md:block">
                  {slide.subtitle}
                </p>
                <p className="max-w-[240px] text-[13px] leading-snug text-white/85 md:hidden">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:bottom-5">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Перейти к слайду ${index + 1}`}
              aria-current={index === active}
              onClick={() => {
                goTo(index);
                setPaused(true);
                window.setTimeout(() => setPaused(false), AUTOPLAY_MS);
              }}
              className={clsx(
                "h-2 rounded-full transition-all duration-300",
                index === active ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
