"use client";

import { useState } from "react";
import { HeroSlider } from "./HeroSlider";
import type { Banner } from "@/types";

const SESSION_BANNERS_KEY = "teyva-session-banners";

/**
 * Keep hero banners stable for the browser tab session (reload-safe,
 * cleared when the tab is closed) — same isolation model as the catalog.
 */
export function SessionHeroSlider({ banners }: { banners: Banner[] }) {
  const [resolved] = useState(() => {
    if (typeof window === "undefined") return banners;
    try {
      const raw = sessionStorage.getItem(SESSION_BANNERS_KEY);
      if (raw) return JSON.parse(raw) as Banner[];
      sessionStorage.setItem(SESSION_BANNERS_KEY, JSON.stringify(banners));
    } catch {
      /* ignore */
    }
    return banners;
  });

  return <HeroSlider banners={resolved} />;
}
