"use client"

import {
  RiCheckDoubleFill,
  RiFileHistoryFill,
  RiTestTubeFill,
} from "@remixicon/react"

import { BarChart } from "@/components/BarChart"
import { Card } from "@/components/Card"
import { CategoryBar } from "@/components/CategoryBar"
import { Divider } from "@/components/Divider"
import { Tooltip } from "@/components/Tooltip"
import { useTranslationsContext } from "@/lib/i18n/TranslationsProvider"
import { useTranslations } from "@/lib/i18n/useTranslations"
import { cx } from "@/lib/utils"
import { Info } from "lucide-react"

export default function DoctorAnalyticsSection() {
  const t = useTranslations("dashboard.doctorAnalytics")
  const { locale } = useTranslationsContext()
  const data = [
    {
      name: t("items.followUp"),
      value: 12,
      icon: RiFileHistoryFill,
      iconColor: "text-indigo-500 dark:text-indigo-500",
      tooltip: t("tooltips.followUp"),
    },
    {
      name: t("items.closed"),
      value: 48,
      icon: RiCheckDoubleFill,
      iconColor: "text-blue-500 dark:text-blue-500",
      tooltip: t("tooltips.closed"),
    },
    {
      name: t("items.pending"),
      value: 9,
      icon: RiTestTubeFill,
      iconColor: "text-indigo-500 dark:text-indigo-500",
      tooltip: t("tooltips.pending"),
    },
    {
      name: t("items.validated"),
      value: 31,
      icon: RiCheckDoubleFill,
      iconColor: "text-blue-500 dark:text-blue-500",
      tooltip: t("tooltips.validated"),
    },
  ]

  return (
    <>
      <Card className="mt-6 overflow-hidden p-0">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-900 dark:bg-[#090E1A] flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
            {t("overview.title")}
          </h3>
          <Tooltip content={t("overview.tooltip")} showArrow={false}>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <Info width={18} />
            </span>
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
          <div>
            <CategoryBar values={[12, 48]} colors={["cyan", "blue"]} showLabels={false} />
            <p className="mt-2 text-sm text-gray-900 dark:text-gray-50">
              <span className="font-semibold">12</span> {t("overview.followUpPlanned")}
            </p>
          </div>
          <div>
            <CategoryBar values={[9, 31]} colors={["cyan", "blue"]} showLabels={false} />
            <p className="mt-2 text-sm text-gray-900 dark:text-gray-50">
              <span className="font-semibold">9</span> {t("overview.pendingDiagnostics")}
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-px border-t border-gray-200 bg-gray-200 md:grid-cols-4 dark:border-gray-900 dark:bg-gray-900">
          {data.map((item) => (
            <Tooltip key={item.name} content={item.tooltip} showArrow={false}>
              <li className="flex flex-col items-center justify-center bg-white p-3 dark:bg-[#090E1A] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
                <div className="flex items-center space-x-1">
                  <item.icon
                    className={cx(item.iconColor, "size-5")}
                    aria-hidden={true}
                  />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    {item.value}
                  </span>
                </div>
                <span className="text-sm text-gray-900 dark:text-gray-50">
                  {item.name}
                </span>
              </li>
            </Tooltip>
          ))}
        </ul>
      </Card>

      <Divider className="my-10">{t("advancedStats")}</Divider>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 dark:text-gray-50">
              {t("summary.title")}
            </h4>
            <Tooltip content={t("summary.tooltip")} showArrow={false}>
              <Info width={18} className="text-gray-500 dark:text-gray-400" />
            </Tooltip>
          </div>
          <p className="mt-4 text-sm/6 text-gray-500 dark:text-gray-500">
            {t("summary.text", { total: 60, pending: 9, validated: 31, followups: 12 })}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 dark:text-gray-50">
              {t("diseases.title")}
            </h4>
            <Tooltip content={t("diseases.tooltip")} showArrow={false}>
              <Info width={18} className="text-gray-500 dark:text-gray-400" />
            </Tooltip>
          </div>
          <div dir="ltr">
            <BarChart
              data={[
                { maladie: "Hypertension", Consultations: 14 },
                { maladie: "Diabète de type 2", Consultations: 11 },
                { maladie: "Infections respiratoires", Consultations: 9 },
                { maladie: "Allergies saisonnières", Consultations: 7 },
                { maladie: "Douleurs chroniques", Consultations: 6 },
              ]}
              index="maladie"
              categories={["Consultations"]}
              colors={["amber"]}
              showLegend={false}
              layout="vertical"
              yAxisWidth={120}
              className="mt-4 h-48"
            />
          </div>
        </div>
      </div>
    </>
  )
}
