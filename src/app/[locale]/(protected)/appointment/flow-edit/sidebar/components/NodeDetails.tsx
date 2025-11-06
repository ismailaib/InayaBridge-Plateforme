'use client'

import { Card } from "@/components/Card"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { useState } from "react";
import { Node } from "reactflow";
import FieldTypeSelector from "./FieldTypeSelector";
import FieldConfigurator from "./FieldConfigurator";
import FieldCard from "./FieldCard";
import { Divider } from "@/components/Divider"
import { Field } from "./types";

interface FieldData {
    name: string;
    label: string;
    placeholder?: string;
    min?: number;
    max?: number;
    options?: string[] | { label: string; value: string }[];
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
    const [newField, setNewField] = useState({
        name: "",
        label: "",
        type: "text" as "text" | "textarea" | "number" | "select" | "checkbox" | "radio" | "date",
        placeholder: "",
        min: undefined,
        max: undefined,
        options: [] as string[],
    })

    const handleSelectFieldType = (type: any) => {
        setNewField({ ...newField, type })
        setStep('config')
    }

    const handleAddField = () => {
        if (newField.name && newField.label) {
            const fieldToAdd: any = {
                name: newField.name,
                label: newField.label,
                type: newField.type,
            }

            if (newField.placeholder) fieldToAdd.placeholder = newField.placeholder
            if (newField.type === 'number') {
                if (newField.min !== undefined) fieldToAdd.min = newField.min
                if (newField.max !== undefined) fieldToAdd.max = newField.max
            }
            if (newField.type === 'select' && newField.options.length > 0) {
                fieldToAdd.options = newField.options
            }

            const newFields = [...(node.data.fields || []), fieldToAdd]
            onNodeDataChange(node.id, { ...node.data, fields: newFields })
            handleCancel()
        }
    }

    const handleDeleteField = (index: number) => {
        const newFields = [...(node.data.fields || [])]
        newFields.splice(index, 1)
        onNodeDataChange(node.id, { ...node.data, fields: newFields })
    }

    const handleCancel = () => {
        setShowAddFieldForm(false)
        setStep('type')
        setNewField({
            name: "",
            label: "",
            type: "text",
            placeholder: "",
            min: undefined,
            max: undefined,
            options: [],
        })
    }

    const handleInputChange = (e: { target: { name: any; value: any } }) => {
        onNodeDataChange(node.id, {
            ...node.data,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <Card className="p-4 space-y-4">
            <div>
                <h2 className="font-semibold text-sm">Nœud sélectionné</h2>
                <div className="text-xs text-gray-500">ID : {node.id}</div>
            </div>

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
                    Champs ({node.data.fields?.length || 0})
                </h3>
                {node.data.fields && node.data.fields.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {node.data.fields.map((field: Field, index: number) => (
                            <FieldCard
                                key={index}
                                field={field}
                                onDelete={() => handleDeleteField(index)}
                            />
                        ))}
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
                                //@ts-ignore
                                fieldType={newField.type}
                                fieldData={newField}
                                onChange={(data: FieldData) => setNewField(data as typeof newField)}
                                onSave={handleAddField}
                                onCancel={handleCancel}
                            />
                        )}
                    </div>
                </div>
            )}
        </Card>
    )
}
