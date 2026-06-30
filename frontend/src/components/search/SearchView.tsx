"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/home/ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { catalogApi } from "@/lib/api/catalog";
import type { ShopSettings } from "@/types";

interface SearchViewProps {
  settings: ShopSettings;
}

export function SearchView({ settings }: SearchViewProps) {
  const [term, setTerm] = useState("");
  const trimmed = term.trim();

  const { data, isFetching } = useQuery({
    queryKey: ["search", trimmed],
    queryFn: () => catalogApi.getProducts({ search: trimmed }),
    enabled: trimmed.length >= 2,
    staleTime: 60 * 1000,
  });

  return (
    <div className="px-margin-mobile pt-4 md:px-0 md:pt-8">
      <div className="relative mb-stack-lg">
        <Icon
          name="search"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary"
        />
        <input
          type="search"
          autoFocus
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Поиск блюд…"
          className="h-14 w-full rounded-xl border-none bg-surface-container-low pl-12 pr-4 font-body-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30"
        />
      </div>

      {trimmed.length < 2 ? (
        <p className="py-10 text-center font-body-md text-secondary">
          Введите минимум 2 символа для поиска
        </p>
      ) : isFetching ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full rounded-[24px]" />
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
          {data.map((product) => (
            <ProductCard key={product.id} product={product} currency={settings.currency} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <Icon name="search_off" className="text-4xl text-secondary" />
          <p className="font-body-md text-secondary">Ничего не найдено</p>
        </div>
      )}
    </div>
  );
}
