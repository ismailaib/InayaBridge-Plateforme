'use client'

import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Checkbox } from "@/components/Checkbox"
import { DatePicker } from "@/components/DatePicker"
import { Divider } from "@/components/Divider"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { Textarea } from "@/components/Textarea "
import { Trash } from "lucide-react"
import { Handle, Position } from "reactflow"
import { useContext } from "react"
import { ApercuContext } from "../page"

export default function CustomNode({
  data,
}: {
  data: {
    id: string
    title?: string
    label: string
    description?: string
    onDelete?: (id: string) => void
    fields?: any[]
    isStartNode?: boolean
  }
}) {
  const showApercu = useContext(ApercuContext)

  return (
    <Card
      className={`p-3 w-72 relative transition-all duration-200 min-h-[100px] ${
        !showApercu ? "min-h-[100px] flex flex-col justify-between" : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-semibold truncate">{data.title || "Untitled"}</h2>
          <p className="text-xs text-gray-5 mb-2 text-gray-400">{data.description}</p>
        </div>
        {data.id !== "1" && (
          <Button
            variant="light"
            className="p-3 py-1"
            onClick={() => data.onDelete?.(data.id)}
          >
            <Trash width={12} />
          </Button>
        )}
      </div>

      {data?.fields?.length && data?.fields?.length > 0 && showApercu ? (
        <>
          <Divider />
          <div className="space-y-2" id="apercu-form">
            {data.fields?.map((field, index) => (
              <div key={index}>
                <Label htmlFor={field.name} className="text-xs">
                  {field.label}
                </Label>

                {field.type === "text" && (
                  <Input id={field.name} name={field.name} placeholder={field.placeholder} className="mt-1" />
                )}

                {field.type === "textarea" && (
                  <Textarea id={field.name} name={field.name} placeholder={field.placeholder} className="mt-1" />
                )}

                {field.type === "number" && (
                  <Input
                    id={field.name}
                    name={field.name}
                    className="mt-1"
                    type="number"
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                  />
                )}

                {field.type === "date" && (
                  <DatePicker
                    id={field.name}
                    className="mt-1"
                    placeholder={field.placeholder}
                  />
                )}

                {field.type === "select" && (
                  <Select>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder={field.placeholder || "Select"} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((opt: string, i: number) => (
                        <SelectItem key={i} value={String(opt)}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {field.type === "checkbox" && (
                  <div className="space-y-1 mt-1">
                    {field.options?.map((opt: string, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <Checkbox id={`${field.name}-${i}`} />
                        <Label htmlFor={`${field.name}-${i}`} className="text-xs">
                          {opt}
                        </Label>
                      </div>
                    )) || (
                        <div className="flex items-center gap-2">
                          <Checkbox id={field.name} />
                          <Label htmlFor={field.name} className="text-xs">
                            {field.label}
                          </Label>
                        </div>
                      )}
                  </div>
                )}

                {field.type === "radio" && (
                  <div className="space-y-1 mt-1">
                    {field.options?.map((opt: string, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={`${field.name}-${i}`}
                          name={field.name}
                          className="text-blue-5"
                        />
                        <Label htmlFor={`${field.name}-${i}`} className="text-xs">
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : null}

      {data.id !== "1" && (
        <Handle type="target" position={Position.Left} className="!bg-blue-5" />
      )}
      <Handle type="source" position={Position.Right} className="!bg-green-5" isConnectable />
    </Card>
  )
}
