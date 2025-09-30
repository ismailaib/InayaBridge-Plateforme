"use client"

import { Button } from "@/components/Button"
import { ArrowAnimated } from "@/components/ui/ArrowAnimated"
import Link from "next/link"
import { DatabaseLogo } from "../../public/DatabaseLogo"
import { makeLinks, siteConfig } from "./siteConfig"
import { useParams } from "next/navigation"

export default function NotFound() {

  const { locale } = useParams() as { locale?: string };
  const links = makeLinks(locale);

  
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Link href={links.home} aria-label={siteConfig.name}>
        <DatabaseLogo className="mt-6 h-10" />
      </Link>
      <p className="mt-6 text-4xl font-semibold text-[#009e7f] sm:text-5xl dark:text-[#00b38f]">
        404
      </p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-50">
        Page introuvable
      </h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Désolé, nous n&apos;avons pas trouvé la page que vous recherchez.
      </p>
      <Button asChild className="group mt-8" variant="light">
        <Link href={links.home} >
          Retourner à la page d&apos;accueil
          <ArrowAnimated
            className="stroke-gray-900 dark:stroke-gray-50"
            aria-hidden="true"
          />
        </Link>
      </Button>
    </div>
  )
}
