"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { useCategories, useProducts } from "@/hooks/useCatalog";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { mediaUrl } from "@/lib/config";
import { getDefaultVariant, resolvePrice } from "@/lib/product";
import type { Product } from "@/types";

interface CartAddonsProps {
  currency: string;
}

/**
 * Horizontal «Добавить к заказу» strip — products from is_addon categories,
 * excluding anything already in the cart. Whole card is clickable.
 *
 * iOS notes: explicit card heights (aspect-ratio in overflow-x flex often
 * collapses on Safari); parent sheet must use min-h-0 for scroll.
 */
export function CartAddons({ currency }: CartAddonsProps) {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const { data: categories = [], isLoading: catsLoading } = useCategories();
  const { data: products = [], isLoading: productsLoading } = useProducts({});

  const inCartIds = useMemo(
    () => new Set(items.map((item) => item.productId)),
    [items],
  );

  const addons = useMemo(() => {
    const addonSlugs = new Set(
      categories.filter((c) => Boolean(c.is_addon)).map((c) => c.slug),
    );
    if (addonSlugs.size === 0) return [];
    return products.filter(
      (p) => addonSlugs.has(p.category) && !inCartIds.has(p.id),
    );
  }, [categories, products, inCartIds]);

  const loading = (catsLoading || productsLoading) && addons.length === 0;

  if (!loading && addons.length === 0) return null;

  return (
    <div className="pt-2">
      <h3 className="mb-3 font-headline-md text-[18px] text-on-surface">
        Добавить к заказу
      </h3>

      {loading ? (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-[220px] w-[140px] shrink-0 animate-pulse rounded-2xl bg-surface-container-high"
            />
          ))}
        </div>
      ) : (
        <div
          className="flex gap-3 overflow-x-auto overscroll-x-contain px-0.5 pb-2 [-webkit-overflow-scrolling:touch]"
          style={{ scrollbarWidth: "none" }}
        >
          {addons.map((product) => (
            <AddonCard
              key={product.id}
              product={product}
              currency={currency}
              onAdd={() =>
                addItem(product, getDefaultVariant(product), { isAddon: true })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AddonCard({
  product,
  currency,
  onAdd,
}: {
  product: Product;
  currency: string;
  onAdd: () => void;
}) {
  const image = mediaUrl(product.image);
  const price = resolvePrice(product, getDefaultVariant(product));

  return (
    <button
      type="button"
      onClick={onAdd}
      aria-label={`Добавить «${product.name}» к заказу`}
      className="flex w-[140px] shrink-0 flex-col rounded-2xl bg-white text-left shadow-sm ring-1 ring-black/5 transition-transform active:scale-[0.97]"
    >
      {/* Fixed height — iOS Safari often collapses aspect-ratio inside overflow-x flex */}
      <div className="relative h-[140px] w-[140px] shrink-0 overflow-hidden rounded-t-2xl bg-white">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="140px"
            className="object-contain object-center p-2"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon name="ramen_dining" className="text-2xl text-secondary" />
          </div>
        )}
      </div>
      <div className="flex min-h-[88px] flex-1 flex-col gap-2 p-2.5">
        <h4 className="line-clamp-2 min-h-[2.4em] font-body-md text-[13px] leading-snug text-on-surface">
          {product.name}
        </h4>
        <div className="mt-auto flex items-center justify-between gap-1">
          <span className="rounded-full bg-surface-container-high px-2.5 py-1 font-label-md text-[12px] text-on-surface">
            {formatPrice(price, currency)}
          </span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-on-surface text-white">
            <Icon name="add" className="text-[18px]" />
          </span>
        </div>
      </div>
    </button>
  );
}
