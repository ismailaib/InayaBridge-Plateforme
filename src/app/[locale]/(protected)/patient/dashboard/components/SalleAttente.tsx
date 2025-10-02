"use client"

import { RiTimeLine } from "@remixicon/react"
import type { ComponentType } from "react"

import { Card } from "@/components/Card"
import { Divider } from "@/components/Divider"
import { ProgressCircle } from "@/components/ProgressCircle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs"
import { cx } from "@/lib/utils"
import { useTranslations } from "@/lib/i18n/useTranslations"
import {
  ClipboardPlus,
  FileText,
  MonitorDot,
  SquareActivity,
} from "lucide-react"

type StatusKey = "consultation" | "waitingRoom" | "videoCall"
type MotifKey =
  | "postOp"
  | "vertigo"
  | "pregnancy"
  | "bloodTest"
  | "anxiety"
  | "scanner"
  | "diabetes"
type RemarkKey = "inProgress" | "arrived" | "waiting" | "scheduled" | "toConfirm"

type LocationInfo =
  | { key: "mainOffice" | "roomA" | "roomB" }
  | { key: "teleconsultation"; time: string }

type UpdatedInfo =
  | { type: "minutesAgo"; count: number }
  | { type: "scheduledAt"; time: string }

type IconComponent = ComponentType<{ className?: string }>

type Dossier = {
  patient: string
  motifKey: MotifKey
  location: LocationInfo
  remarkKey: RemarkKey
  progressCurrent: number
  progressTotal: number
  updated: UpdatedInfo
}

type Category = {
  status: StatusKey
  icon: IconComponent
  iconColor: string
  dossiers: Dossier[]
}

const STATUS_BADGE_STYLES: Record<StatusKey, string> = {
  consultation:
    "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20",
  waitingRoom:
    "bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/20",
  videoCall:
    "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20",
}

const PATIENT_TRACKING_DATA: Category[] = [
  {
    status: "consultation",
    icon: SquareActivity,
    iconColor: "text-blue-500",
    dossiers: [
      {
        patient: "Fatima El Amrani",
        motifKey: "postOp",
        location: { key: "mainOffice" },
        remarkKey: "inProgress",
        progressCurrent: 1,
        progressTotal: 2,
        updated: { type: "minutesAgo", count: 5 },
      },
    ],
  },
  {
    status: "waitingRoom",
    icon: RiTimeLine,
    iconColor: "text-orange-500",
    dossiers: [
      {
        patient: "Mohamed Lakhlifi",
        motifKey: "vertigo",
        location: { key: "roomA" },
        remarkKey: "arrived",
        progressCurrent: 1,
        progressTotal: 2,
        updated: { type: "minutesAgo", count: 2 },
      },
      {
        patient: "Zineb Rami",
        motifKey: "pregnancy",
        location: { key: "roomA" },
        remarkKey: "waiting",
        progressCurrent: 1,
        progressTotal: 1,
        updated: { type: "minutesAgo", count: 10 },
      },
      {
        patient: "Amine Hafidi",
        motifKey: "bloodTest",
        location: { key: "roomB" },
        remarkKey: "arrived",
        progressCurrent: 1,
        progressTotal: 1,
        updated: { type: "minutesAgo", count: 15 },
      },
    ],
  },
  {
    status: "videoCall",
    icon: MonitorDot,
    iconColor: "text-blue-500",
    dossiers: [
      {
        patient: "Soukaina Jebari",
        motifKey: "anxiety",
        location: { key: "teleconsultation", time: "17:00" },
        remarkKey: "waiting",
        progressCurrent: 0,
        progressTotal: 1,
        updated: { type: "scheduledAt", time: "17:00" },
      },
      {
        patient: "Omar El Idrissi",
        motifKey: "scanner",
        location: { key: "teleconsultation", time: "18:30" },
        remarkKey: "scheduled",
        progressCurrent: 0,
        progressTotal: 1,
        updated: { type: "scheduledAt", time: "18:30" },
      },
      {
        patient: "Sofia Berrada",
        motifKey: "diabetes",
        location: { key: "teleconsultation", time: "19:00" },
        remarkKey: "toConfirm",
        progressCurrent: 0,
        progressTotal: 1,
        updated: { type: "scheduledAt", time: "19:00" },
      },
    ],
  },
]

const getLocationLabel = (
  t: ReturnType<typeof useTranslations>,
  location: LocationInfo,
) => {
  if (location.key === "teleconsultation") {
    return t("locations.teleconsultation", { time: location.time })
  }

  return t(`locations.${location.key}`)
}

const getUpdatedLabel = (
  t: ReturnType<typeof useTranslations>,
  updated: UpdatedInfo,
) => {
  if (updated.type === "minutesAgo") {
    return t("updated", {
      time: t("updatedTimes.minutesAgo", { count: updated.count }),
    })
  }

  return t("scheduled", { time: updated.time })
}

export default function PatientTracking() {
  const t = useTranslations("dashboard.patientTracking")

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
      <Tabs defaultValue={PATIENT_TRACKING_DATA[0]?.status ?? "consultation"}>
        <TabsList className="bg-gray-50 px-6 dark:bg-gray-900">
          {PATIENT_TRACKING_DATA.map((category) => {
            const Icon = category.icon
            return (
              <TabsTrigger
                key={category.status}
                value={category.status}
                className="group"
              >
                <div className="sm:flex sm:items-center sm:space-x-2">
                  <Icon
                    className={cx(category.iconColor, "hidden size-5 sm:block")}
                    aria-hidden="true"
                  />
                  <span className="group-data-[state=active]:text-gray-900 group-data-[state=active]:dark:text-gray-50">
                    {t(`statuses.${category.status}`)}
                  </span>
                  <span className="hidden rounded-md bg-white px-2 py-1 text-xs font-semibold tabular-nums ring-1 ring-inset ring-gray-200 group-data-[state=active]:text-gray-700 sm:block dark:bg-[#090E1A] dark:ring-gray-800 group-data-[state=active]:dark:text-gray-300">
                    {category.dossiers.length}
                  </span>
                </div>
              </TabsTrigger>
            )
          })}
        </TabsList>
        <ul role="list" className="rounded-b-md bg-white dark:bg-gray-950">
          {PATIENT_TRACKING_DATA.map((category) => (
            <TabsContent
              key={category.status}
              value={category.status}
              className="space-y-4 p-6"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {category.dossiers.map((dossier) => (
                  <Card
                    key={`${category.status}-${dossier.patient}`}
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
                            STATUS_BADGE_STYLES[category.status],
                            "inline-flex items-center whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                          )}
                        >
                          {t(`statuses.${category.status}`)}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
                        <div className="flex items-center space-x-1.5">
                          <ClipboardPlus
                            width={18}
                            className="text-gray-400 dark:text-gray-600"
                            aria-hidden="true"
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t(`motifs.${dossier.motifKey}`)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <FileText
                            width={18}
                            className="text-gray-400 dark:text-gray-600"
                            aria-hidden="true"
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t("labels.descriptionPlaceholder")}
                          </p>
                        </div>
                      </div>
                      <Divider />
                      <div className="block sm:flex sm:items-center sm:justify-between sm:space-x-2">
                        <div className="flex items-center space-x-2">
                          <ProgressCircle
                            value={(dossier.progressCurrent / dossier.progressTotal) * 100}
                            radius={9}
                            strokeWidth={3.5}
                          />
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                            {t("labels.consultations", {
                              current: dossier.progressCurrent,
                              total: dossier.progressTotal,
                            })}
                          </p>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 sm:mt-0 dark:text-gray-500">
                          {getUpdatedLabel(t, dossier.updated)}
                        </p>
                      </div>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {getLocationLabel(t, dossier.location)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t(`remarks.${dossier.remarkKey}`)}
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