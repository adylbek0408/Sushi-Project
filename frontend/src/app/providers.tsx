"use client";

import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createSessionQueryClient,
  persistSessionQueryClient,
} from "@/lib/sessionQueryCache";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createSessionQueryClient());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedulePersist = () => {
      clearTimeout(timer);
      timer = setTimeout(() => persistSessionQueryClient(queryClient), 100);
    };

    // Seed storage after first paint (SSR bootstrap → cache).
    schedulePersist();

    const unsubscribe = queryClient.getQueryCache().subscribe(schedulePersist);
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
