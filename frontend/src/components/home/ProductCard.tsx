"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatPrice } from "@/lib/format";
import { mediaUrl } from "@/lib/config";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  currency: string;
}

export function ProductCard({ product, currency }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const image = mediaUrl(product.image);

  const handleAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    addItem(product);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[24px] bg-surface-container-lowest shadow-elevation-1 transition-transform duration-200 active:scale-[0.98] md:rounded-3xl md:transition-shadow md:hover:shadow-elevation-2 md:active:scale-100">
      <Link href={`/product/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative m-2 mb-0 aspect-[4/3] overflow-hidden rounded-t-[20px] md:m-0 md:aspect-square md:rounded-none">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 320px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-container">
              <Icon name="ramen_dining" className="text-4xl text-secondary" />
            </div>
          )}
        </div>

        <div className="relative flex flex-1 flex-col p-4 md:p-6">
          <h3 className="mb-2 font-headline-md text-[16px] leading-tight text-on-surface md:text-headline-md">
            {product.name}
          </h3>
          {product.description && (
            <p className="mb-4 line-clamp-2 flex-1 font-body-md text-[13px] leading-relaxed text-secondary md:text-body-md">
              {product.description}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-headline-md text-lg text-on-surface md:text-primary">
                {formatPrice(product.price, currency)}
              </span>
              {product.weight ? (
                <span className="mt-1 font-label-md text-label-sm text-tertiary-container">
                  {product.weight} г
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </Link>

      <button
        type="button"
        aria-label={`Добавить «${product.name}» в корзину`}
        onClick={handleAdd}
        className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_4px_12px_rgba(254,129,40,0.35)] transition-all duration-200 hover:bg-primary/90 active:scale-90 md:bottom-6 md:right-6 md:h-12 md:w-12"
      >
        <Icon name="add" />
      </button>
    </article>
  );
}
