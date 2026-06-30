"use client";

import { useEffect, useState } from "react";

/**
 * Returns true only after the first client render, so components reading
 * from persisted (localStorage) stores avoid SSR hydration mismatches.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
