"use client"

import { Draggable, Droppable } from "react-beautiful-dnd"
import { PatientCard } from "./PatientCard"
import { ArrowRight } from "lucide-react"
import { cx } from "@/lib/utils"
import { useTranslations } from "@/lib/i18n/useTranslations"

interface Patient {
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

export const Section = ({
  title,
  icon: Icon,
  items,
  droppableId,
  status,
}: {
  title: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  items: Patient[]
  droppableId: keyof DataState
  status:
    | "En consultation"
    | "Salle d'attente"
    | "Rendez-vous visioconférence"
}) => {
  const t = useTranslations("waitingRoom.section")

  return (
    <div>
      <div className="mb-4 flex items-center space-x-2">
        <Icon
          className={
            status.includes("consultation")
              ? "text-blue-500"
              : "text-orange-500"
          }
          size={20}
        />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
          {title}
        </h3>
        <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold tabular-nums text-gray-700 ring-1 ring-inset ring-gray-200 dark:bg-[#090E1A] dark:text-gray-300 dark:ring-gray-800">
          {items.length}
        </span>
      </div>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-48 space-y-4 rounded-md border-2 border-dashed p-4 dark:border-gray-800"
          >
            {items.map((item, index) => (
              <Draggable
                key={item.patient}
                draggableId={item.patient}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cx(
                      "relative cursor-move transition-all",
                      snapshot.isDragging && "z-10 opacity-80",
                    )}
                  >
                    <PatientCard dossier={item} status={status} />
                    {snapshot.isDragging && (
                      <div className="absolute right-2 top-2 rounded-full bg-blue-100 p-1 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                        <ArrowRight size={16} />
                      </div>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {items.length === 0 && (
              <div className="flex h-48 items-center justify-center text-gray-500 dark:text-gray-400">
                <p>{t("noPatient")}</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}
