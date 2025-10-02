"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import invariant from "tiny-invariant"

import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine"
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder"
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index"

import { cx } from "@/lib/utils"
import { useTranslations } from "@/lib/i18n/useTranslations"
import { ClockFading, MonitorDot, SquareActivity } from "lucide-react"

/* ---------- Types ---------- */

type StatusKey = "consultation" | "waitingRoom" | "video"
type MotifKey =
  | "postOpFollowUp"
  | "vertigo"
  | "pregnancyFollowUp"
  | "bloodTest"
  | "anxiety"
  | "scanResults"
  | "diabetesControl"
type RemarkKey =
  | "inProgress"
  | "arrived"
  | "waiting"
  | "scheduled"
  | "toConfirm"

type LocationInfo =
  | { key: "mainOffice" | "roomA" | "roomB" }
  | { key: "teleconsultation"; time: string }

type UpdatedInfo =
  | { type: "minutesAgo"; count: number }
  | { type: "scheduledAt"; time: string }

type IconComponent = (props: { className?: string }) => JSX.Element

type BasePatient = {
  id: string
  name: string
  motifKey: MotifKey
  location: LocationInfo
  remarkKey: RemarkKey
  progressCurrent: number
  progressTotal: number
  updated: UpdatedInfo
}

type Patient = {
  id: string
  patient: string
  motif: string
  lieu: string
  remarque: string
  progressionActuelle: number
  progressionTotale: number
  misAJour: string
}

type DataState = Record<StatusKey, Patient[]>

type ColumnConfig = {
  status: StatusKey
  icon: IconComponent
  iconColor: string
  patients: BasePatient[]
}

const STATUS_BADGE_STYLES: Record<StatusKey, string> = {
  consultation:
    "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20",
  waitingRoom:
    "bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/20",
  video:
    "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20",
}

const COLUMNS: ColumnConfig[] = [
  {
    status: "consultation",
    icon: SquareActivity,
    iconColor: "text-blue-500",
    patients: [
      {
        id: "patient-1",
        name: "Fatima El Amrani",
        motifKey: "postOpFollowUp",
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
    icon: ClockFading,
    iconColor: "text-orange-500",
    patients: [
      {
        id: "patient-2",
        name: "Mohamed Lakhlifi",
        motifKey: "vertigo",
        location: { key: "roomA" },
        remarkKey: "arrived",
        progressCurrent: 1,
        progressTotal: 2,
        updated: { type: "minutesAgo", count: 2 },
      },
      {
        id: "patient-3",
        name: "Zineb Rami",
        motifKey: "pregnancyFollowUp",
        location: { key: "roomA" },
        remarkKey: "waiting",
        progressCurrent: 1,
        progressTotal: 1,
        updated: { type: "minutesAgo", count: 10 },
      },
      {
        id: "patient-4",
        name: "Amine Hafidi",
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
    status: "video",
    icon: MonitorDot,
    iconColor: "text-blue-500",
    patients: [
      {
        id: "patient-5",
        name: "Soukaina Jebari",
        motifKey: "anxiety",
        location: { key: "teleconsultation", time: "17:00" },
        remarkKey: "waiting",
        progressCurrent: 0,
        progressTotal: 1,
        updated: { type: "scheduledAt", time: "17:00" },
      },
      {
        id: "patient-6",
        name: "Omar El Idrissi",
        motifKey: "scanResults",
        location: { key: "teleconsultation", time: "18:30" },
        remarkKey: "scheduled",
        progressCurrent: 0,
        progressTotal: 1,
        updated: { type: "scheduledAt", time: "18:30" },
      },
      {
        id: "patient-7",
        name: "Sofia Berrada",
        motifKey: "diabetesControl",
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
    return t("updatedTimes.minutesAgo", { count: updated.count })
  }

  return t("scheduled", { time: updated.time })
}

const toLocalizedPatient = (
  patient: BasePatient,
  t: ReturnType<typeof useTranslations>,
) => ({
  id: patient.id,
  patient: patient.name,
  motif: t(`motifs.${patient.motifKey}`),
  lieu: getLocationLabel(t, patient.location),
  remarque: t(`remarks.${patient.remarkKey}`),
  progressionActuelle: patient.progressCurrent,
  progressionTotale: patient.progressTotal,
  misAJour: getUpdatedLabel(t, patient.updated),
})

/* ---------- Patient card ---------- */
function PatientCard({
  patient,
  statusKey,
  statusLabel,
}: {
  patient: Patient
  statusKey: StatusKey
  statusLabel: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const el = ref.current
    invariant(el)

    return combine(
      draggable({
        element: el,
        getInitialData: () => ({ type: "patient", id: patient.id }),
        onDragStart: () => setDragging(true),
        onDrop: () => setDragging(false),
      }),
      dropTargetForElements({
        element: el,
        getData: ({ input, element }) =>
          attachClosestEdge(
            { type: "patient", id: patient.id },
            { input, element, allowedEdges: ["top", "bottom"] },
          ),
        getIsSticky: () => true,
      }),
    )
  }, [patient.id])

  const progress =
    (patient.progressionActuelle / patient.progressionTotale) * 100

  return (
    <div
      ref={ref}
      className={cx(
        "mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900",
        dragging && "shadow-lg ring-2 ring-blue-500",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-900 dark:text-white">
          {patient.patient}
        </span>
        <span
          className={cx(
            "rounded-full px-2.5 py-0.5 text-xs font-medium",
            STATUS_BADGE_STYLES[statusKey],
          )}
        >
          {statusLabel}
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {patient.motif}
      </p>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        {patient.lieu}
      </div>

      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {patient.remarque}
      </div>

      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {patient.misAJour}
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          style={{ width: `${progress}%` }}
          className="h-full rounded-full bg-blue-500 dark:bg-blue-400"
        />
      </div>
    </div>
  )
}

/* ---------- Column / Section ---------- */
function Section({
  id,
  title,
  statusKey,
  statusLabel,
  icon: Icon,
  iconColor,
  items,
}: {
  id: StatusKey
  title: string
  statusKey: StatusKey
  statusLabel: string
  icon: IconComponent
  iconColor: string
  items: Patient[]
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [highlight, setHighlight] = useState(false)
  const sectionTranslations = useTranslations("appointments.waitingRoom.section")

  useEffect(() => {
    const el = ref.current
    invariant(el)

    return dropTargetForElements({
      element: el,
      getData: () => ({ type: "column", columnId: id }),
      getIsSticky: () => true,
      onDragEnter: () => setHighlight(true),
      onDragLeave: () => setHighlight(false),
      onDrop: () => setHighlight(false),
    })
  }, [id])

  return (
    <div
      ref={ref}
      className={cx(
        "rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950",
        highlight && "bg-blue-50 dark:bg-blue-900/10",
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <Icon className={cx("h-5 w-5", iconColor)} />
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {items.length}
        </span>
      </div>

      {items.length === 0 && (
        <div className="flex h-48 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          {sectionTranslations("noPatient")}
        </div>
      )}

      {items.map((patient) => (
        <PatientCard
          key={patient.id}
          patient={patient}
          statusKey={statusKey}
          statusLabel={statusLabel}
        />
      ))}
    </div>
  )
}

/* ---------- Main board ---------- */
export default function CardsView() {
  const t = useTranslations("appointments.waitingRoom.patientTracking")

  const localizedInitialData = useMemo<DataState>(() => {
    return COLUMNS.reduce((acc, column) => {
      acc[column.status] = column.patients.map((patient) =>
        toLocalizedPatient(patient, t),
      )
      return acc
    }, {
      consultation: [],
      waitingRoom: [],
      video: [],
    } as DataState)
  }, [t])

  const statusLabels = useMemo(
    () => ({
      consultation: t("statuses.inConsultation"),
      waitingRoom: t("statuses.waitingRoom"),
      video: t("statuses.video"),
    }),
    [t],
  )

  const [data, setData] = useState<DataState>(localizedInitialData)

  useEffect(() => {
    setData(localizedInitialData)
  }, [localizedInitialData])

  const reorderCard = useCallback(
    (columnId: StatusKey, startIndex: number, finishIndex: number) => {
      const updated = reorder({
        list: data[columnId],
        startIndex,
        finishIndex,
      })
      setData((prev) => ({ ...prev, [columnId]: updated }))
    },
    [data],
  )

  const moveCard = useCallback(
    ({
      cardId,
      sourceColumn,
      destinationColumn,
      destinationIndex,
    }: {
      cardId: string
      sourceColumn: StatusKey
      destinationColumn: StatusKey
      destinationIndex: number
    }) => {
      const card = data[sourceColumn].find((c) => c.id === cardId)
      if (!card) return

      setData((prev) => {
        const newSource = prev[sourceColumn].filter((c) => c.id !== cardId)
        const newDestination = Array.from(prev[destinationColumn])
        newDestination.splice(destinationIndex, 0, card)
        return {
          ...prev,
          [sourceColumn]: newSource,
          [destinationColumn]: newDestination,
        }
      })
    },
    [data],
  )

  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        if (!location.current.dropTargets.length) return

        const draggedId = source.data.id as string

        let sourceColumnId: StatusKey | null = null
        for (const column of Object.keys(data) as StatusKey[]) {
          if (data[column].some((item) => item.id === draggedId)) {
            sourceColumnId = column
            break
          }
        }

        if (!sourceColumnId) return

        const startIndex = data[sourceColumnId].findIndex(
          (patient) => patient.id === draggedId,
        )

        if (location.current.dropTargets.length === 1) {
          const [destColumnTarget] = location.current.dropTargets
          const destinationColumnId = destColumnTarget.data
            .columnId as StatusKey

          if (sourceColumnId === destinationColumnId) {
            const finishIndex = getReorderDestinationIndex({
              startIndex,
              indexOfTarget: data[sourceColumnId].length - 1,
              closestEdgeOfTarget: null,
              axis: "vertical",
            })
            reorderCard(sourceColumnId, startIndex, finishIndex)
          } else {
            moveCard({
              cardId: draggedId,
              sourceColumn: sourceColumnId,
              destinationColumn: destinationColumnId,
              destinationIndex: data[destinationColumnId].length,
            })
          }
          return
        }

        const [cardTarget, columnTarget] = location.current.dropTargets
        const destinationColumnId = columnTarget.data.columnId as StatusKey
        const { closestEdge } = cardTarget.data
        const indexOfTarget = data[destinationColumnId].findIndex(
          (patient) => patient.id === cardTarget.data.id,
        )

        const finishIndex =
          closestEdge === "bottom" ? indexOfTarget + 1 : indexOfTarget

        if (sourceColumnId === destinationColumnId) {
          reorderCard(destinationColumnId, startIndex, finishIndex)
        } else {
          moveCard({
            cardId: draggedId,
            sourceColumn: sourceColumnId,
            destinationColumn: destinationColumnId,
            destinationIndex: finishIndex,
          })
        }
      },
    })
  }, [data, reorderCard, moveCard])

  return (
    <div className="mt-6">
      <div className="rounded-b-md bg-white dark:bg-gray-950">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {COLUMNS.map((column) => (
            <Section
              key={column.status}
              id={column.status}
              title={statusLabels[column.status]}
              statusKey={column.status}
              statusLabel={statusLabels[column.status]}
              icon={column.icon}
              iconColor={column.iconColor}
              items={data[column.status]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}