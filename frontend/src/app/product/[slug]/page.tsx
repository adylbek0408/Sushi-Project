import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { AddToCartButton } from "@/components/home/AddToCartButton";
import { DishImage } from "@/components/home/DishImage";
import { Icon } from "@/components/ui/Icon";
import { catalogApi } from "@/lib/api/catalog";
import { getSettingsSafe } from "@/lib/api/server";
import { ApiError } from "@/lib/api/client";
import { config, mediaUrl } from "@/lib/config";
import { getDefaultVariant, resolvePrice } from "@/lib/product";
import type { Product } from "@/types";

export const revalidate = 60;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function loadProduct(slug: string): Promise<Product | null> {
  try {
    return await catalogApi.getProduct(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) return { title: "Блюдо не найдено" };

  return {
    title: product.name,
    description: product.description || `${product.name} — заказать с доставкой.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: mediaUrl(product.image) ? [{ url: mediaUrl(product.image) as string }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([loadProduct(slug), getSettingsSafe()]);

  if (!product) notFound();

  const defaultVariant = getDefaultVariant(product);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: mediaUrl(product.image) ?? undefined,
    offers: {
      "@type": "Offer",
      price: resolvePrice(product, defaultVariant),
      priceCurrency: "KGS",
      availability: "https://schema.org/InStock",
      url: `${config.siteUrl}/product/${product.slug}`,
    },
  };

  return (
    <StorefrontShell settings={settings} withSidebar={false}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="px-margin-mobile pb-40 pt-4 md:px-0 md:pb-8 md:pt-8">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 font-label-md text-label-md text-secondary transition-colors hover:text-primary"
        >
          <Icon name="arrow_back" className="text-[18px]" />
          Назад в меню
        </Link>

        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <DishImage
            src={mediaUrl(product.image)}
            alt={product.name}
            priority
            className="rounded-3xl"
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          <div className="flex flex-col gap-4 md:min-h-0">
            <span className="font-label-md text-label-md uppercase text-secondary">
              {product.category_name}
            </span>
            <h1 className="font-headline-lg text-headline-lg-mobile text-on-surface md:text-headline-lg">
              {product.name}
            </h1>
            {product.description && (
              <p className="font-body-lg text-on-surface-variant">
                {product.description}
              </p>
            )}

            <div className="pt-4 md:mt-auto md:pt-8">
              <AddToCartButton product={product} currency={settings.currency} />
            </div>
          </div>
        </div>
      </div>
    </StorefrontShell>
  );
}
