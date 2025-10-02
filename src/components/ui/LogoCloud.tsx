"use client"

import { useTranslationsContext } from "@/lib/i18n/TranslationsProvider";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { cx } from "@/lib/utils";
import { RiArrowRightUpLine } from "@remixicon/react";

const data = [
  {
    name: "Dr. Zineb",
    initials: "SE",
    email: "s.zineb@inayabridge.com",
    textColor: "text-blue-800 dark:text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-500/20",
    href: "#",
  },
  {
    name: "Dr. Omar Toumi",
    initials: "OT",
    email: "m.omar@inayabridge.com",
    textColor: "text-yellow-800 dark:text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-500/20",
    href: "#",
  },
  {
    name: "Dr. Ismail Ait Bouhmad",
    initials: "IA",
    email: "m.ismail@inayabridge.com",
    textColor: "text-blue-800 dark:text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-500/20",
    href: "#",
  },
  {
    name: "Dr. Anas El maky",
    initials: "AE",
    email: "m.anas@inayabridge.com",
    textColor: "text-blue-800 dark:text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-500/20",
    href: "#",
  },
  {
    name: "Dr. Youssef Hariri",
    initials: "YH",
    email: "y.hariri@inayabridge.com",
    textColor: "text-blue-800 dark:text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-500/20",
    href: "#",
  },
  {
    name: "Dr. Amal Benslimane",
    initials: "AB",
    email: "a.benslimane@inayabridge.com",
    textColor: "text-pink-800 dark:text-pink-500",
    bgColor: "bg-pink-100 dark:bg-pink-500/20",
    href: "#",
  },
  {
    name: "Dr. Karim Nassiri",
    initials: "KN",
    email: "k.nassiri@inayabridge.com",
    textColor: "text-indigo-800 dark:text-indigo-500",
    bgColor: "bg-indigo-100 dark:bg-indigo-500/20",
    href: "#",
  },
  {
    name: "Dr. Nadia Rahali",
    initials: "NR",
    email: "n.rahali@inayabridge.com",
    textColor: "text-orange-800 dark:text-orange-500",
    bgColor: "bg-orange-100 dark:bg-orange-500/20",
    href: "#",
  },
]

export default function LogoCloud() {
  const t = useTranslations("joinus");
  const { locale } = useTranslationsContext();
  const isRTL = locale === "ar";
  return (
    <section
      id="logo cloud"
      aria-label="Company logos"
      className="mt-24 flex animate-slide-up-fade flex-col items-center justify-center gap-y-6 pt-6 text-center sm:mt-12"
      style={{ animationDuration: "1500ms" }}
    >
      <p className="text-lg font-medium tracking-tighter text-gray-800 dark:text-gray-200">
        {t("title")}
      </p>
      <p className="mt-0 text-sm text-gray-600 dark:text-gray-400">
        {t("description")}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-10 gap-y-4 text-gray-900 md:grid-cols-4 md:gap-x-20 dark:text-gray-200">
        {data.map((member) => (
          <div key={member.name} className="group">
            <div className="flex items-center space-x-4 gap-2">
              <span
                className={cx(
                  member.bgColor,
                  member.textColor,
                  "flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                )}
                aria-hidden={true}
              >
                {member.initials}
              </span>
              <div className="truncate">
                <p className="flex-start flex truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                  <a href={member.href} className="focus:outline-none">
                    <span aria-hidden={true} />
                    {member.name}
                  </a>
                </p>
                <p className="truncate text-sm text-gray-500 dark:text-gray-500">
                  {member.email}
                </p>
              </div>
            </div>
            <span
              className="pointer-events-none absolute right-4 top-4 text-gray-400 group-hover:text-gray-500 dark:text-gray-600 group-hover:dark:text-gray-500"
              aria-hidden={true}
            >
              <RiArrowRightUpLine className="size-4" aria-hidden={true} />
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
