"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

const LOCALES = ["ar", "en", "fr"] // add your supported locales here

export function Breadcrumbs() {
  const pathname = usePathname()

  const segments = pathname
    .split("/")
    .filter((segment) => segment.length > 0 && !LOCALES.includes(segment))

  const breadcrumbItems = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const label = decodeURIComponent(segment)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())

    return {
      href,
      label,
    }
  })

  return (
    <nav aria-label="Breadcrumb" className="ml-2">
      <ol role="list" className="flex items-center space-x-3 text-sm">
        <li className="flex">
          <Link
            href="/"
            className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 hover:dark:text-gray-300"
          >
            Home
          </Link>
        </li>

        {breadcrumbItems.map((item, idx) => (
          <Fragment key={idx}>
            <ChevronRight
              className="size-4 shrink-0 text-gray-600 dark:text-gray-400"
              aria-hidden="true"
            />
            <li className="flex">
              <Link
                href={item.href}
                className={`transition ${
                  idx === breadcrumbItems.length - 1
                    ? "text-gray-900 dark:text-gray-50"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:dark:text-gray-300"
                }`}
                aria-current={idx === breadcrumbItems.length - 1 ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
