"use client"
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useState } from "react"
import SortableItem from "./components/SortableItem"
import Kpis from "./components/Kpis"
import Statistics from "./components/Statistics"
import Reporting from "./components/Reporting"
import SalleAttente from "./components/SalleAttente"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"

const initialWidgets = [
  { id: "Kpis", component: <Kpis /> },
  { id: "Statistics", component: <Statistics /> },
  { id: "Reporting", component: <Reporting /> },
  { id: "SalleAttente", component: <SalleAttente /> },
]

const monthSelect = [
  { label: "Janvier", value: "janvier" },
  { label: "Février", value: "février" },
  { label: "Mars", value: "mars" },
  { label: "Avril", value: "avril" },
  { label: "Mai", value: "mai" },
  { label: "Juin", value: "juin" },
  { label: "Juillet", value: "juillet" },
  { label: "Août", value: "août" },
  { label: "Septembre", value: "septembre" },
  { label: "Octobre", value: "octobre" },
  { label: "Novembre", value: "novembre" },
  { label: "Décembre", value: "décembre" },
]

const yearSelect = [
  { label: "2025", value: "2025" },
  { label: "2024", value: "2024" },
  { label: "2023", value: "2023" },
  { label: "2022", value: "2022" },
  { label: "2021", value: "2021" },
  { label: "2020", value: "2020" },
]

export default function DashboardMain() {
  const [widgets, setWidgets] = useState(initialWidgets)
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id)
      const newIndex = widgets.findIndex((w) => w.id === over?.id)
      setWidgets(arrayMove(widgets, oldIndex, newIndex))
    }
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8">
       <header>
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Bienvenue Dr. Ismail
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:mt-0 sm:flex-row sm:items-center">
            <div className="w-[150px]">
              <Select>
                <SelectTrigger id="size" className="mt-2">
                  <SelectValue placeholder="Mois" />
                </SelectTrigger>
                <SelectContent>
                  {monthSelect.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[150px]">
              <Select>
                <SelectTrigger id="size" className="mt-2">
                  <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
                  {yearSelect.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={widgets.map((w) => w.id)}
          strategy={verticalListSortingStrategy}
        >
          {widgets.map((widget) => (
            <SortableItem key={widget.id} id={widget.id}>
              {widget.component}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </main>
  )
}
