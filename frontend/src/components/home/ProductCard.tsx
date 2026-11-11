"use client";

import { useState } from "react";
import { DishImage } from "@/components/home/DishImage";
import { Icon } from "@/components/ui/Icon";
import { formatPrice } from "@/lib/format";
import { mediaUrl } from "@/lib/config";
import { isOutOfStock } from "@/lib/outOfStock";
import {
  getDefaultVariant,
  resolvePrice,
  resolveWeight,
} from "@/lib/product";
import { useCartStore } from "@/store/cart";
import { useUiStore } from "@/store/ui";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  currency: string;
}

/** Catalog card — tap adds the large portion and opens the cart. */
export function ProductCard({ product, currency }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCheckout = useUiStore((s) => s.openCheckout);
  const [justAdded, setJustAdded] = useState(false);
  const unavailable = isOutOfStock(product);

  const variant = getDefaultVariant(product);
  const price = resolvePrice(product, variant);
  const weight = resolveWeight(product, variant);
  const image = mediaUrl(product.image);

  const handleAdd = () => {
    if (unavailable) return;
    addItem(product, variant);
    setJustAdded(true);
    openCheckout();
    window.setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[24px] bg-surface-container-lowest shadow-elevation-1 transition-transform duration-200 active:scale-[0.98] md:rounded-3xl md:transition-shadow md:hover:shadow-elevation-2 md:active:scale-100">
      <div
        role={unavailable ? undefined : "button"}
        tabIndex={unavailable ? undefined : 0}
        onClick={unavailable ? undefined : handleAdd}
        onKeyDown={
          unavailable
            ? undefined
            : (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleAdd();
                }
              }
        }
        aria-label={
          unavailable
            ? `«${product.name}» — нет в наличии`
            : `Добавить «${product.name}» в корзину`
        }
        className={`flex flex-1 flex-col text-left ${unavailable ? "cursor-default" : "cursor-pointer"}`}
      >
        <DishImage
          src={image}
          alt={product.name}
          zoomOnHover={!unavailable}
          className="rounded-t-[20px] md:rounded-none"
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 320px"
        />

        <div className="relative flex flex-1 flex-col p-4 md:p-6">
          <h3 className="mb-2 font-headline-md text-[16px] leading-tight text-on-surface md:text-headline-md">
            {product.name}
          </h3>
          {product.description && (
            <p className="mb-4 line-clamp-2 flex-1 font-body-md text-[13px] leading-relaxed text-secondary md:text-body-md">
              {product.description}
            </p>
          )}
          <div className={`mt-auto flex flex-col ${unavailable ? "gap-3" : "pr-12"}`}>
            <div className="flex flex-col">
              <span className="font-headline-md text-lg text-on-surface md:text-primary">
                {formatPrice(price, currency)}
              </span>
              {weight ? (
                <span className="mt-1 font-label-md text-label-sm text-tertiary-container">
                  {weight} г
                </span>
              ) : null}
            </div>
            {unavailable ? (
              <span className="inline-flex w-fit rounded-md bg-gray-500 px-2.5 py-1.5 font-label-md text-[11px] leading-none text-white md:text-[12px]">
                Нет в наличии
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {!unavailable ? (
        <button
          type="button"
          aria-label={`Добавить «${product.name}» в корзину`}
          onClick={(event) => {
            event.stopPropagation();
            handleAdd();
          }}
          className="absolute bottom-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_4px_12px_rgba(254,129,40,0.35)] transition-all duration-200 hover:bg-primary/90 active:scale-90 md:bottom-6 md:right-6 md:h-12 md:w-12"
        >
          <Icon name={justAdded ? "check" : "add"} />
        </button>
      ) : null}
    </article>
  );
}
