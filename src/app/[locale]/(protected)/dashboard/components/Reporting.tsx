"use client"

import { AreaChart } from "@/components/AreaChart"
import { Card } from "@/components/Card"
import { CategoryBar } from "@/components/CategoryBar"
import { Tooltip } from "@/components/Tooltip"
import { useTranslations } from "@/lib/i18n/useTranslations"
import { Info } from "lucide-react"

export default function DashboardStats() {


  const t = useTranslations("dashboard.dashboardStats")

  const category1 = t("categories.1")
  const category2 = t("categories.2")

  const data = [
    { date: "19-09-2025", [category1]: 0, [category2]: 0 },
    { date: "20-09-2025", [category1]: 16, [category2]: 5 },
    { date: "21-09-2025", [category1]: 24, [category2]: 8 },
    { date: "22-09-2025", [category1]: 28, [category2]: 10 },
    { date: "23-09-2025", [category1]: 31, [category2]: 12 },
    { date: "24-09-2025", [category1]: 32, [category2]: 13 },
    { date: "25-09-2025", [category1]: 35, [category2]: 15 },
    { date: "26-09-2025", [category1]: 65, [category2]: 24 },
    { date: "27-09-2025", [category1]: 58, [category2]: 22 },
    { date: "28-09-2025", [category1]: 60, [category2]: 24 },
    { date: "29-09-2025", [category1]: 65, [category2]: 25 },
  ]


  return (
    <>
      <h1 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-50">
        {t("title")}
      </h1>
      <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">
        {t("subtitle")}
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* RDV honorés */}
        <Card className="mt-6 overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-900 dark:bg-gray-900">
            <h1 className="text-sm font-medium text-gray-900 dark:text-gray-50">
              {t("appointments.respectTitle")}
            </h1>
            <Tooltip content={t("appointments.tooltip")} showArrow={false}>
              <Info width={18} className="text-gray-500 dark:text-gray-400" />
            </Tooltip>
          </div>
          <div className="p-4">
            <p className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
              92.4%
            </p>
            <p className="text-sm/6 text-gray-500 dark:text-gray-500">
              {t("appointments.rate")}
            </p>
            <CategoryBar
              values={[92.4, 7.6]}
              colors={["blue", "amber"]}
              showLabels={false}
              className="mt-6"
            />
            <ul className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex justify-between">
                <span>{t("appointments.honored")}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  92.4% (145)
                </span>
              </li>
              <li className="flex justify-between">
                <span>{t("appointments.missed")}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  7.6% (12)
                </span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Temps de consultation */}
        <Card className="mt-6 overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-900 dark:bg-gray-900">
            <h1 className="text-sm font-medium text-gray-900 dark:text-gray-50">
              {t("consultation.timeTitle")}
            </h1>
            <Tooltip content={t("consultation.tooltip")} showArrow={false}>
              <Info width={18} className="text-gray-500 dark:text-gray-400" />
            </Tooltip>
          </div>
          <div className="p-4">
            <p className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
              17min 30s
            </p>
            <p className="text-sm/6 text-gray-500 dark:text-gray-500">
              {t("consultation.average")}
            </p>
            <CategoryBar
              values={[85.2, 14.8]}
              colors={["blue", "gray"]}
              showLabels={false}
              className="mt-6"
            />
            <ul className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex justify-between">
                <span>{t("consultation.under20")}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  85.2%
                </span>
              </li>
              <li className="flex justify-between">
                <span>{t("consultation.over20")}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  14.8%
                </span>
              </li>
            </ul>
          </div>
        </Card>
      </div>

      {/* Evolution */}
      <Card className="mt-6 overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-900 dark:bg-gray-900">
          <h1 className="text-sm font-medium text-gray-900 dark:text-gray-50">
            {t("evolution.title")}
          </h1>
          <Tooltip content={t("evolution.tooltip")} showArrow={false}>
            <Info width={18} className="text-gray-500 dark:text-gray-400" />
          </Tooltip>
        </div>
        <div className="p-4">
          <AreaChart
            data={data}
            index="date"
            categories={[t("categories.1"), t("categories.2")]}
            colors={["blue", "amber"]}
            fill="solid"
            valueFormatter={(v) => `${v}`}
            onValueChange={() => { }}
            tickGap={15}
            className="hidden sm:block"
          />
          <AreaChart
            data={data}
            index="date"
            categories={[t("categories.1"), t("categories.2")]}
            colors={["blue", "amber"]}
            fill="solid"
            valueFormatter={(v) => `${v}`}
            onValueChange={() => { }}
            showYAxis={false}
            startEndOnly={true}
            tickGap={15}
            className="sm:hidden"
          />
        </div>
      </Card>
    </>
  )
}
