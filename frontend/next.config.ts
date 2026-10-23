import type { NextConfig } from "next";

const staticExport = process.env.STATIC_EXPORT === "1";
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const { hostname: apiHostname } = new URL(apiUrl);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Docker / Node keeps standalone. Cloudflare Workers static deploy uses export.
  output: staticExport ? "export" : "standalone",
  poweredByHeader: false,
  images: {
    // next/image optimizer needs a Node server; static CF hosting serves files as-is.
    unoptimized: staticExport,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: apiUrl.startsWith("https") ? "https" : "http",
        hostname: apiHostname,
      },
    ],
  },
  ...(staticExport
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "X-Frame-Options", value: "DENY" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
