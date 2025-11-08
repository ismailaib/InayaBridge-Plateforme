'use client'

import { Button } from "@/components/Button"
import { X, Pencil, GripVertical } from "lucide-react"
import { Card } from "@/components/Card"
import { Field } from "./types"
import { HTMLAttributes } from "react"

interface FieldCardProps {
  field: Field
  onDelete?: () => void
  onEdit?: () => void
  dragHandleProps?: HTMLAttributes<HTMLDivElement>
}

export default function FieldCard({ field, onDelete, onEdit, dragHandleProps }: FieldCardProps) {
  return (
    <Card className="p-2">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2 flex-1">
          <div {...dragHandleProps} className="cursor-grab text-gray-500 pt-1">
            <GripVertical width={14} />
          </div>
          <div>
            <p className="text-sm font-bold">{field.label}</p>
            <p className="text-xs text-gray-500">
              {field.name} • {field.type}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          {onEdit && (
            <Button
              variant="secondary"
              onClick={onEdit}
              className="px-2 py-1 h-auto"
            >
              <Pencil width={14} />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="secondary"
              onClick={onDelete}
              className="px-2 py-1 h-auto"
            >
              <X width={14} />
            </Button>
          )}
        </div>
      </div>

      {/* Placeholder */}
      {field.placeholder && (
        <p className="text-xs text-gray-400 italic mb-1">{field.placeholder}</p>
      )}

      {/* Text & Textarea */}
      {(field.type === 'text' || field.type === 'textarea') && field.max && (
        <p className="text-xs text-gray-400">
          Max length: {field.max} characters
        </p>
      )}

      {/* Number */}
      {field.type === 'number' && (field.min !== undefined || field.max !== undefined) && (
        <p className="text-xs text-gray-400">
          Range: {field.min ?? '∞'} - {field.max ?? '∞'}
        </p>
      )}

      {/* Date */}
      {field.type === 'date' && (
        <p className="text-xs text-gray-400">
          Format: YYYY-MM-DD
        </p>
      )}

      {/* Select / Checkbox / Radio */}
      {(field.type === 'select' || field.type === 'checkbox' || field.type === 'radio') && field.options && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 font-semibold mb-1">
            {field.options.length} option{field.options.length !== 1 ? 's' : ''}:
          </p>
          <div className="max-h-20 overflow-y-auto">
            <ul className="text-xs text-gray-400 space-y-0.5">
              {field.options.slice(0, 5).map((option, idx) => (
                <li key={idx} className="flex items-center gap-1">
                  {field.type === 'checkbox' && <span className="text-blue-500">☑</span>}
                  {field.type === 'radio' && <span className="text-blue-500">◉</span>}
                  {field.type === 'select' && <span className="text-gray-400">•</span>}
                  <span className="truncate">{option}</span>
                </li>
              ))}
              {field.options.length > 5 && (
                <li className="text-gray-400 italic">+{field.options.length - 5} more...</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </Card>
  )
}