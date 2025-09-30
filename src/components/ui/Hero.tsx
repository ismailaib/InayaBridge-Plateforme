"use client";

import { RiPlayCircleFill } from "@remixicon/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../Button";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { useTranslationsContext } from "@/lib/i18n/TranslationsProvider";

const statKeys = ["users", "support", "satisfaction"] as const;

export default function Hero() {
  const t = useTranslations("landing.hero");
  const { locale } = useTranslationsContext();
  const isRTL = locale === "ar";

  const stats = statKeys.map((key) => ({
    key,
    value: t(`stats.${key}.value`),
    label: t(`stats.${key}.label`),
  }));

  return (
    <section aria-labelledby="hero-title" className="relative mt-16 py-20">
      {/* Background gradient circles for visual flair */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-50 blur-3xl opacity-70 dark:bg-emerald-900/20" />
      <div className="absolute top-1/2 right-1/4 h-64 w-64 rounded-full bg-teal-50 blur-3xl opacity-60 dark:bg-teal-900/20" />

      <div className="container mx-auto px-4">
        <div
          className={`flex flex-col items-center justify-between gap-12 lg:flex-row`}
        >
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`max-w-xl ${isRTL ? "text-right" : "text-left"}`}
          >
            {/* Small badge */}
            <div className={`mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100/70 px-4 py-1.5 text-sm font-semibold text-emerald-800 shadow-sm dark:bg-emerald-900/40 dark:text-emerald-200 ${isRTL ? "flex-row-reverse" : ""}`}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>{t("badge")}</span>
            </div>

            <h1
              id="hero-title"
              className="bg-gradient-to-r from-emerald-600 via-emerald-800 to-teal-600 bg-clip-text text-5xl font-bold leading-tight tracking-tight text-transparent sm:text-5xl md:text-6xl"
            >
              {t("titleLine1")}
              <br />
              {t("titleLine2")}
            </h1>

            <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">{t("description")}</p>

            <div className={`mt-10 flex flex-col gap-4 sm:flex-row ${isRTL ? "sm:flex-row-reverse justify-end" : ""}`}>
              <Button
                asChild
                className="h-12 rounded-lg bg-emerald-600 px-6 text-base font-medium text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:bg-emerald-700 dark:shadow-emerald-900/30"
              >
                <Link href={`/${locale}/signup`}>{t("primaryCta")}</Link>
              </Button>

              <Button
                asChild
                variant="light"
                className={`h-12 gap-2 rounded-lg border border-gray-200 bg-white px-6 text-base font-medium text-gray-800 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 group ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Link href="https://www.youtube.com/watch?v=QRZ_l7cVzzU" target="_blank">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 transition-all group-hover:bg-emerald-100 dark:bg-gray-700 dark:group-hover:bg-gray-600">
                    <RiPlayCircleFill aria-hidden="true" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </span>
                  {t("videoCta")}
                </Link>
              </Button>
            </div>

            {/* Social proof or stats */}
            <div className={`mt-12 grid grid-cols-3 gap-4 border-t border-gray-200 pt-6 dark:border-gray-800 ${isRTL ? "text-right" : "text-left"}`}>
              {stats.map(({ key, value, label }) => (
                <div key={key}>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image with floating elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="pointer-events-none relative select-none">
              <Image
                src="/images/home2.png"
                height={650}
                width={650}
                alt={t("imageAlt")}
                className="pointer-events-none relative z-10 select-none"
                priority
                quality={100}
                draggable={false}
              />

              {/* Blurry gradient at the bottom of the image */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-32 bg-gradient-to-t from-white via-white/50 to-transparent transition-all duration-700 ease-in-out dark:from-gray-950 dark:via-gray-950/40" />

              {/* Floating UI elements */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className={`absolute -left-12 top-12 z-20 select-none rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 animate-float ${
                  isRTL ? "left-auto right-12" : ""
                }`}
              >
                <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600 dark:text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className={`${isRTL ? "text-right" : "text-left"}`}>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{t("floating.confirmed.title")}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("floating.confirmed.subtitle")}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className={`absolute -right-12 bottom-24 z-20 select-none rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 animate-float ${
                  isRTL ? "right-auto left-12" : ""
                }`}
              >
                <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className={`${isRTL ? "text-right" : "text-left"}`}>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{t("floating.fast.title")}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t("floating.fast.subtitle")}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-950 dark:via-gray-950" />
    </section>
  );
}

