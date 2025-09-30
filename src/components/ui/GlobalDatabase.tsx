"use client"
import { FunctionComponent } from "react"
import { useTranslations } from "@/lib/i18n/useTranslations"
import { useTranslationsContext } from "@/lib/i18n/TranslationsProvider"

export const GlobalDatabase: FunctionComponent = () => {
  const t = useTranslations("globaldatabase")
  const { locale } = useTranslationsContext()
  const isRTL = locale === "ar"

  const features = [
    {
      name: t("features.step1.title"),
      description: t("features.step1.description"),
    },
    {
      name: t("features.step2.title"),
      description: t("features.step2.description"),
    },
    {
      name: t("features.step3.title"),
      description: t("features.step3.description"),
    },
  ]

  return (
    <div className="px-3 hidden md:block">
      <section
        aria-labelledby="global-database-title"
        className="relative mx-auto mt-28 flex w-full max-w-6xl flex-col items-center justify-center overflow-hidden rounded-3xl bg-gray-950 pt-24 shadow-none shadow-black/30 md:mt-40"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="absolute top-[17rem] size-[40rem] rounded-full bg-[#005f4d] blur-3xl md:top-[20rem]" />
        <div className="z-10 inline-block rounded-lg border border-[#33ccad]/20 bg-[#005f4d]/20 px-3 py-1.5 font-semibold uppercase leading-4 tracking-tight sm:text-sm">
          <span className="bg-gradient-to-b from-[#99e6d6] to-[#33ccad] bg-clip-text text-transparent">
            {t("badge")}
          </span>
        </div>
        <h2
          id="global-database-title"
          className="z-10 mt-6 inline-block bg-gradient-to-b from-white to-green-100 bg-clip-text px-2 text-center text-5xl font-bold tracking-tighter text-transparent md:text-8xl"
        >
          {t("titleLine1")}
          <br /> {t("titleLine2")}
        </h2>
        <div className="z-20 -mt-32 h-[28rem] w-full overflow-hidden md:-mt-36">
          <div className="absolute bottom-0 h-3/5 w-full bg-gradient-to-b from-transparent via-gray-950/95 to-gray-950" />
          <div className="absolute inset-x-6 bottom-12 m-auto max-w-4xl md:top-2/3">
            <div className="grid grid-cols-1 gap-x-10 gap-y-6 rounded-lg border border-white/[3%] bg-white/[1%] px-6 py-6 shadow-xl backdrop-blur md:grid-cols-3 md:p-8">
              {features.map((item) => (
                <div key={item.name} className="flex flex-col gap-2">
                  <h3 className="whitespace-nowrap bg-gradient-to-b from-[#66d9c2] to-[#00b38f] bg-clip-text text-lg font-semibold text-transparent md:text-xl">
                    {item.name}
                  </h3>
                  <p className="text-sm leading-6 text-[#99e6d6]/40">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
