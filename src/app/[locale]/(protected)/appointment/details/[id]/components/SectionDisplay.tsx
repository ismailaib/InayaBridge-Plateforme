// src/app/appointments/[id]/components/SectionDisplay.tsx
import { motion } from 'framer-motion';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Section } from '../types';
import { useState, useEffect } from 'react';
import { Save, Edit2, X } from 'lucide-react';
import { updateFlowInstance } from '@/api/flow';
import FormField from './FormField';

interface SectionDisplayProps {
    section: Section;
    allData: Record<string, any>; // All data from the flow instance
    index?: number;
    flowInstanceId: string;
    onDataUpdate?: (updatedData: Record<string, any>) => void;
}

export const SectionDisplay = ({
    section,
    allData,
    index = 0,
    flowInstanceId,
    onDataUpdate
}: SectionDisplayProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<Record<string, any>>(allData);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isEditing) {
            setEditedData(allData);
        }
    }, [allData, isEditing]);

    const handleFieldChange = (fieldName: string, value: any) => {
        setEditedData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateFlowInstance(flowInstanceId, {
                data: JSON.stringify(editedData)
            });

            setIsEditing(false);

            if (onDataUpdate) {
                onDataUpdate(editedData);
            }
        } catch (error) {
            console.error('Error updating flow instance:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedData(allData);
        setIsEditing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            exit={{ opacity: 0 }}
        >
            <Card className='rounded-t-none border-t-0'>
                <div className="flex justify-end mb-4 gap-2">
                    {!isEditing ? (
                        <Button
                            variant="secondary"
                            onClick={() => setIsEditing(true)}
                        >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Modifier
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="light"
                                onClick={handleCancel}
                                disabled={isSaving}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Annuler
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                            </Button>
                        </>
                    )}
                </div>

                <div className="mt-4 space-y-4">
                    {section.fields.map((field) => {
                        const currentValue = isEditing
                            ? editedData[field.name]
                            : allData[field.name];

                        return (
                            <FormField
                                key={field.name}
                                field={field}
                                value={currentValue ?? ""}
                                onChange={(value) => handleFieldChange(field.name, value)}
                                isCompleted={!isEditing}
                            />
                        );
                    })}
                </div>

            </Card>
        </motion.div>
    );
};