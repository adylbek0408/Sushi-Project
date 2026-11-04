"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { PortionPicker } from "@/components/home/PortionPicker";
import { useCategories, useProducts } from "@/hooks/useCatalog";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { mediaUrl } from "@/lib/config";
import {
  getDefaultVariant,
  getVariants,
  resolvePrice,
} from "@/lib/product";
import type { Product } from "@/types";

interface CartAddonsProps {
  currency: string;
}

/**
 * Horizontal «Добавить к заказу» strip — products from is_addon categories,
 * excluding anything already in the cart. Whole card is clickable.
 */
export function CartAddons({ currency }: CartAddonsProps) {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const { data: categories = [] } = useCategories();
  const { data: products = [] } = useProducts({});
  const [picking, setPicking] = useState<Product | null>(null);
  const [variantId, setVariantId] = useState("");

  const inCartIds = useMemo(
    () => new Set(items.map((item) => item.productId)),
    [items],
  );

  const addons = useMemo(() => {
    const addonSlugs = new Set(
      categories.filter((c) => c.is_addon).map((c) => c.slug),
    );
    return products.filter(
      (p) => addonSlugs.has(p.category) && !inCartIds.has(p.id),
    );
  }, [categories, products, inCartIds]);

  if (addons.length === 0) return null;

  const handleAdd = (product: Product) => {
    const variants = getVariants(product);
    if (variants.length > 1) {
      setPicking(product);
      setVariantId(variants[0]?.id ?? "");
      return;
    }
    addItem(product, getDefaultVariant(product), { isAddon: true });
  };

  const confirmVariant = () => {
    if (!picking) return;
    const variants = getVariants(picking);
    const selected =
      variants.find((v) => v.id === variantId) ?? getDefaultVariant(picking);
    addItem(picking, selected, { isAddon: true });
    setPicking(null);
  };

  return (
    <div className="pt-2">
      <h3 className="mb-3 font-headline-md text-[18px] text-on-surface">
        Добавить к заказу
      </h3>
      <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {addons.map((product) => (
          <AddonCard
            key={product.id}
            product={product}
            currency={currency}
            onAdd={() => handleAdd(product)}
          />
        ))}
      </div>

      {picking ? (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center overlay-blur md:items-center"
          onClick={() => setPicking(null)}
        >
          <div
            className="w-full max-w-md rounded-t-[28px] bg-surface-container-lowest p-6 shadow-elevation-2 md:rounded-[28px]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Выбор порции"
          >
            <h4 className="mb-4 font-headline-md text-headline-md">{picking.name}</h4>
            <PortionPicker
              variants={getVariants(picking)}
              value={variantId}
              onChange={setVariantId}
              currency={currency}
            />
            <button
              type="button"
              onClick={confirmVariant}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-label-md text-on-primary"
            >
              <Icon name="add" />
              Добавить
            </button>
          </div>
        </div>
      ) : null}
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
      className="flex w-[140px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-black/5 transition-transform active:scale-[0.97]"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        <div className="absolute inset-[4%]" aria-hidden>
          <Image
            src="/dish-bg.png"
            alt=""
            fill
            sizes="140px"
            className="object-contain object-center"
          />
        </div>
        {image ? (
          <div className="absolute inset-[10%]">
            <Image
              src={image}
              alt=""
              fill
              sizes="140px"
              className="object-contain object-center"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon name="ramen_dining" className="text-2xl text-secondary" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-2.5">
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
