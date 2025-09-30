"use client"

import { useTranslations } from "@/lib/i18n/useTranslations"

export default function Benefits() {
  const t = useTranslations("benefits")
  
  // Access each benefit individually by index
  const benefits = [
    { title: t("items.0.title"), description: t("items.0.description") },
    { title: t("items.1.title"), description: t("items.1.description") },
    { title: t("items.2.title"), description: t("items.2.description") },
    { title: t("items.3.title"), description: t("items.3.description") },
    { title: t("items.4.title"), description: t("items.4.description") },
    { title: t("items.5.title"), description: t("items.5.description") },
    { title: t("items.6.title"), description: t("items.6.description") },
    { title: t("items.7.title"), description: t("items.7.description") },
  ]

  return (
    <section aria-labelledby="benefits-title" className="mx-auto mt-44">
      <h2
        id="benefits-title"
        className="inline-block bg-gradient-to-t from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent md:text-5xl dark:from-gray-50 dark:to-gray-300"
      >
        {t("title")}
      </h2>
      <dl className="mt-8 grid grid-cols-4 gap-x-10 gap-y-8 sm:mt-12 sm:gap-y-10">
        {benefits.map((benefit, index) => (
          <div key={index} className="col-span-4 sm:col-span-2 lg:col-span-1">
            <dt className="font-semibold text-gray-900 dark:text-gray-50">
              {benefit.title}
            </dt>
            <dd className="mt-2 leading-7 text-gray-600 dark:text-gray-400">
              {benefit.description}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}