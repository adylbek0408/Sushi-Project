import type { MetadataRoute } from "next";
import { catalogApi } from "@/lib/api/catalog";
import { config } from "@/lib/config";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = config.siteUrl.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
  ];

  try {
    const products = await catalogApi.getProducts({});
    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${base}/product/${product.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
