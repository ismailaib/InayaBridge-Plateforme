"use client";

import { ChangelogEntry } from "@/components/mdx";
import useTranslations from "@/lib/i18n/useTranslations";

import React from "react";

import Image from "next/image";

const ChangelogImage = ({ src, alt }: { src: string; alt?: string }) => (
  <Image
    src={src}
    alt={alt ?? ""}
    className="mt-6 mb-8 w-full rounded-lg border bg-gray-50 dark:bg-gray-900"
    loading="lazy"
    width={800}
    height={400}
  />
);

export default function InayaBridgeChangelogV100() {
  const t = useTranslations("changelog.v1_0_0");

  // Features come from translation JSON (array of objects)
  const features = t.raw<{ label: string; desc: string }[]>("features") ?? [];

  return (
    <ChangelogEntry version="v1.0.0" date={t("date")}>
      <h2 className="mb-4 text-xl font-semibold text-white">{t("title")}</h2>

      <p className="mb-6 leading-relaxed text-gray-300">{t("intro")}</p>

      <ChangelogImage src="/changelog/v1.png" alt="InayaBridge v1.0.0" />

      <div className="space-y-4">
        <h3 className="mb-3 text-lg font-semibold text-white">
          {t("featuresTitle")}
        </h3>

        <ul className="space-y-3">
          {features.map((item) => (
            <li key={item.label}>
              <span className="font-medium text-white">– {item.label}:</span>{" "}
              <span className="text-gray-300">{item.desc}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 leading-relaxed text-gray-300">{t("conclusion")}</p>

      <p className="mt-4 text-gray-300">
        {t("moreInfo")}{" "}
        <a href="#" className="text-blue-400 underline hover:text-blue-300">
          {t("documentation")}
        </a>{" "}
        {t("orContact")}
      </p>
    </ChangelogEntry>
  );
}
