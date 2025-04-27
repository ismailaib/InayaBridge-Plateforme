"use client"

import { useState } from "react"
import { DragDropContext, DropResult } from "react-beautiful-dnd"

import { ClockFading, SquareActivity } from "lucide-react"
import { Section } from "./Section"

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

const initialData = {
  consultation: [
    {
      patient: "Fatima El Amrani",
      motif: "Suivi post-opératoire",
      lieu: "Cabinet principal",
      remarque: "Consultation en cours",
      progressionActuelle: 1,
      progressionTotale: 2,
      misAJour: "il y a 5 min",
    },
  ],
  salleAttente: [
    {
      patient: "Mohamed Lakhlifi",
      motif: "Vertiges",
      lieu: "Salle A",
      remarque: "Patient arrivé",
      progressionActuelle: 1,
      progressionTotale: 2,
      misAJour: "il y a 2 min",
    },
    {
      patient: "Zineb Rami",
      motif: "Suivi de grossesse",
      lieu: "Salle A",
      remarque: "En attente",
      progressionActuelle: 1,
      progressionTotale: 1,
      misAJour: "il y a 10 min",
    },
    {
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
      patient: "Soukaina Jebari",
      motif: "Anxiété",
      lieu: "Téléconsultation - 17:00",
      remarque: "En attente",
      progressionActuelle: 0,
      progressionTotale: 1,
      misAJour: "prévu à 17:00",
    },
    {
      patient: "Omar El Idrissi",
      motif: "Résultats scanner",
      lieu: "Téléconsultation - 18:30",
      remarque: "Prévu",
      progressionActuelle: 0,
      progressionTotale: 1,
      misAJour: "prévu à 18:30",
    },
    {
      patient: "Sofia Berrada",
      motif: "Contrôle diabète",
      lieu: "Téléconsultation - 19:00",
      remarque: "À confirmer",
      progressionActuelle: 0,
      progressionTotale: 1,
      misAJour: "prévu à 19:00",
    },
  ],
}

export default function CardsView() {
  const [data, setData] = useState<DataState>(initialData)

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(data[source.droppableId as keyof DataState])
      const [movedItem] = items.splice(source.index, 1)
      items.splice(destination.index, 0, movedItem)

      setData((prev) => ({
        ...prev,
        [source.droppableId]: items,
      }))
    } else {
      const sourceList = Array.from(data[source.droppableId as keyof DataState])
      const destList = Array.from(
        data[destination.droppableId as keyof DataState],
      )
      const [movedItem] = sourceList.splice(source.index, 1)
      destList.splice(destination.index, 0, movedItem)

      setData((prev) => ({
        ...prev,
        [source.droppableId]: sourceList,
        [destination.droppableId]: destList,
      }))
    }
  }

  return (
    <div className="mt-6">
        <div className="rounded-b-md bg-white dark:bg-gray-950">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <Section
                  title="En consultation"
                  icon={SquareActivity}
                  items={data.consultation}
                  droppableId="consultation"
                  status={"En consultation"}
                />
                <Section
                  title="Salle d'attente"
                  icon={ClockFading}
                  items={data.salleAttente}
                  droppableId="salleAttente"
                  status={"Salle d'attente"}
                />
              </div>
            </div>
          </DragDropContext>
        </div>
      
    </div>
  )
}
