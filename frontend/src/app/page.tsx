import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { Catalog } from "@/components/home/Catalog";
import { getStorefrontData } from "@/lib/api/server";
import { config } from "@/lib/config";

export default async function HomePage() {
  const { categories, products, settings } = await getStorefrontData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: settings.shop_name,
    servesCuisine: "Японская кухня, суши",
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.city,
      streetAddress: settings.pickup_address,
    },
    url: config.siteUrl,
    openingHours: settings.working_hours,
  };

  return (
    <StorefrontShell settings={settings}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div id="menu" className="scroll-mt-20 pt-2 md:pt-4">
        <Catalog
          initialCategories={categories}
          initialProducts={products}
          settings={settings}
        />
      </div>
      <div className="h-stack-lg" />
    </StorefrontShell>
  );
}
