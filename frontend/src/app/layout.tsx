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
    default: "Teyva — меню и доставка",
    template: "%s · Teyva",
  },
  description:
    "Меню Teyva. Заказ в один клик через WhatsApp.",
  keywords: ["Teyva", "меню", "доставка", "Бишкек", "еда"],
  openGraph: {
    title: "Teyva — меню",
    description: "Меню и доставка Teyva.",
    type: "website",
    locale: "ru_RU",
    siteName: "Teyva",
  },
  icons: {
    icon: "/teyva-logo.png",
    apple: "/teyva-logo.png",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FE8128",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function ready(){document.documentElement.classList.add("icons-ready")}if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){return document.fonts.load('24px "Material Symbols Outlined"')}).then(ready).catch(ready)}else{ready()}setTimeout(ready,2500)})();`,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
