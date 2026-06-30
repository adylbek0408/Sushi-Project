"use client";

import { useMemo } from "react";
import { CategoryScroller } from "./CategoryScroller";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Icon } from "@/components/ui/Icon";
import { useCategories, useProducts } from "@/hooks/useCatalog";
import { useCatalogStore } from "@/store/catalog";
import type { Category, Product, ShopSettings } from "@/types";

interface CatalogProps {
  initialCategories: Category[];
  initialProducts: Product[];
  settings: ShopSettings;
}

export function Catalog({ initialCategories, initialProducts, settings }: CatalogProps) {
  const selectedSlug = useCatalogStore((s) => s.selectedSlug);
  const setSelectedSlug = useCatalogStore((s) => s.setSelectedSlug);

  const { data: categories = initialCategories } = useCategories(initialCategories);
  const { data: products, isFetching } = useProducts(
    selectedSlug ? { category: selectedSlug } : {},
    selectedSlug ? undefined : initialProducts,
  );

  const heading = useMemo(() => {
    if (!selectedSlug) return "Популярное";
    return categories.find((c) => c.slug === selectedSlug)?.name ?? "Меню";
  }, [selectedSlug, categories]);

  const list = products ?? [];

  return (
    <>
      <CategoryScroller
        categories={categories}
        selectedSlug={selectedSlug}
        onSelect={setSelectedSlug}
      />

      <section className="mt-stack-lg px-margin-mobile md:px-0">
        <h2 className="mb-stack-md font-headline-md text-headline-md text-on-surface md:mb-8 md:text-headline-lg md:font-headline-lg">
          {heading}
        </h2>

        {isFetching && list.length === 0 ? (
          <ProductGridSkeleton />
        ) : list.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
            {list.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={settings.currency}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[24px] bg-surface-container-lowest p-2 shadow-elevation-1">
          <Skeleton className="aspect-[4/3] w-full rounded-[20px]" />
          <div className="space-y-2 p-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-3xl bg-surface-container-low py-16 text-center">
      <Icon name="search_off" className="text-4xl text-secondary" />
      <p className="font-body-md text-secondary">В этой категории пока нет блюд.</p>
    </div>
  );
}
