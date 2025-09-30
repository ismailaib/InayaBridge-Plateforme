"use client";

import { makeLinks } from "@/app/siteConfig";
import { locales, type Locale } from "@/lib/i18n/i18n";
import useScroll from "@/lib/use-scroll";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { useTranslationsContext } from "@/lib/i18n/TranslationsProvider";
import { cx } from "@/lib/utils";
import { RiCloseLine, RiMenuLine } from "@remixicon/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { DatabaseLogo } from "../../../public/DatabaseLogo";
import { DatabaseLogoArabic } from "../../../public/DatabaseLogoArabic";
import { Button } from "../Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Select";
import { Languages } from "lucide-react";

export function Navigation() {
  const scrolled = useScroll(15);
  const [open, setOpen] = React.useState(false);
  const { locale } = useTranslationsContext();
  const tNav = useTranslations("navigation");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const links = React.useMemo(() => makeLinks(locale), [locale]);

  React.useEffect(() => {
    const mediaQuery: MediaQueryList = window.matchMedia("(min-width: 768px)");
    const handleMediaQueryChange = () => {
      setOpen(false);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    handleMediaQueryChange();

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const languageOptions = React.useMemo(
    () => locales.map((code) => ({ code, label: tNav(`languages.${code}`) })),
    [tNav]
  );

  const handleLocaleChange = React.useCallback(
    (nextLocale: Locale) => {
      if (nextLocale === locale) {
        return;
      }

      const segments = pathname.split("/").filter(Boolean);
      let targetPath = `/${nextLocale}`;

      if (segments.length > 0) {
        if (locales.includes(segments[0] as Locale)) {
          segments[0] = nextLocale;
          targetPath = `/${segments.join("/")}`;
        } else {
          targetPath = `/${nextLocale}/${segments.join("/")}`;
        }
      }

      const queryString = searchParams?.toString();
      const url = queryString ? `${targetPath}?${queryString}` : targetPath;

      setOpen(false);
      router.push(url, { scroll: false });
    },
    [locale, pathname, router, searchParams]
  );

  const LanguageSelect = ({
    wrapperClassName,
  }: {
    wrapperClassName?: string;
  }) => (
    <div className={cx("relative", wrapperClassName)}>
      <Select value={locale} onValueChange={(value) => handleLocaleChange(value as Locale)}>
        <SelectTrigger className="min-w-[6.5rem]">
          <SelectValue >
            <div className="flex flex-row items-center gap-2">
              <Languages width={18}/>{languageOptions.find(({ code }) => code === locale)?.label}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languageOptions.map(({ code, label }) => (
            <SelectItem key={code} value={code}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <header
      className={cx(
        "fixed inset-x-3 top-4 z-50 mx-auto flex max-w-6xl transform-gpu animate-slide-down-fade justify-center overflow-hidden rounded-xl border border-transparent px-3 py-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1.03)] will-change-transform",
        open ? "h-52" : "h-16",
        scrolled || open
          ? "backdrop-blur-nav max-w-4xl border-gray-100 bg-white/80 shadow-xl shadow-black/5 dark:border-white/15 dark:bg-black/70"
          : "bg-white/0 dark:bg-gray-950/0"
      )}
    >
      <div className="w-full md:my-auto">
        <div className="relative flex items-center justify-between">
          <Link href={links.home} aria-label="Home">
            {locale === "ar" ? (
              <DatabaseLogoArabic className="w-28 md:w-32 inline-block mr-2 align-middle" />
            ) : (
              <DatabaseLogo className="w-28 md:w-32 inline-block mr-2 align-middle" />
            )}
          </Link>
          <nav className="hidden md:absolute md:left-1/2 md:top-1/2 md:block md:-translate-x-1/2 md:-translate-y-1/2 md:transform">
            <div className="flex items-center gap-10 font-medium">
              <Link className="px-2 py-1 text-gray-900 dark:text-gray-50" href={links.about}>
                {tNav("about")}
              </Link>
              <Link className="px-2 py-1 text-gray-900 dark:text-gray-50" href={links.pricing}>
                {tNav("pricing")}
              </Link>
              <Link className="px-2 py-1 text-gray-900 dark:text-gray-50" href={links.changelog}>
                {tNav("changelog")}
              </Link>
            </div>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageSelect wrapperClassName="flex-shrink-0" />
            <Link href={links.login}>
              <Button className="h-10 font-semibold">{tNav("login")}</Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSelect wrapperClassName="flex-shrink-0" />
            <Link href={links.login}>
              <Button>{tNav("login")}</Button>
            </Link>
            <Button onClick={() => setOpen(!open)} variant="light" className="aspect-square p-2">
              {open ? (
                <RiCloseLine aria-hidden="true" className="size-5" />
              ) : (
                <RiMenuLine aria-hidden="true" className="size-5" />
              )}
            </Button>
          </div>
        </div>
        <nav
          className={cx(
            "my-6 flex text-lg ease-in-out will-change-transform md:hidden",
            open ? "" : "hidden"
          )}
        >
          <ul className="space-y-4 font-medium">
            <li onClick={() => setOpen(false)}>
              <Link href={links.about}>{tNav("about")}</Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link href={links.pricing}>{tNav("pricing")}</Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link href={links.changelog}>{tNav("changelog")}</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}