"use client";

import React from "react";
import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import { DatePicker } from "@/components/DatePicker";
import { Divider } from "@/components/Divider";
import { Button } from "@/components/Button";
import { Switch } from "@/components/Switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/Select";
import {
    RadioCardGroup,
    RadioCardItem,
} from "@/components/RadioCardGroup";
import FileUpload from "@/components/FileUpload";
import { Textarea } from "@/components/Textarea ";
import { Home, Video, Search, Hospital } from "lucide-react";
import { TenantPatient } from "@/api/patients";
import { Service } from "@/api/services";

interface FormState {
    selectedPatientId: string | null;
    date: Date | undefined;
    cost: number | undefined;
    motif: string;
    note: string;
    locationType: string | null;
    serviceId: string | null;
    inWaitingRoom: boolean;
    isUrgent: boolean;
    placelocation: string | null;
}

interface AppointmentFormProps {
    formState: FormState;
    updateFormState: (updates: Partial<FormState>) => void;
    services: Service[];
    loading: boolean;
    submitting: boolean;
    t: any;
    isToday: boolean;
    handleSubmit: (e: React.FormEvent) => void;
    resetForm: () => void;
    filteredPatients: TenantPatient[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectOpen: boolean;
    setSelectOpen: (open: boolean) => void;
    searchInputRef: React.RefObject<HTMLInputElement | null>;
    handlePatientSelect: (id: string) => void;
}

export default function AppointmentForm({
    formState,
    updateFormState,
    services,
    loading,
    submitting,
    t,
    isToday,
    handleSubmit,
    resetForm,
    filteredPatients,
    searchQuery,
    setSearchQuery,
    selectOpen,
    setSelectOpen,
    searchInputRef,
    handlePatientSelect,
}: AppointmentFormProps) {
    const handleServiceSelect = (val: string) => {
        const selected = services.find((s) => s.id === val);
        updateFormState({
            serviceId: val,
            cost: selected?.price ?? formState.cost ?? 0,
            motif: selected?.name ?? "",  
            note: `Rendez-vous pour le service ${selected?.name ?? "non spécifié"}.`,
        });
    };


    return (
        <form className="flex-1 space-y-6 transition-all duration-300" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <div className="col-span-3">
                    <Label htmlFor="patient">{t("patient.label")} *</Label>
                    <div className="relative mt-2">
                        <Select
                            value={formState.selectedPatientId ?? undefined}
                            onValueChange={handlePatientSelect}
                            open={selectOpen}
                            onOpenChange={setSelectOpen}
                            disabled={loading}
                        >
                            <SelectTrigger id="patient">
                                <SelectValue placeholder={t("patient.placeholder")} />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-auto">
                                <div className="sticky top-0 z-10 bg-white p-2 dark:bg-gray-800">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input
                                            ref={searchInputRef}
                                            placeholder={t("patient.searchPlaceholder")}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-8 text-sm"
                                            autoComplete="off"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                </div>
                                {filteredPatients.length ? (
                                    filteredPatients.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                            {p.firstName} {p.lastName} - <span className="font-light italic">{p.cin}</span>
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="px-2 py-2 text-sm text-gray-500">
                                        {loading ? t("patient.loading") : t("patient.noResults")}
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="col-span-3">
                    <Label htmlFor="date">{t("date")} *</Label>
                    <DatePicker
                        className="mt-2"
                        showTimePicker
                        value={formState.date}
                        onChange={(v) => updateFormState({ date: v })}
                    />
                </div>

                <div className="col-span-3">
                    <Label htmlFor="service">{t("service.label")} *</Label>
                    <Select
                        value={formState.serviceId ?? undefined}
                        onValueChange={handleServiceSelect}
                        disabled={loading || services.length === 0}
                    >
                        <SelectTrigger id="service" className="mt-1">
                            <SelectValue placeholder={t("service.placeholder")} />
                        </SelectTrigger>
                        <SelectContent>
                            {services.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                    {s.name} {s.price ? `- ${s.price} MAD` : ""}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="col-span-3">
                    <Label htmlFor="cost">{t("cost")} *</Label>
                    <Input
                        type="number"
                        id="cost"
                        min={0}
                        className="mt-1"
                        placeholder={t("placeholders.cost")}
                        value={formState.cost ?? ""}
                        onChange={(e) => updateFormState({ cost: Number(e.target.value) })}
                    />
                </div>

                <div className="col-span-6">
                    <Label htmlFor="motif">{t("motif")} *</Label>
                    <Input
                        id="motif"
                        placeholder={t("placeholders.motif")}
                        className="mt-2"
                        value={formState.motif}
                        onChange={(e) => updateFormState({ motif: e.target.value })}
                    />
                </div>

                <div className="col-span-6">
                    <Label htmlFor="note">{t("note")}</Label>
                    <Textarea
                        id="note"
                        className="mt-2"
                        placeholder={t("placeholders.note")}
                        value={formState.note}
                        onChange={(e) => updateFormState({ note: e.target.value })}
                    />
                </div>

                <div className="col-span-6">
                    <Label>{t("location.label")} *</Label>
                    <RadioCardGroup
                        className="mt-2 flex flex-row items-center gap-4"
                        defaultValue="1"
                        value={formState.locationType ?? undefined}
                        onValueChange={(v) => {
                            if (v === "2") {
                                const selectedPatient = filteredPatients.find(
                                    (p) => p.id === formState.selectedPatientId
                                );
                                updateFormState({
                                    locationType: v,
                                    placelocation: selectedPatient?.address ?? "",
                                });
                            } else {
                                updateFormState({ locationType: v, placelocation: "" });
                            }
                        }}
                    >
                        <RadioCardItem value="1" className="flex flex-row items-center gap-4">
                            <span className="sm:text-sm flex items-center gap-2">
                                <Hospital className="h-4 w-4" />
                                {t("location.office.title")}
                            </span>
                        </RadioCardItem>

                        <RadioCardItem value="2" className="flex flex-row items-center gap-4">
                            <span className="sm:text-sm flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                {t("location.home.title")}
                            </span>
                        </RadioCardItem>

                        <RadioCardItem value="3" className="flex flex-row items-center gap-4">
                            <span className="sm:text-sm flex flex-row items-center gap-2">
                                <Video className="h-4 w-4" />
                                {t("location.video.title")}
                            </span>
                        </RadioCardItem>
                    </RadioCardGroup>
                </div>

                {formState.locationType === "2" && (
                    <div className="col-span-6">
                        <Label htmlFor="placelocation">{t("location.home.addressLabel")}</Label>
                        <Input
                            id="placelocation"
                            placeholder={t("location.home.placeholder")}
                            className="mt-2"
                            value={formState.placelocation ?? ""}
                            onChange={(e) => updateFormState({ placelocation: e.target.value })}
                        />
                    </div>
                )}
            </div>

            <Divider />
            <FileUpload />
            <Divider />

            {isToday && (
                <>
                    <div className="flex items-center gap-3">
                        <Switch
                            id="waitingRoom"
                            checked={formState.inWaitingRoom}
                            onCheckedChange={(c) => updateFormState({ inWaitingRoom: c })}
                        />
                        <Label htmlFor="waitingRoom">{t("waitingRoom")}</Label>
                    </div>
                    <Divider />
                </>
            )}

            <div className="flex items-center gap-3">
                <Switch
                    id="urgent"
                    checked={formState.isUrgent}
                    onCheckedChange={(c) => updateFormState({ isUrgent: c })}
                />
                <Label htmlFor="urgent">{t("urgent")}</Label>
            </div>

            <div className="flex justify-end gap-3">
                <Button variant="secondary" type="button" onClick={resetForm}>
                    {t("cancel")}
                </Button>
                <Button type="submit" disabled={loading || submitting}>
                    {submitting ? t("submitting") : t("submit")}
                </Button>
            </div>
        </form>
    );
}