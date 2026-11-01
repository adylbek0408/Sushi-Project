"use client";

import { useState } from "react";
import { hasSessionQueryCache } from "@/lib/sessionQueryCache";

/**
 * SSR `initialData` only on the first visit of a browser tab session.
 * After that, React Query restores from sessionStorage (survives reload,
 * cleared when the tab is closed).
 */
export function useSessionBootstrapData<T>(ssrData: T): T | undefined {
  const [data] = useState(() =>
    typeof window !== "undefined" && hasSessionQueryCache() ? undefined : ssrData,
  );
  return data;
}
