'use client'

import { Card } from "@/components/Card"
import { Button } from "@/components/Button"
import { 
  CaseSensitive, 
  ScanText, 
  Binary, 
  CalendarClock, 
  Rows3, 
  CheckSquare,
  Circle
} from "lucide-react"
import { ReactElement } from 'react'

import { FieldType } from "./types";

interface FieldTypeSelectorProps {
  onSelect: (type: FieldType) => void;
  onCancel: () => void;
}

export default function FieldTypeSelector({ onSelect, onCancel }: FieldTypeSelectorProps) { // eslint-disable-line no-unused-vars
  const fieldTypes: { value: FieldType; label: string; icon: ReactElement; description: string }[] = [
    { 
      value: 'text', 
      label: 'Text', 
      icon: <CaseSensitive width={18}/>, 
      description: 'Single line text input' 
    },
    { 
      value: 'textarea', 
      label: 'Textarea', 
      icon: <ScanText width={18}/>, 
      description: 'Multi-line text input' 
    },
    { 
      value: 'number', 
      label: 'Number', 
      icon: <Binary width={18}/>, 
      description: 'Numeric input' 
    },
    { 
      value: 'date', 
      label: 'Date', 
      icon: <CalendarClock width={18}/>, 
      description: 'Date picker' 
    },
    { 
      value: 'select', 
      label: 'Select', 
      icon: <Rows3 width={18}/>, 
      description: 'Dropdown with options' 
    },
    { 
      value: 'checkbox', 
      label: 'Checkbox', 
      icon: <CheckSquare width={18}/>, 
      description: 'Multiple selection' 
    }
  ]

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">Sélectionner un type de champ</h3>
      <div className="grid grid-cols-2 gap-2">
        {fieldTypes.map((fieldType) => (
          <Card
            key={fieldType.value}
            className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 dark:bg-gray-950 transition-colors border-2 "
            onClick={() => onSelect(fieldType.value)}
          >
            <div className="mb-2">{fieldType.icon}</div>
            <div className="font-semibold text-sm">{fieldType.label}</div>
            <div className="text-xs text-gray-500">{fieldType.description}</div>
          </Card>
        ))}
      </div>
      <Button onClick={onCancel} variant="secondary" className="w-full">
        Annuler
      </Button>
    </div>
  )
}