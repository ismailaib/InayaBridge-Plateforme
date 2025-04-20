"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"

export default function SortableItem({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative mb-4 rounded p-1 dark:border-gray-700"
    >
      <button
        {...attributes}
        {...listeners}
        className="absolute right-2 top-2 cursor-grab text-gray-400 dark:text-gray-600"
      >
        <GripVertical className="size-4" />
      </button>
      {children}
    </div>
  )
}
