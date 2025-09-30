"use client"

import useTranslations from "@/lib/i18n/useTranslations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../Accordion"

export function Faqs() {
  const t = useTranslations("faqs")

  // get localized items
  const items = t.raw<{ q: string; a: string }[]>("items") || []

  return (
    <section className="mt-20 sm:mt-36" aria-labelledby="faq-title">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-14">
        <div className="col-span-full sm:col-span-5">
          <h2
            id="faq-title"
            className="inline-block scroll-my-24 bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 pr-2 text-2xl font-bold tracking-tighter text-transparent lg:text-3xl dark:from-gray-50 dark:to-gray-300"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
            {t("contact")}&nbsp;
            <a
              href="#"
              className="font-medium text-[#009e7f] hover:text-[#66d9c2] dark:text-[#33ccad]"
            >
              {t("link")}
            </a>
            .
          </p>
        </div>
        <div className="col-span-full mt-6 lg:col-span-7 lg:mt-0">
          <Accordion type="multiple" className="mx-auto">
            {items.map((item) => (
              <AccordionItem
                value={item.q}
                key={item.q}
                className="py-3 first:pb-3 first:pt-0"
              >
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
