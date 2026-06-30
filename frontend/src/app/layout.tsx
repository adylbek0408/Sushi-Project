import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { config } from "@/lib/config";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: "Sushiya — премиум доставка суши в Бишкеке",
    template: "%s · Sushiya",
  },
  description:
    "Свежие роллы и суши за 30 минут. Премиальные ингредиенты, быстрая доставка по Бишкеку. Заказ в один клик через WhatsApp.",
  keywords: ["суши", "роллы", "доставка суши", "Бишкек", "sushi", "Sushiya"],
  openGraph: {
    title: "Sushiya — премиум доставка суши",
    description: "Свежие роллы за 30 минут. Доставка по Бишкеку.",
    type: "website",
    locale: "ru_RU",
    siteName: "Sushiya",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#fbf9fc",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
