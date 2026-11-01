import {
  QueryClient,
  dehydrate,
  hydrate,
  type DehydratedState,
} from "@tanstack/react-query";

/** Survives reload in the same tab; cleared when the tab/session is closed. */
export const SESSION_QUERY_CACHE_KEY = "teyva-session-query-cache";

const PERSISTED_ROOT_KEYS = new Set([
  "categories",
  "products",
  "banners",
  "settings",
  "search",
]);

export function hasSessionQueryCache(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(SESSION_QUERY_CACHE_KEY) != null;
  } catch {
    return false;
  }
}

export function createSessionQueryClient(): QueryClient {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        // Session-scoped: keep data for the whole tab lifetime.
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: 1,
      },
    },
  });

  if (typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem(SESSION_QUERY_CACHE_KEY);
      if (raw) {
        const state = JSON.parse(raw) as DehydratedState;
        hydrate(client, state);
      }
    } catch {
      try {
        sessionStorage.removeItem(SESSION_QUERY_CACHE_KEY);
      } catch {
        /* ignore */
      }
    }
  }

  return client;
}

export function persistSessionQueryClient(client: QueryClient): void {
  if (typeof window === "undefined") return;
  try {
    const state = dehydrate(client, {
      shouldDehydrateQuery: (query) => {
        const root = query.queryKey[0];
        return (
          query.state.status === "success" &&
          typeof root === "string" &&
          PERSISTED_ROOT_KEYS.has(root)
        );
      },
    });
    sessionStorage.setItem(SESSION_QUERY_CACHE_KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode — ignore */
  }
}
