"use client";

import { useTranslationsContext } from "@/lib/i18n/TranslationsProvider";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { RiArrowRightUpLine } from "@remixicon/react";

import Link from "next/link";

import { DatabaseLogo } from "../../../public/DatabaseLogo";
import { DatabaseLogoArabic } from "../../../public/DatabaseLogoArabic";
import ThemeSwitch from "../ThemeSwitch";

export default function Footer() {
  const t = useTranslations("footer");
  const { locale } = useTranslationsContext();
  const isRTL = locale === "ar";

  // Build navigation directly from translations
  const navigation = {
    product: [
      { name: t("navigation.product.enterprise"), href: "#", external: false },
      {
        name: t("navigation.product.pricing"),
        href: "pricing",
        external: false,
      },
      {
        name: t("navigation.product.changelog"),
        href: "/changelog",
        external: false,
      },
    ],
    resources: [
      {
        name: t("navigation.resources.faqs"),
        href: "pricing#faq-title",
        external: false,
      },
      { name: t("navigation.resources.docs"), href: "#", external: false },
      { name: t("navigation.resources.api"), href: "#", external: false },
      { name: t("navigation.resources.blog"), href: "#", external: false },
      { name: t("navigation.resources.support"), href: "#", external: false },
    ],
    company: [
      { name: t("navigation.company.about"), href: "about", external: false },
      { name: t("navigation.company.careers"), href: "#", external: true },
      { name: t("navigation.company.contact"), href: "#", external: false },
      { name: t("navigation.company.status"), href: "#", external: false },
    ],
    legal: [
      { name: t("navigation.legal.imprint"), href: "#", external: false },
      { name: t("navigation.legal.privacy"), href: "#", external: false },
      { name: t("navigation.legal.terms"), href: "#", external: false },
      { name: t("navigation.legal.dpa"), href: "#", external: false },
    ],
  };

  return (
    <footer id="footer" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-6xl px-3 pb-8 pt-16 sm:pt-24 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-20">
          {/* Left side: Logo + Description */}
          <div className="space-y-8">
            {locale === "ar" ? (
              <DatabaseLogoArabic className="w-28 md:w-32 inline-block mr-2 align-middle" />
            ) : (
              <DatabaseLogo className="w-28 md:w-32 inline-block mr-2 align-middle" />
            )}
            <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
              {t("description")}
            </p>
            <div className="flex space-x-6">
              <ThemeSwitch />
            </div>
          </div>

          {/* Navigation sections */}
          <div className="mt-16 grid grid-cols-1 gap-14 sm:gap-8 md:grid-cols-2 xl:col-span-2 xl:mt-0">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50">
                  {t("sections.product")}
                </h3>
                <ul className="mt-6 space-y-4">
                  {navigation.product.map((item) => (
                    <li key={item.name} className="w-fit">
                      <Link
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="flex items-center text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      >
                        <span>{item.name}</span>
                        {item.external && (
                          <RiArrowRightUpLine className="ml-1 size-3 shrink-0 text-gray-900 dark:text-gray-300" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50">
                  {t("sections.resources")}
                </h3>
                <ul className="mt-6 space-y-4">
                  {navigation.resources.map((item) => (
                    <li key={item.name} className="w-fit">
                      <Link
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="flex items-center text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      >
                        <span>{item.name}</span>
                        {item.external && (
                          <RiArrowRightUpLine className="ml-1 size-3 shrink-0 text-gray-900 dark:text-gray-300" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50">
                  {t("sections.company")}
                </h3>
                <ul className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name} className="w-fit">
                      <Link
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="flex items-center text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      >
                        <span>{item.name}</span>
                        {item.external && (
                          <RiArrowRightUpLine className="ml-1 size-3 shrink-0 text-gray-900 dark:text-gray-300" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50">
                  {t("sections.legal")}
                </h3>
                <ul className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name} className="w-fit">
                      <Link
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="flex items-center text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      >
                        <span>{item.name}</span>
                        {item.external && (
                          <RiArrowRightUpLine className="ml-1 size-3 shrink-0 text-gray-900 dark:text-gray-300" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:mt-20 sm:flex-row lg:mt-24 dark:border-gray-800">
          <p className="text-sm leading-5 text-gray-500 dark:text-gray-400">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="rounded-full border border-gray-200 py-1 pl-1 pr-2 dark:border-gray-800">
            <div className="flex items-center gap-1.5">
              <div className="relative size-4 shrink-0">
                <div className="absolute inset-[1px] rounded-full bg-blue-500/20 dark:bg-blue-600/20" />
                <div className="absolute inset-1 rounded-full bg-blue-600 dark:bg-blue-500" />
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-50">
                {t("status")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
