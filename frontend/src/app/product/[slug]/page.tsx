import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { AddToCartButton } from "@/components/home/AddToCartButton";
import { Icon } from "@/components/ui/Icon";
import { catalogApi } from "@/lib/api/catalog";
import { getSettingsSafe } from "@/lib/api/server";
import { ApiError } from "@/lib/api/client";
import { formatPrice } from "@/lib/format";
import { config, mediaUrl } from "@/lib/config";
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: mediaUrl(product.image) ?? undefined,
    offers: {
      "@type": "Offer",
      price: Number(product.price),
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
      <div className="px-margin-mobile pt-4 md:px-0 md:pt-8">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 font-label-md text-label-md text-secondary transition-colors hover:text-primary"
        >
          <Icon name="arrow_back" className="text-[18px]" />
          Назад в меню
        </Link>

        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-surface-container">
            {mediaUrl(product.image) ? (
              <Image
                src={mediaUrl(product.image) as string}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Icon name="ramen_dining" className="text-6xl text-secondary" />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="font-label-md text-label-md uppercase text-secondary">
              {product.category_name}
            </span>
            <h1 className="mt-2 font-headline-lg text-headline-lg-mobile text-on-surface md:text-headline-lg">
              {product.name}
            </h1>
            {product.weight ? (
              <span className="mt-1 font-body-md text-secondary">{product.weight} г</span>
            ) : null}
            {product.description && (
              <p className="mt-4 font-body-lg text-on-surface-variant">
                {product.description}
              </p>
            )}

            <div className="mt-auto pt-8">
              <div className="mb-4 font-display-lg text-headline-lg text-primary">
                {formatPrice(product.price, settings.currency)}
              </div>
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>
    </StorefrontShell>
  );
}
