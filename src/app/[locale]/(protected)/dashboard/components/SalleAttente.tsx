"use client"

import { RiTimeLine } from "@remixicon/react"
import { cx } from "@/lib/utils"
import { Card } from "@/components/Card"
import { Divider } from "@/components/Divider"
import { ProgressCircle } from "@/components/ProgressCircle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs"
import {
  ClipboardPlus,
  FileText,
  MonitorDot,
  SquareActivity,
} from "lucide-react"
import { useTranslations } from "@/lib/i18n/useTranslations"

export default function PatientTracking() {
  const t = useTranslations("dashboard.patientTracking")

  const data = [
    {
      status: t("statuses.consultation"),
      icon: SquareActivity,
      iconColor: "text-blue-500",
      dossiers: [
        {
          patient: "Fatima El Amrani",
          motif: t("motifs.postOp"),
          lieu: t("locations.mainOffice"),
          remarque: t("remarks.inProgress"),
          progressionActuelle: 1,
          progressionTotale: 2,
          misAJour: t("updated", { time: "5 min" }),
        },
      ],
    },
    {
      status: t("statuses.waitingRoom"),
      icon: RiTimeLine,
      iconColor: "text-orange-500",
      dossiers: [
        {
          patient: "Mohamed Lakhlifi",
          motif: t("motifs.vertigo"),
          lieu: t("locations.roomA"),
          remarque: t("remarks.arrived"),
          progressionActuelle: 1,
          progressionTotale: 2,
          misAJour: t("updated", { time: "2 min" }),
        },
        {
          patient: "Zineb Rami",
          motif: t("motifs.pregnancy"),
          lieu: t("locations.roomA"),
          remarque: t("remarks.waiting"),
          progressionActuelle: 1,
          progressionTotale: 1,
          misAJour: t("updated", { time: "10 min" }),
        },
        {
          patient: "Amine Hafidi",
          motif: t("motifs.bloodTest"),
          lieu: t("locations.roomB"),
          remarque: t("remarks.arrived"),
          progressionActuelle: 1,
          progressionTotale: 1,
          misAJour: t("updated", { time: "15 min" }),
        },
      ],
    },
    {
      status: t("statuses.videoCall"),
      icon: MonitorDot,
      iconColor: "text-emerald-500",
      dossiers: [
        {
          patient: "Soukaina Jebari",
          motif: t("motifs.anxiety"),
          lieu: t("locations.teleconsultation", { time: "17:00" }),
          remarque: t("remarks.waiting"),
          progressionActuelle: 0,
          progressionTotale: 1,
          misAJour: t("scheduled", { time: "17:00" }),
        },
        {
          patient: "Omar El Idrissi",
          motif: t("motifs.scanner"),
          lieu: t("locations.teleconsultation", { time: "18:30" }),
          remarque: t("remarks.scheduled"),
          progressionActuelle: 0,
          progressionTotale: 1,
          misAJour: t("scheduled", { time: "18:30" }),
        },
        {
          patient: "Sofia Berrada",
          motif: t("motifs.diabetes"),
          lieu: t("locations.teleconsultation", { time: "19:00" }),
          remarque: t("remarks.toConfirm"),
          progressionActuelle: 0,
          progressionTotale: 1,
          misAJour: t("scheduled", { time: "19:00" }),
        },
      ],
    },
  ]

  const statusColor = {
    [t("statuses.consultation")]:
      "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20",
    [t("statuses.waitingRoom")]:
      "bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/20",
    [t("statuses.videoCall")]:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",
  }

  return (
    <Card className="mt-6 bg-gray-50 p-0 dark:bg-gray-900">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          {t("title")}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          {t("description")}
        </p>
      </div>
      <Tabs defaultValue={data[0].status}>
        <TabsList className="bg-gray-50 px-6 dark:bg-gray-900">
          {data.map((category) => (
            <TabsTrigger
              key={category.status}
              value={category.status}
              className="group"
            >
              <div className="sm:flex sm:items-center sm:space-x-2">
                <category.icon
                  className={cx(category.iconColor, "hidden size-5 sm:block")}
                  aria-hidden={true}
                />
                <span className="group-data-[state=active]:text-gray-900 group-data-[state=active]:dark:text-gray-50">
                  {category.status}
                </span>
                <span className="hidden rounded-md bg-white px-2 py-1 text-xs font-semibold tabular-nums ring-1 ring-inset ring-gray-200 group-data-[state=active]:text-gray-700 sm:block dark:bg-[#090E1A] dark:ring-gray-800 group-data-[state=active]:dark:text-gray-300">
                  {category.dossiers.length}
                </span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        <ul role="list" className="rounded-b-md bg-white dark:bg-gray-950">
          {data.map((category) => (
            <TabsContent
              key={category.status}
              value={category.status}
              className="space-y-4 p-6"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {category.dossiers.map((dossier) => (
                  <Card
                    key={dossier.patient}
                    asChild
                    className="dark:border-gray-800"
                  >
                    <li>
                      <div className="flex items-center justify-between space-x-4 sm:justify-start sm:space-x-2">
                        <h4 className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                          {dossier.patient}
                        </h4>
                        <span
                          className={cx(
                            statusColor[category.status],
                            "inline-flex items-center whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                          )}
                        >
                          {category.status}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
                        <div className="flex items-center space-x-1.5">
                          <ClipboardPlus
                            width={18}
                            className="text-gray-400 dark:text-gray-600"
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {dossier.motif}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <FileText
                            width={18}
                            className="text-gray-400 dark:text-gray-600"
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t("labels.description")}
                          </p>
                        </div>
                      </div>
                      <Divider />
                      <div className="block sm:flex sm:items-center sm:justify-between sm:space-x-2">
                        <div className="flex items-center space-x-2">
                          <ProgressCircle
                            value={
                              (dossier.progressionActuelle /
                                dossier.progressionTotale) *
                              100
                            }
                            radius={9}
                            strokeWidth={3.5}
                          />
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                            {t("labels.consultations")} (
                            {dossier.progressionActuelle}/
                            {dossier.progressionTotale})
                          </p>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 sm:mt-0 dark:text-gray-500">
                          {dossier.misAJour}
                        </p>
                      </div>
                    </li>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </ul>
      </Tabs>
    </Card>
  )
}
