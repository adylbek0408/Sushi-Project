import type { Metadata } from "next";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { SearchView } from "@/components/search/SearchView";
import { getSettingsSafe } from "@/lib/api/server";

export const metadata: Metadata = {
  title: "Поиск",
  robots: { index: false, follow: false },
};

export default async function SearchPage() {
  const settings = await getSettingsSafe();

  return (
    <StorefrontShell settings={settings} withSidebar={false}>
      <SearchView settings={settings} />
    </StorefrontShell>
  );
}
