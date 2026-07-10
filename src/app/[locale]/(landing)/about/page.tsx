"use client";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import Benefits from "@/components/ui/Benefits";
import { useTranslationsContext } from "@/lib/i18n/TranslationsProvider";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { cx } from "@/lib/utils";

import Balancer from "react-wrap-balancer";

export default function About() {
  const t = useTranslations("about");
  const { locale } = useTranslationsContext();
  const isRTL = locale === "ar";

  return (
    <div
      className="mt-36 flex flex-col overflow-hidden px-3"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <section
        aria-labelledby="about-overview"
        className="animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>{t("badge")}</Badge>
        <h1
          id="about-overview"
          className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
        >
          <Balancer>{t("title")}</Balancer>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-700 dark:text-gray-400">
          {t("overview")}
        </p>
      </section>

      <Benefits />

      <section aria-labelledby="vision-title" className="mx-auto mt-40">
        <h2
          id="vision-title"
          className="inline-block bg-gradient-to-t from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent md:text-5xl dark:from-gray-50 dark:to-gray-300"
        >
          {t("visionTitle")}
        </h2>
        <div className="mt-6 max-w-prose space-y-4 text-gray-600 dark:text-gray-400">
          <p className="text-lg leading-8">{t("vision1")}</p>
          <p className="text-lg leading-8">{t("vision2")}</p>
          <p className="text-lg leading-8">{t("vision3")}</p>
          <p
            className={cx(
              "w-fit rotate-3 font-handwriting text-3xl text-[#3b82f6] dark:text-[#3b82f6]",
            )}
          >
            {t("teamSignature")}
          </p>
        </div>
        <Button className="mt-32 h-10 w-full shadow-xl shadow-[#3b82f6]/20">
          {t("donate")}
        </Button>
      </section>
    </div>
  );
}
