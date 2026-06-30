/**
 * Runtime configuration. `apiBaseUrl` differs between the browser (public)
 * and the Node server (internal Docker network) for SSR/ISR fetches.
 */
const isServer = typeof window === "undefined";

const publicApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const internalApiUrl = process.env.INTERNAL_API_URL ?? publicApiUrl;

export const config = {
  apiBaseUrl: isServer ? internalApiUrl : publicApiUrl,
  publicApiUrl,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  apiVersionPrefix: "/api/v1",
} as const;

export function apiUrl(path: string): string {
  const base = config.apiBaseUrl.replace(/\/$/, "");
  return `${base}${config.apiVersionPrefix}${path}`;
}

/**
 * Resolves a media path returned by the API. The API returns relative paths
 * like "/media/products/x.jpg"; we prefix the public (browser-facing) host so
 * images load both in the browser and during SSR.
 */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = config.publicApiUrl.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
