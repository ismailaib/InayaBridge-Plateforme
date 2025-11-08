'use client'

import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { Button } from "@/components/Button"
import { Upload, X, Plus } from "lucide-react"
import { ChangeEvent } from "react"

interface FieldData {
    name: string;
    label: string;
    placeholder?: string;
    min?: number;
    max?: number;
    options?: string[];
}

interface FieldConfiguratorProps {
    fieldType: "text" | "textarea" | "number" | "select" | "checkbox" | "radio" | "date";
    fieldData: FieldData;
    onChange: (data: FieldData) => void;
    onSave: () => void;
    onCancel: () => void;
    isEdit?: boolean;
}

export default function FieldConfigurator({ fieldType, fieldData, onChange, onSave, onCancel, isEdit = false }: FieldConfiguratorProps) {
    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result;
                if (typeof text === 'string') {
                    const lines = text
                        .split('\n')
                        .filter(line => line.trim())
                        .map(line => line.trim());
                    onChange({ ...fieldData, options: lines });
                }
            };
            reader.readAsText(file);
        }
    };

    const addOption = () => onChange({ ...fieldData, options: [...(fieldData.options || []), ''] });

    const updateOption = (index: number, value: string) => {
        const options = [...(fieldData.options || [])];
        options[index] = value;
        onChange({ ...fieldData, options });
    };

    const removeOption = (index: number) => {
        const options = [...(fieldData.options || [])];
        options.splice(index, 1);
        onChange({ ...fieldData, options });
    };

    const needsOptions = ['select', 'checkbox', 'radio'].includes(fieldType);

    const isValid =
        fieldData.name &&
        fieldData.label &&
        (!needsOptions || (fieldData.options && fieldData.options.length > 0));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">
                    {isEdit ? 'Modification' : 'Configuration'} du champ ({fieldType})
                </h3>
            </div>

            <div>
                <Label htmlFor="name">Nom du champ *</Label>
                <Input
                    id="name"
                    name="name"
                    value={fieldData.name || ''}
                    onChange={(e) => onChange({ ...fieldData, name: e.target.value })}
                    placeholder="ex: chiefComplaint"
                />
            </div>

            <div>
                <Label htmlFor="label">Étiquette *</Label>
                <Input
                    id="label"
                    name="label"
                    value={fieldData.label || ''}
                    onChange={(e) => onChange({ ...fieldData, label: e.target.value })}
                    placeholder="ex: Chief Complaint"
                />
            </div>

            {(fieldType === 'text' || fieldType === 'textarea') && (
                <div>
                    <Label htmlFor="placeholder">Placeholder</Label>
                    <Input
                        id="placeholder"
                        name="placeholder"
                        value={fieldData.placeholder || ''}
                        onChange={(e) => onChange({ ...fieldData, placeholder: e.target.value })}
                        placeholder="ex: Describe the main issue..."
                    />
                </div>
            )}

            {fieldType === 'number' && (
                <>
                    <div>
                        <Label htmlFor="placeholder">Placeholder</Label>
                        <Input
                            id="placeholder"
                            name="placeholder"
                            value={fieldData.placeholder || ''}
                            onChange={(e) => onChange({ ...fieldData, placeholder: e.target.value })}
                            placeholder="ex: Enter a value..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label htmlFor="min">Minimum</Label>
                            <Input
                                id="min"
                                type="number"
                                value={fieldData.min || ''}
                                onChange={(e) =>
                                    onChange({ ...fieldData, min: e.target.value ? Number(e.target.value) : undefined })
                                }
                                placeholder="ex: 1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="max">Maximum</Label>
                            <Input
                                id="max"
                                type="number"
                                value={fieldData.max || ''}
                                onChange={(e) =>
                                    onChange({ ...fieldData, max: e.target.value ? Number(e.target.value) : undefined })
                                }
                                placeholder="ex: 10"
                            />
                        </div>
                    </div>
                </>
            )}

            {needsOptions && (
                <div className="space-y-3">
                    <Label>Options *</Label>

                    <div className="flex gap-2">
                        <Button
                            onClick={addOption}
                            variant="secondary"
                            className="flex-1 flex items-center justify-center gap-2"
                        >
                            <Plus width={16} /> Ajouter une option
                        </Button>

                        <label className="flex-1">
                            <Button
                                variant="secondary"
                                className="w-full flex items-center justify-center gap-2"
                                onClick={() => document.getElementById('file-upload')?.click()}
                                type="button"
                            >
                                <Upload width={16} /> Importer CSV/TXT
                            </Button>
                            <input
                                id="file-upload"
                                type="file"
                                accept=".csv,.txt"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {fieldData?.options && fieldData.options.length > 0 && (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {fieldData?.options.map((option, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={option}
                                        onChange={(e) => updateOption(index, e.target.value)}
                                        placeholder={`Option ${index + 1}`}
                                    />
                                    <Button
                                        variant="secondary"
                                        onClick={() => removeOption(index)}
                                        className="px-3"
                                    >
                                        <X width={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="flex gap-2">
                <Button onClick={onSave} variant="primary" className="flex-1" disabled={!isValid}>
                    {isEdit ? 'Modifier le champ' : 'Ajouter le champ'}
                </Button>
                <Button onClick={onCancel} variant="secondary" className="flex-1">
                    Annuler
                </Button>
            </div>
        </div>
    )
}