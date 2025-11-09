import { useState, useEffect } from "react";
import { FlowTemplateDto } from "@/api/flow";
import { updateFlowName } from "@/api/flow";
import { Loader2, Check, Save } from "lucide-react";
import { Button } from "@/components/Button";
import { showToast } from "@/app/[locale]/(protected)/dashboard/hooks/utils";

interface FlowNameFieldProps {
    selectedFlow: FlowTemplateDto | null;
    onUpdateFlow?: (updatedFlow: FlowTemplateDto) => void;
}

export function FlowNameField({ selectedFlow, onUpdateFlow }: FlowNameFieldProps) {
    const [name, setName] = useState(selectedFlow?.name || "");
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        setName(selectedFlow?.name || "");
    }, [selectedFlow]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleSave = async () => {
        if (!selectedFlow || name === selectedFlow.name) return;

        const startTime = Date.now();
        setSaving(true);
        setDone(false);

        try {
            const updated = await updateFlowName(selectedFlow.groupId, name);
            onUpdateFlow?.(updated.data);
            setDone(true);
            setTimeout(() => setDone(false), 2000);
            showToast('success', 'Succès', "Nom du schéma mis à jour avec succès.");
        } catch (err) {
            console.error("Failed to update flow name", err);
            showToast('error', 'Erreur', "Erreur lors de la mise à jour du nom du schéma.");
        } finally {
            const elapsed = Date.now() - startTime;
            const remaining = 2000 - elapsed;
            if (remaining > 0) {
                setTimeout(() => setSaving(false), remaining);
            } else {
                setSaving(false);
            }
        }
    };

    const handleBlur = () => {
        setTimeout(() => setIsEditing(false), 150);
    };

    return (
        <div className="inline-grid items-center grid-cols-[auto_auto] gap-2">
            <span className="text-lg font-semibold invisible whitespace-pre col-start-1 row-start-1 p-1">
                {name || "Schéma de flux"}
            </span>
            <input
                type="text"
                value={name}
                onChange={handleChange}
                onFocus={() => !saving && setIsEditing(true)}
                onBlur={handleBlur}
                maxLength={25}
                className={`
          bg-transparent border-none 
          outline-none hover:outline-none focus:outline-none focus:ring-0
          w-full col-start-1 row-start-1 p-1
          text-lg font-semibold 
          ${saving ? "opacity-50" : "opacity-100"}
        `}
                disabled={saving}
                placeholder="Schéma de flux"
            />

            {(isEditing || saving || done) && (
                <Button
                    onClick={handleSave}
                    disabled={saving || !selectedFlow || name === selectedFlow?.name}
                    className="flex items-center gap-1 col-start-2 row-start-1"
                    variant="ghost"
                >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {!saving && done && <Check className="w-4 h-4 text-green-500" />}
                    {!saving && !done && <Save className="w-4 h-4" />}
                </Button>
            )}
        </div>
    );
}