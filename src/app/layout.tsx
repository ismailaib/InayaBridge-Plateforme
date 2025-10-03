import {
  type Locale,
  defaultLocale,
  getDirection,
  isLocale,
} from "@/lib/i18n/i18n";

import type { Metadata } from "next";
import { Inter, Tajawal } from "next/font/google";
import { cookies, headers } from "next/headers";

import "./globals.css";
import { siteConfig } from "./siteConfig";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const tajawal = Tajawal({
  weight: ["400", "700"],
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://InayaBridge.com"),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: ["Marketing", "Database", "Software"],
  authors: [{ name: "InayaBridge", url: "" }],
  creator: "InayaBridge",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@yourname",
  },
  icons: { icon: "/favicon.ico" },
};

function extractLocaleFromPath(pathname: string | null): Locale | undefined {
  if (!pathname) {
    return undefined;
  }

  let normalized = pathname;
  if (normalized.includes("://")) {
    try {
      normalized = new URL(normalized).pathname;
    } catch (error) {
      normalized = pathname;
    }
  }

  const segment = normalized.split("/").filter(Boolean)[0];

  return isLocale(segment ?? "") ? (segment as Locale) : undefined;
}

function resolveLocale(): Locale {
  const headerList = headers();
  const pathname =
    headerList.get("x-pathname") ?? headerList.get("next-url") ?? null;
  const cookieLocale = cookies().get("NEXT_LOCALE")?.value;

  const pathnameLocale = extractLocaleFromPath(pathname);
  if (pathnameLocale) {
    return pathnameLocale;
  }

  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale as Locale;
  }

  return defaultLocale;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = resolveLocale();
  const dir = getDirection(locale);
  const appliedFont = locale === "ar" ? tajawal.className : inter.className;

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={`${appliedFont} ${inter.variable} ${tajawal.variable} min-h-screen scroll-auto antialiased selection:bg-blue-100 selection:text-[#3b82f6] dark:bg-gray-950`}
      >
        {children}
      </body>
    </html>
  );
}
