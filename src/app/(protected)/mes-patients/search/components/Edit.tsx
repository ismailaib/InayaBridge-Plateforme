"use client"

import React, { useState } from "react"
import { RiCloseLine } from "@remixicon/react"
import { UserRoundPen } from "lucide-react"

import { Button } from "@/components/Button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/Dialog"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/Select"
import { DatePicker } from "@/components/DatePicker"
import { updatePatient } from "../../api/patients"

/* ------------------------------------------------------------------ */
/* API wrapper                                                        */
/* ------------------------------------------------------------------ */
export interface Patient {
    id: number | undefined
    first_name: string
    last_name: string
    gender: "male" | "female"
    date_of_birth: string
    cin: string
    phone_number: string
    address: string
    email: string
}

export const update = (id: number | string, payload: Patient) => updatePatient(id, payload)

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
interface EditPatientModalProps {
    patient: Patient
    onSuccess: () => void          // ⇦ rafraîchir la liste, fermer le toast, etc.
}

export default function EditPatientModal({
    patient,
    onSuccess,
}: EditPatientModalProps) {
    /* -----  local form state  -------------------------------------- */
    const [form, setForm] = useState<Patient>({
        ...patient,
        // s’il arrive que date_of_birth vaille null, assure une chaîne vide :
        date_of_birth: patient.date_of_birth ?? "",
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target
        setForm((f) => ({ ...f, [name]: value }))
    }

    const handleDateChange = (d: Date | undefined) => {
        setForm((f) => ({
            ...f,
            date_of_birth: d ? d.toISOString().slice(0, 10) : "",
        }))
    }

    /* -----  submit  ------------------------------------------------- */
    const [isloading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await update(Number(patient.id), form)
            onSuccess()              // informe le parent → refresh list
        } catch (err) {
            // ici on pourrait afficher un toast d’erreur
            console.error("Échec de la mise à jour", err)
            setIsLoading(false)
            return                   // ne pas fermer le modal
        }
        setIsLoading(false)
    }

    /* -----  render  ------------------------------------------------- */
    return (
        <div className="flex items-center justify-center">
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="secondary"
                        className="text-gray-600 hover:underline dark:text-gray-400 text-sm"
                    >
                        <UserRoundPen width={18} />
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-4xl">
                    <DialogClose asChild>
                        <Button
                            className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
                            variant="ghost"
                        >
                            <RiCloseLine className="size-5 shrink-0" />
                        </Button>
                    </DialogClose>

                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle className="text-base font-semibold">
                                Modifier{" "}
                                <span className="font-bold">
                                    {patient.first_name} {patient.last_name}
                                </span>
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-sm">
                                Veuillez mettre à jour les informations du patient.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                            {/* Nom */}
                            <div>
                                <Label htmlFor="first_name" className="font-medium">
                                    Nom
                                </Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    className="mt-2"
                                    value={form.first_name}
                                    onChange={handleChange}
                                />
                            </div>

                            
                            {/* Prénom */}
                            <div>
                                <Label htmlFor="last_name" className="font-medium">
                                    Prénom
                                </Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    className="mt-2"
                                    value={form.last_name}
                                    onChange={handleChange}
                                />
                            </div>



                            {/* Genre */}
                            <div>
                                <Label htmlFor="gender" className="font-medium">
                                    Genre
                                </Label>
                                <Select
                                    value={form.gender}
                                    onValueChange={(v) =>
                                        setForm((f) => ({ ...f, gender: v as Patient["gender"] }))
                                    }
                                >
                                    <SelectTrigger id="gender" name="gender" className="mt-2">
                                        <SelectValue placeholder="Sélectionnez" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Homme</SelectItem>
                                        <SelectItem value="female">Femme</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date de naissance */}
                            <div>
                                <Label htmlFor="dob" className="font-medium">
                                    Date de naissance
                                </Label>
                                <DatePicker
                                    id="dob"
                                    value={
                                        form.date_of_birth ? new Date(form.date_of_birth) : undefined
                                    }
                                    onChange={handleDateChange}
                                    className="mt-2"
                                    required
                                />
                            </div>

                            {/* CIN */}
                            <div>
                                <Label htmlFor="cin" className="font-medium">
                                    CIN
                                </Label>
                                <Input
                                    id="cin"
                                    name="cin"
                                    type="text"
                                    className="mt-2"
                                    value={form.cin}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Téléphone */}
                            <div>
                                <Label htmlFor="phone_number" className="font-medium">
                                    Téléphone
                                </Label>
                                <Input
                                    id="phone_number"
                                    name="phone_number"
                                    type="tel"
                                    className="mt-2"
                                    value={form.phone_number}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Adresse */}
                            <div>
                                <Label htmlFor="address" className="font-medium">
                                    Adresse complète
                                </Label>
                                <Input
                                    id="address"
                                    name="address"
                                    type="text"
                                    className="mt-2"
                                    value={form.address}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <Label htmlFor="email" className="font-medium">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="mt-2"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <DialogClose asChild>
                                <Button type="button" variant="ghost">
                                    Annuler
                                </Button>
                            </DialogClose>

                            {/* le bouton reste dans le formulaire → submit */}
                            <Button type="submit" isLoading={isloading}>Confirmer</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
