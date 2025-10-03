"use client";

import { Card } from "@/components/Card";
import { Tooltip } from "@/components/Tooltip";
import useTranslations from "@/lib/i18n/useTranslations";
import { BookmarkX, CheckCheck, Info, Pin } from "lucide-react";

const alertDates = [
  "20-04-2025 21:21",
  "20-04-2025 18:24",
  "20-04-2025 15:50",
  "20-04-2025 12:20",
] as const;

type KpiKey =
  | "todayAppointments"
  | "waitingPatients"
  | "finishedConsultations"
  | "newPatients"
  | "videoConsultations"
  | "csatScore";

const KPI_VALUES: Record<KpiKey, string> = {
  todayAppointments: "24",
  waitingPatients: "11",
  finishedConsultations: "74",
  newPatients: "42",
  videoConsultations: "16",
  csatScore: "4.6 / 5",
};

const KPI_COLUMNS: KpiKey[][] = [
  ["todayAppointments", "waitingPatients", "finishedConsultations"],
  ["newPatients", "videoConsultations", "csatScore"],
];

export default function DoctorKPIBlock() {
  const t = useTranslations("dashboard.kpis");

  const kpiData = KPI_COLUMNS.map((column) =>
    column.map((key) => ({
      key,
      title: t(`cards.${key}.title`),
      value: KPI_VALUES[key],
      tooltip: t(`cards.${key}.tooltip`),
    })),
  );

  const topMedicalAlerts = alertDates.map((date, index) => ({
    date,
    closed: index >= 2,
  }));

  return (
    <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-8">
      <Card className="h-full lg:col-span-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900 dark:text-gray-50">
            {t("cardsSection.title")}
          </p>
          <Tooltip content={t("cardsSection.tooltip")} showArrow={false}>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <Info width={18} />
            </span>
          </Tooltip>
        </div>
        <dl className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {kpiData.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col space-y-6">
              {column.map((kpi) => (
                <Tooltip key={kpi.key} content={kpi.tooltip} showArrow={false}>
                  <div className="flex flex-col justify-start">
                    <dt className="text-start text-sm text-gray-500 dark:text-gray-500">
                      {kpi.title}
                    </dt>
                    <div className="flex items-center gap-4">
                      <dd className="mt-1 text-start text-2xl font-semibold text-gray-900 dark:text-gray-50">
                        {kpi.value}
                      </dd>
                      <div className="flex flex-row items-center gap-0.5">
                        <div className="w-1.5 h-6 bg-blue-500 dark:bg-blue-800 rounded-lg"></div>
                        <div className="w-1.5 h-6 bg-blue-500 dark:bg-blue-800 rounded-lg"></div>
                        <div className="w-1.5 h-6 bg-yellow-200 dark:bg-yellow-600 rounded-lg"></div>
                        <div className="w-1.5 h-6 bg-blue-200/20 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </Tooltip>
              ))}
            </div>
          ))}
        </dl>
      </Card>

      <Card className="h-full lg:col-span-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900 dark:text-gray-50">
            {t("alerts.title")}
          </p>
          <Tooltip content={t("alerts.tooltip")} showArrow={false}>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <Info width={18} />
            </span>
          </Tooltip>
        </div>
        <ol className="mt-4 divide-y divide-gray-200 dark:divide-gray-800/20">
          {topMedicalAlerts.map(({ date, closed }, index) => (
            <li
              key={`${date}-${index}`}
              className="flex cursor-pointer items-center justify-between px-2 py-2 transition-all duration-300 hover:bg-gray-50 hover:dark:bg-gray-800"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {t("alerts.items.urgent")}
                  <p className="text-sm tabular-nums text-gray-600 dark:text-gray-400">
                    {date}
                  </p>
                </span>
              </div>

              {closed ? (
                <Tooltip content={t("alerts.actions.closed")} showArrow={false}>
                  <CheckCheck
                    width={18}
                    className="cursor-pointer text-blue-500"
                  />
                </Tooltip>
              ) : (
                <div className="items-top flex justify-end gap-2">
                  <Tooltip
                    content={t("alerts.actions.close")}
                    showArrow={false}
                  >
                    <BookmarkX
                      width={18}
                      className="cursor-pointer text-red-500"
                    />
                  </Tooltip>
                  <Tooltip content={t("alerts.actions.pin")} showArrow={false}>
                    <Pin width={18} className="cursor-pointer text-blue-500" />
                  </Tooltip>
                </div>
              )}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
