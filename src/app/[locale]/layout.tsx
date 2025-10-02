import { Toaster } from "@/components/Toaster";
import { TranslationsProvider } from "@/lib/i18n/TranslationsProvider";
import { getMessages, type Messages } from "@/lib/i18n/getMessages";
import { getDirection, isLocale, locales, type Locale } from "@/lib/i18n/i18n";
import { readdir } from "fs/promises";
import { ThemeProvider } from "next-themes";
import { notFound } from "next/navigation";
import path from "path";
import { inter, tajawal } from "../layout";
import { LayoutWrapper } from "./(landing)/Layout";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

async function getLocaleNamespaces(locale: Locale): Promise<string[]> {
  const localeDir = path.join(process.cwd(), "src/app/messages", locale);

  try {
    const entries = await readdir(localeDir, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .map((entry) => entry.name.replace(/\.json$/u, ""))
      .sort();
  } catch (error) {
    console.error(`Unable to read namespaces for locale "${locale}"`, error);
    return [];
  }
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const localeParam = params.locale;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const namespaces = await getLocaleNamespaces(locale);

  const messagesEntries = await Promise.all(
    namespaces.map(async (namespace) => {
      const value = await getMessages(locale, namespace);
      return [namespace, value] as const;
    })
  );

  const messages = messagesEntries.reduce<Messages>(
    (acc, [namespace, value]) => {
      acc[namespace] = value;
      return acc;
    },
    {} as Messages
  );

  const dir = getDirection(locale);
  const fontClass = locale === "ar" ? tajawal.className : inter.className;

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={`${fontClass} ${inter.variable} ${tajawal.variable} min-h-screen scroll-auto antialiased selection:bg-blue-100 selection:text-[#3b82f6] dark:bg-gray-950`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <TranslationsProvider locale={locale} messages={messages}>
            <div className="z-[9999] fixed">
              <Toaster />
            </div>
            <LayoutWrapper>{children}</LayoutWrapper>
          </TranslationsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}