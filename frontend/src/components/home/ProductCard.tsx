"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DishImage } from "@/components/home/DishImage";
import { Icon } from "@/components/ui/Icon";
import { formatPrice } from "@/lib/format";
import { mediaUrl } from "@/lib/config";
import { getDefaultVariant, resolvePrice, resolveWeight } from "@/lib/product";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  currency: string;
}

/** Catalog card — + opens the detail page so the user picks a portion there. */
export function ProductCard({ product, currency }: ProductCardProps) {
  const router = useRouter();
  const defaultVariant = getDefaultVariant(product);
  const price = resolvePrice(product, defaultVariant);
  const weight = resolveWeight(product, defaultVariant);
  const image = mediaUrl(product.image);
  const href = `/product/${product.slug}`;

  const goToDetail = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    router.push(href);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[24px] bg-surface-container-lowest shadow-elevation-1 transition-transform duration-200 active:scale-[0.98] md:rounded-3xl md:transition-shadow md:hover:shadow-elevation-2 md:active:scale-100">
      <Link href={href} className="flex flex-1 flex-col">
        <DishImage
          src={image}
          alt={product.name}
          zoomOnHover
          className="m-2 mb-0 rounded-t-[20px] md:m-0 md:rounded-none"
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
          <div className="mt-auto flex items-center justify-between pr-12">
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
          </div>
        </div>
      </Link>

      <button
        type="button"
        aria-label={`Выбрать порцию «${product.name}»`}
        onClick={goToDetail}
        className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_4px_12px_rgba(254,129,40,0.35)] transition-all duration-200 hover:bg-primary/90 active:scale-90 md:bottom-6 md:right-6 md:h-12 md:w-12"
      >
        <Icon name="add" />
      </button>
    </article>
  );
}
