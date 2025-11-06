import { Card } from "@/components/Card"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { Trash } from "lucide-react"
import { Handle, Position } from "reactflow"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/Select"
import { Textarea } from "@/components/Textarea "
import { Checkbox } from "@/components/Checkbox"

export default function CustomNode({
  data,
}: {
  data: {
    id: string
    title?: string
    label: string
    onDelete?: (id: string) => void
    fields?: any[]
    isStartNode?: boolean
  }
}) {
  return (
    <Card className="p-3 w-64 relative border dark:border-gray-800">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold truncate">{data.title || "Untitled"}</h2>
        {!data.isStartNode && (
          <Button
            variant="light"
            className="p-2 py-0"
            onClick={() => data.onDelete?.(data.id)}
          >
            <Trash width={12} />
          </Button>
        )}
      </div>

      <p className="text-xs text-gray-500 mb-2">{data.label}</p>

      <div className="space-y-2">
        {data.fields?.map((field, index) => (
          <div key={index}>
            <Label htmlFor={field.name} className="text-xs">{field.label}</Label>

            {field.type === 'text' && (
              <Input id={field.name} name={field.name} placeholder={field.placeholder} />
            )}

            {field.type === 'textarea' && (
              <Textarea id={field.name} name={field.name} placeholder={field.placeholder} />
            )}

            {field.type === 'number' && (
              <Input
                id={field.name}
                name={field.name}
                type="number"
                placeholder={field.placeholder}
                min={field.min}
                max={field.max}
              />
            )}

            {field.type === 'date' && (
              <Input
                id={field.name}
                name={field.name}
                type="date"
                placeholder={field.placeholder}
              />
            )}

            {field.type === 'select' && (
              <Select>
                <SelectTrigger className="w-full">
                  {field.placeholder || "Select an option"}
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((opt: string, i: number) => (
                    <SelectItem key={i} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {(field.type === 'checkbox' || field.type === 'radio') && field.options && (
              <div className="flex flex-col space-y-1 mt-1">
                {field.options.map((opt: string, i: number) => ( 
                  <div key={i}>
                      <Checkbox
                        type={field.type}
                        name={field.name}
                        value={opt}
                        className="accent-blue-500"
                      />
                      {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {!data.isStartNode && (
        <Handle type="target" position={Position.Left} className="!bg-blue-500" />
      )}
      <Handle type="source" position={Position.Right} className="!bg-green-500" />
    </Card>
  )
}
