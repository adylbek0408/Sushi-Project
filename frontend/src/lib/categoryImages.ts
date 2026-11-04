/**
 * Frontend-only category icons. Names/slugs/order still come from the API;
 * backend `image` is ignored on the storefront.
 */

const BY_SLUG: Record<string, string> = {
  "category-2": "/categories/category-sandwiches.jpg",
  "category-3": "/categories/category-hot.jpg",
  salaty: "/categories/category-salads.jpg",
  napitki: "/categories/category-drinks.jpg",
  category: "/categories/category-bowls.jpg",
  bowls: "/categories/category-bowls.jpg",
  sendvichi: "/categories/category-sandwiches.jpg",
  goryachie: "/categories/category-hot.jpg",
};

/** Normalize Russian/Latin category titles for fuzzy matching. */
function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/ё/g, "е");
}

const BY_NAME: Record<string, string> = {
  сэндвичи: "/categories/category-sandwiches.jpg",
  сендвичи: "/categories/category-sandwiches.jpg",
  sandwich: "/categories/category-sandwiches.jpg",
  sandwiches: "/categories/category-sandwiches.jpg",
  "горячие блюда": "/categories/category-hot.jpg",
  горячее: "/categories/category-hot.jpg",
  салаты: "/categories/category-salads.jpg",
  салат: "/categories/category-salads.jpg",
  напитки: "/categories/category-drinks.jpg",
  напиток: "/categories/category-drinks.jpg",
  боулы: "/categories/category-bowls.jpg",
  боул: "/categories/category-bowls.jpg",
  bowls: "/categories/category-bowls.jpg",
};

/** Resolve a local 3D icon for a category; null if no mapping. */
export function getCategoryImage(slug: string, name: string): string | null {
  if (BY_SLUG[slug]) return BY_SLUG[slug];
  const byName = BY_NAME[normalizeName(name)];
  if (byName) return byName;

  // Partial match: "Салаты дня" → салаты, etc.
  const normalized = normalizeName(name);
  for (const [key, path] of Object.entries(BY_NAME)) {
    if (normalized.includes(key) || key.includes(normalized)) return path;
  }
  return null;
}
