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

interface ProductSection {
  slug: string;
  name: string;
  products: Product[];
}

export function Catalog({ initialCategories, initialProducts, settings }: CatalogProps) {
  const selectedSlug = useCatalogStore((s) => s.selectedSlug);
  const setSelectedSlug = useCatalogStore((s) => s.setSelectedSlug);

  const { data: categories = initialCategories } = useCategories(initialCategories);
  const { data: allProducts = initialProducts, isFetching } = useProducts(
    {},
    initialProducts,
  );

  /** "Все" → sections by category; single tab → one section. */
  const sections = useMemo((): ProductSection[] => {
    if (selectedSlug) {
      const category = categories.find((c) => c.slug === selectedSlug);
      const products = allProducts.filter((p) => p.category === selectedSlug);
      return [
        {
          slug: selectedSlug,
          name: category?.name ?? "Меню",
          products,
        },
      ];
    }

    const bySlug = new Map<string, Product[]>();
    for (const product of allProducts) {
      const list = bySlug.get(product.category) ?? [];
      list.push(product);
      bySlug.set(product.category, list);
    }

    const ordered: ProductSection[] = [];
    for (const category of categories) {
      const products = bySlug.get(category.slug);
      if (!products?.length) continue;
      ordered.push({
        slug: category.slug,
        name: category.name,
        products,
      });
      bySlug.delete(category.slug);
    }

    // Products whose category is missing from the active list
    for (const [slug, products] of bySlug) {
      if (!products.length) continue;
      ordered.push({
        slug,
        name: products[0]?.category_name || "Другое",
        products,
      });
    }

    return ordered;
  }, [allProducts, categories, selectedSlug]);

  const isEmpty = sections.every((section) => section.products.length === 0);

  return (
    <>
      <CategoryScroller
        categories={categories}
        selectedSlug={selectedSlug}
        onSelect={setSelectedSlug}
      />

      <section className="mt-stack-lg px-margin-mobile md:px-0">
        {isFetching && isEmpty ? (
          <ProductGridSkeleton />
        ) : isEmpty ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-stack-lg md:gap-10">
            {sections.map((section) => (
              <div key={section.slug}>
                <h2 className="mb-stack-md font-headline-md text-headline-md text-on-surface md:mb-6 md:text-headline-lg md:font-headline-lg">
                  {section.name}
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
                  {section.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      currency={settings.currency}
                    />
                  ))}
                </div>
              </div>
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
          <Skeleton className="aspect-square w-full rounded-[20px]" />
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
