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
  /**
   * Teyva prod API (`api.teyva.us`) has no `/api/v1` prefix.
   * Local Django Sushiya stack still uses `/api/v1` when NEXT_PUBLIC_API_PREFIX is set.
   */
  apiVersionPrefix: process.env.NEXT_PUBLIC_API_PREFIX ?? "",
} as const;

export function apiUrl(path: string): string {
  const base = config.apiBaseUrl.replace(/\/$/, "");
  const prefix = config.apiVersionPrefix.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${prefix}${normalized}`;
}

/**
 * Resolves a media path returned by the API. Absolute URLs pass through;
 * relative paths are prefixed with the public API host.
 */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = config.publicApiUrl.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
