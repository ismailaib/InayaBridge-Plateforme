"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import invariant from "tiny-invariant"

// Pragmatic DnD – element adapter helpers
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine"
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"

// Utilities for reordering and moving items
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder"
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index"

// Icons
import { ClockFading, SquareActivity, Users } from "lucide-react"

/* ---------- Types & Initial data ---------- */
interface Patient {
  id: string
  patient: string
  motif: string
  lieu: string
  remarque: string
  progressionActuelle: number
  progressionTotale: number
  misAJour: string
}

interface DataState {
  consultation: Patient[]
  salleAttente: Patient[]
  visioconference: Patient[]
}

const initialData: DataState = {
  consultation: [
    {
      id: "patient-1",
      patient: "Fatima El Amrani",
      motif: "Suivi post‑opératoire",
      lieu: "Cabinet principal",
      remarque: "Consultation en cours",
      progressionActuelle: 1,
      progressionTotale: 2,
      misAJour: "il y a 5 min",
    },
  ],
  salleAttente: [
    {
      id: "patient-2",
      patient: "Mohamed Lakhlifi",
      motif: "Vertiges",
      lieu: "Salle A",
      remarque: "Patient arrivé",
      progressionActuelle: 1,
      progressionTotale: 2,
      misAJour: "il y a 2 min",
    },
    {
      id: "patient-3",
      patient: "Zineb Rami",
      motif: "Suivi de grossesse",
      lieu: "Salle A",
      remarque: "En attente",
      progressionActuelle: 1,
      progressionTotale: 1,
      misAJour: "il y a 10 min",
    },
    {
      id: "patient-4",
      patient: "Amine Hafidi",
      motif: "Bilan sanguin",
      lieu: "Salle B",
      remarque: "Arrivé",
      progressionActuelle: 1,
      progressionTotale: 1,
      misAJour: "il y a 15 min",
    },
  ],
  visioconference: [
    {
      id: "patient-5",
      patient: "Soukaina Jebari",
      motif: "Anxiété",
      lieu: "Téléconsultation ‑ 17:00",
      remarque: "En attente",
      progressionActuelle: 0,
      progressionTotale: 1,
      misAJour: "prévu à 17:00",
    },
    {
      id: "patient-6",
      patient: "Omar El Idrissi",
      motif: "Résultats scanner",
      lieu: "Téléconsultation ‑ 18:30",
      remarque: "Prévu",
      progressionActuelle: 0,
      progressionTotale: 1,
      misAJour: "prévu à 18:30",
    },
    {
      id: "patient-7",
      patient: "Sofia Berrada",
      motif: "Contrôle diabète",
      lieu: "Téléconsultation ‑ 19:00",
      remarque: "À confirmer",
      progressionActuelle: 0,
      progressionTotale: 1,
      misAJour: "prévu à 19:00",
    },
  ],
}

/* ---------- Patient card ---------- */
function PatientCard({ patient }: { patient: Patient }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const el = ref.current
    invariant(el)

    return combine(
      // make the card *draggable*
      draggable({
        element: el,
        getInitialData: () => ({ type: "patient", id: patient.id }),
        onDragStart: () => setDragging(true),
        onDrop: () => setDragging(false),
      }),
      // …and also a *drop target* (so we can drop above/below another card)
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
      className={`mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900 ${
        dragging ? "shadow-lg ring-2 ring-blue-500" : ""
      }`}
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-900 dark:text-white">
          {patient.patient}
        </span>
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          {patient.lieu}
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {patient.motif}
      </p>

      {/* meta + progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">
            {patient.remarque}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            {patient.misAJour}
          </span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            style={{ width: `${progress}%` }}
            className="h-full rounded-full bg-blue-500 dark:bg-blue-400"
          />
        </div>
      </div>
    </div>
  )
}

/* ---------- Column / Section ---------- */
function Section(props: {
  id: keyof DataState
  title: string
  icon: any
  items: Patient[]
}) {
  const { id, title, icon: Icon, items } = props
  const ref = useRef<HTMLDivElement | null>(null)
  const [highlight, setHighlight] = useState(false)

  // register column as a drop target
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
      className={`rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950 ${
        highlight ? "bg-blue-50 dark:bg-blue-900/10" : ""
      }`}
    >
      {/* column header */}
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {items.length}
        </span>
      </div>

      {/* all cards */}
      {items.map((p) => (
        <PatientCard key={p.id} patient={p} />
      ))}
    </div>
  )
}

/* ---------- Main board ---------- */
export default function CardsView() {
  const [data, setData] = useState<DataState>(initialData)

  /* -- helpers --------------------------------------------------------- */
  const reorderCard = useCallback(
    (columnId: keyof DataState, startIndex: number, finishIndex: number) => {
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
      sourceColumn: keyof DataState
      destinationColumn: keyof DataState
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

  /* -- global drop monitor -------------------------------------------- */
  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        // No destination? abort.
        if (!location.current.dropTargets.length) return

        const draggedId = source.data.id as string

        // Find which column the card is coming from
        let sourceColumnId: keyof DataState | null = null

        // Check each column to find which one contains the dragged card
        for (const column of Object.keys(data) as Array<keyof DataState>) {
          if (data[column].some((item) => item.id === draggedId)) {
            sourceColumnId = column
            break
          }
        }

        // If we couldn't find the source column, abort
        if (!sourceColumnId) return

        const startIndex = data[sourceColumnId].findIndex(
          (p) => p.id === draggedId,
        )

        // ── Only one drop target → dropped in empty space  ───────────
        if (location.current.dropTargets.length === 1) {
          const [destColumnTarget] = location.current.dropTargets
          const destinationColumnId = destColumnTarget.data
            .columnId as keyof DataState

          if (sourceColumnId === destinationColumnId) {
            // reorder inside same column
            const finishIndex = getReorderDestinationIndex({
              startIndex,
              indexOfTarget: data[sourceColumnId].length - 1,
              closestEdgeOfTarget: null,
              axis: "vertical",
            })
            reorderCard(sourceColumnId, startIndex, finishIndex)
          } else {
            // move to bottom of another column
            moveCard({
              cardId: draggedId,
              sourceColumn: sourceColumnId,
              destinationColumn: destinationColumnId,
              destinationIndex: data[destinationColumnId].length,
            })
          }
          return
        }

        /* Two drop targets (card + column) → dropped on another card  */
        const [cardTarget, columnTarget] = location.current.dropTargets
        const destColumnId = columnTarget.data.columnId as keyof DataState
        const { closestEdge } = cardTarget.data
        const indexOfTarget = data[destColumnId].findIndex(
          (p) => p.id === cardTarget.data.id,
        )

        const finishIndex =
          closestEdge === "bottom" ? indexOfTarget + 1 : indexOfTarget

        if (sourceColumnId === destColumnId) {
          reorderCard(destColumnId, startIndex, finishIndex)
        } else {
          moveCard({
            cardId: draggedId,
            sourceColumn: sourceColumnId,
            destinationColumn: destColumnId,
            destinationIndex: finishIndex,
          })
        }
      },
    })
  }, [data, reorderCard, moveCard])

  /* -- render ---------------------------------------------------------- */
  return (
    <div className="mt-6">
      <div className="rounded-b-md bg-white dark:bg-gray-950">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-2">
          <Section
            id="consultation"
            title="En consultation"
            icon={SquareActivity}
            items={data.consultation}
          />
          <Section
            id="salleAttente"
            title="Salle d'attente"
            icon={ClockFading}
            items={data.salleAttente}
          />
        </div>
      </div>
    </div>
  )
}
