'use client'

import { useState } from "react"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { Button } from "@/components/Button"
import { Upload, X, Plus, FileSliders, Check } from "lucide-react"
import { ChangeEvent } from "react"
import CSVColumnSelector from "./CsvColumnSelectorModal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"
import { showToast } from "@/app/[locale]/(protected)/dashboard/hooks/utils"

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
    const [showCSVModal, setShowCSVModal] = useState(false);
    const [csvData, setCSVData] = useState<string[][]>([]);
    const [showAddInput, setShowAddInput] = useState(false);
    const [newOptionValue, setNewOptionValue] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    const parseCSV = (text: string): string[][] => {
        const lines = text.split('\n').filter(line => line.trim());
        return lines.map(line => {
            // Handle both comma and semicolon separators
            const separator = line.includes(';') ? ';' : ',';
            return line.split(separator).map(cell => cell.trim());
        });
    };

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result;
                if (typeof text === 'string') {
                    const parsed = parseCSV(text);

                    // If only one column or simple list, use directly
                    if (parsed.length > 0 && parsed[0].length === 1) {
                        const options = parsed
                            .map(row => row[0])
                            .filter(item => item.trim());
                        onChange({ ...fieldData, options });
                    } else {
                        // Show modal for column selection
                        setCSVData(parsed);
                        setShowCSVModal(true);
                    }
                    showToast('success', 'Succès', "Fichier CSV importé avec succès.");
                }
            };
            reader.readAsText(file);
        }
        // Reset file input
        e.target.value = '';
    };

    const handleColumnSelect = (columnIndices: number[], editedValues: string[]) => {
        // If in edit mode, replace all options
        if (isEditMode) {
            onChange({ ...fieldData, options: editedValues });
            setIsEditMode(false);
        } else {
            // If importing, merge new options with existing ones, avoiding duplicates
            const existingOptions = fieldData.options || [];
            const existingSet = new Set(existingOptions.map(opt => opt.toLowerCase().trim()));
            
            // Filter out duplicates from new values (case-insensitive)
            const uniqueNewOptions = editedValues.filter(
                newOpt => !existingSet.has(newOpt.toLowerCase().trim())
            );
            
            // Add new unique options on top of existing ones
            const mergedOptions = [...uniqueNewOptions, ...existingOptions];
            
            onChange({ ...fieldData, options: mergedOptions });
        }
        
        setShowCSVModal(false);
        setCSVData([]);
    };

    const handleAddOption = () => {
        if (newOptionValue.trim()) {
            const existingOptions = fieldData.options || [];
            const existingSet = new Set(existingOptions.map(opt => opt.toLowerCase().trim()));
            
            // Check if option already exists (case-insensitive)
            if (!existingSet.has(newOptionValue.toLowerCase().trim())) {
                onChange({ ...fieldData, options: [...existingOptions, newOptionValue.trim()] });
            }
            
            setNewOptionValue('');
            setShowAddInput(false);
            showToast('success', 'Succès', "Option ajoutée avec succès.");
        }
    };

    const handleOpenEditModal = () => {
        // Convert current options to CSV format for editing
        const csvFormatted = [
            ['Option'], // Header
            ...(fieldData.options || []).map(opt => [opt])
        ];
        setCSVData(csvFormatted);
        setShowCSVModal(true);
        // Mark that this is an edit mode (not an import)
        setIsEditMode(true);
    };

    const needsOptions = ['select'].includes(fieldType);

    const isValid =
        fieldData.name &&
        fieldData.label &&
        (!needsOptions || (fieldData.options && fieldData.options.length > 0));

    return (
        <>
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

                        <div className="flex flex-col gap-2">
                            {!showAddInput ? (
                                <Button
                                    onClick={() => setShowAddInput(true)}
                                    variant="secondary"
                                    className="flex-1 flex items-center justify-center gap-2"
                                >
                                    <Plus width={16} /> Ajouter une option
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Input
                                        value={newOptionValue}
                                        onChange={(e) => setNewOptionValue(e.target.value)}
                                        placeholder="Nouvelle option..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleAddOption();
                                            if (e.key === 'Escape') {
                                                setShowAddInput(false);
                                                setNewOptionValue('');
                                            }
                                        }}
                                        autoFocus
                                    />
                                    <Button
                                        onClick={handleAddOption}
                                        variant="primary"
                                        className="px-3"
                                        disabled={!newOptionValue.trim()}
                                    >
                                        <Check width={16} />
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setShowAddInput(false);
                                            setNewOptionValue('');
                                        }}
                                        variant="secondary"
                                        className="px-3"
                                    >
                                        <X width={16} />
                                    </Button>
                                </div>
                            )}

                            <Button
                                variant="secondary"
                                className="w-full flex items-center justify-center gap-2"
                                onClick={() => document.getElementById('file-upload')?.click()}
                                type="button"
                            >
                                <Upload width={16} /> Importer CSV
                            </Button>
                            <input
                                id="file-upload"
                                type="file"
                                accept=".csv,.txt"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>

                        {fieldData?.options && fieldData.options.length > 0 && (
                            <div className="flex flex-row gap-2">
                                <Select>
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Aperçu des options" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fieldData?.options.map((option, index) => (
                                            <SelectItem key={index} value={String(index)}>
                                                {option || '(vide)'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button 
                                    variant="light" 
                                    onClick={handleOpenEditModal}
                                    title="Modifier les options"
                                >
                                    <FileSliders width={18} />
                                </Button>
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

            <CSVColumnSelector
                isOpen={showCSVModal}
                onClose={() => {
                    setShowCSVModal(false);
                    setCSVData([]);
                    setIsEditMode(false);
                }}
                csvData={csvData}
                onSelectColumn={handleColumnSelect}
                isEditMode={isEditMode}
            />
        </>
    )
}