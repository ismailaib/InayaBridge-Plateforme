import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { LayoutWrapper } from "./(landing)/Layout";
import { TranslationsProvider } from "@/lib/i18n/TranslationsProvider";
import { getMessages, type Messages } from "@/lib/i18n/getMessages";
import { isLocale, locales, getDirection, type Locale } from "@/lib/i18n/i18n";
import { Toaster } from "@/components/Toaster";
import { inter, tajawal } from "../layout";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const localeParam = params.locale;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const namespaces = [
    "common",
    "navigation",
    "landing",
    "joinus",
    "globaldatabase",
    "features",
    "benefits",
    "cta",
    "faqs",
    "footer",
    "pricing",
    "changelog","auth","common"
  ] as const;

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
        className={`${fontClass} ${inter.variable} ${tajawal.variable} min-h-screen scroll-auto antialiased selection:bg-green-100 selection:text-[#007e68] dark:bg-gray-950`}
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