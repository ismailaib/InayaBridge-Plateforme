"use client"

import { Button } from "@/components/Button"
import { ArrowAnimated } from "@/components/ui/ArrowAnimated"
import Link from "next/link"
import { useParams } from "next/navigation"
import { makeLinks, siteConfig } from "../siteConfig"
import { DatabaseLogo } from "../../../public/DatabaseLogo"

export default function NotFound() {
  const { locale } = useParams() as { locale?: "en" | "fr" | "ar" }

  const links = makeLinks(locale)

  const messages = {
    en: {
      title: "Page not found",
      description: "Sorry, we couldn’t find the page you’re looking for.",
      goHome: "Go back home",
    },
    fr: {
      title: "Page introuvable",
      description: "Désolé, la page que vous recherchez est introuvable.",
      goHome: "Retour à l'accueil",
    },
    ar: {
      title: "الصفحة غير موجودة",
      description: "عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.",
      goHome: "العودة إلى الصفحة الرئيسية",
    },
  }

  const t = messages[locale ?? "en"]

  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <Link href={links.home} aria-label={siteConfig.name}>
        <DatabaseLogo className="mt-6 h-10" />
      </Link>
      <p className="mt-6 text-4xl font-semibold text-[#3b82f6] sm:text-5xl dark:text-[#3b82f6]">
        404
      </p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-50">
        {t?.title}
      </h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {t?.description}
      </p>
      <Button asChild className="group mt-8" variant="light">
        <Link href={links.home}>
          {t?.goHome}
          <ArrowAnimated
            className="stroke-gray-900 dark:stroke-gray-50"
            aria-hidden="true"
          />
        </Link>
      </Button>
    </div>
  )
}
