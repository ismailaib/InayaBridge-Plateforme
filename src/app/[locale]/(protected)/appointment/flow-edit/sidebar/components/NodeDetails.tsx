'use client'

import { Card } from "@/components/Card"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { useState, useMemo } from "react";
import { Node } from "reactflow";
import FieldTypeSelector from "./FieldTypeSelector";
import FieldConfigurator from "./FieldConfigurator";
import FieldCard from "./FieldCard";
import { Divider } from "@/components/Divider"
import { Field } from "./types";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

interface FieldData {
    name: string;
    label: string;
    placeholder?: string;
    min?: number;
    max?: number;
    options?: string[] | { label: string; value: string }[];
}

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: 'none',
  } as React.CSSProperties; 
  return (
    <div ref={setNodeRef} style={style}>
      {/* @ts-ignore */}
      {React.cloneElement(children as React.ReactElement, { dragHandleProps: { ...attributes, ...listeners } })}
    </div>
  );
}

export default function NodeDetails({
    node,
    showAddFieldForm,
    setShowAddFieldForm,
    onNodeDataChange,
}: {
    node: Node;
    showAddFieldForm: boolean;
    setShowAddFieldForm: (show: boolean) => void;
    onNodeDataChange: (nodeId: string, data: any) => void;
}) {
    const [step, setStep] = useState('type')
    const [fieldData, setFieldData] = useState({
        name: "",
        label: "",
        type: "text" as "text" | "textarea" | "number" | "select" | "checkbox" | "radio" | "date",
        placeholder: "",
        min: undefined,
        max: undefined,
        options: [] as string[],
    })
    const [isEditing, setIsEditing] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)

    const fields = useMemo(() => node.data.fields || [], [node.data.fields])
    const fieldIds = useMemo(() => fields.map((_: any, index: number) => `field-${index}`), [fields])

    const isStartNode = node.id === '1'

    const handleSelectFieldType = (type: any) => {
        setFieldData({ ...fieldData, type })
        setStep('config')
    }

    const handleSave = () => {
        if (fieldData.name && fieldData.label) {
            const fieldToAdd: any = {
                name: fieldData.name,
                label: fieldData.label,
                type: fieldData.type,
            }

            if (fieldData.placeholder) fieldToAdd.placeholder = fieldData.placeholder
            if (fieldData.type === 'number') {
                if (fieldData.min !== undefined) fieldToAdd.min = fieldData.min
                if (fieldData.max !== undefined) fieldToAdd.max = fieldData.max
            }
            if (fieldData.type === 'select' && fieldData.options.length > 0) {
                fieldToAdd.options = fieldData.options
            }

            let newFields
            if (isEditing && editIndex !== null) {
                newFields = [...fields]
                newFields[editIndex] = fieldToAdd
            } else {
                newFields = [...fields, fieldToAdd]
            }
            onNodeDataChange(node.id, { ...node.data, fields: newFields })
            handleCancel()
        }
    }

    const handleEditField = (index: number) => {
        setFieldData(fields[index])
        setStep('config')
        setShowAddFieldForm(true)
        setIsEditing(true)
        setEditIndex(index)
    }

    const handleDeleteField = (index: number) => {
        const newFields = [...fields]
        newFields.splice(index, 1)
        onNodeDataChange(node.id, { ...node.data, fields: newFields })
    }

    const handleCancel = () => {
        setShowAddFieldForm(false)
        setStep('type')
        setFieldData({
            name: "",
            label: "",
            type: "text",
            placeholder: "",
            min: undefined,
            max: undefined,
            options: [],
        })
        setIsEditing(false)
        setEditIndex(null)
    }

    const handleInputChange = (e: { target: { name: any; value: any } }) => {
        onNodeDataChange(node.id, {
            ...node.data,
            [e.target.name]: e.target.value,
        })
    }

    const handleDragEnd = (event: any) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        const oldIndex = fieldIds.indexOf(active.id)
        const newIndex = fieldIds.indexOf(over.id)
        const newFields = arrayMove(fields, oldIndex, newIndex)
        onNodeDataChange(node.id, { ...node.data, fields: newFields })
    }

    if (isStartNode) {
        return (
            <Card className="p-4 space-y-4">
                <p className="text-sm text-gray-500">This is the start node</p>
            </Card>
        )
    }

    return (
        <Card className="p-4 space-y-4">
            <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                    id="title"
                    name="title"
                    value={node.data?.title || ""}
                    onChange={handleInputChange}
                    placeholder="ex: Complaints"
                />
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    name="description"
                    value={node.data?.description || ""}
                    onChange={handleInputChange}
                    placeholder="ex: Details about the patient's current complaints"
                />
            </div>

            <div className="space-y-2">
                <h3 className="font-semibold text-sm">
                    Champs ({fields?.length || 0})
                </h3>
                {fields.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto overflow-x-hidden">
                        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                            <SortableContext items={fieldIds} strategy={verticalListSortingStrategy}>
                                {fields.map((field: Field, index: number) => (
                                    <SortableItem key={fieldIds[index]} id={fieldIds[index]}>
                                        <FieldCard
                                            field={field}
                                            onDelete={() => handleDeleteField(index)}
                                            onEdit={() => handleEditField(index)}
                                        />
                                    </SortableItem>
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 text-center py-4">
                        Aucun champ ajouté
                    </p>
                )}
            </div>

            {showAddFieldForm && (
                <div className="flex flex-col mt-0">
                    <Divider className="mt-0"/>
                    <div>
                        {step === 'type' ? (
                            <FieldTypeSelector
                                onSelect={handleSelectFieldType}
                                onCancel={handleCancel}
                            />
                        ) : (
                            <FieldConfigurator
                                fieldType={fieldData.type}
                                fieldData={fieldData}
                                onChange={(data: FieldData) => setFieldData(data as typeof fieldData)}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                isEdit={isEditing}
                            />
                        )}
                    </div>
                </div>
            )}
        </Card>
    )
}