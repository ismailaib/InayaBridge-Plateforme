"use client"

import React, { useEffect, useState } from "react"
import { RiCloseLine } from "@remixicon/react"
import { UserRoundMinus } from "lucide-react"

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

import { deletePatient } from "../../api/patients"

interface DeletePatientModalProps {
  patientId: number
  onSuccess?: () => void
}

export default function DeletePatientModal({
  patientId,
  onSuccess,
}: DeletePatientModalProps) {
  /* ─────────── state ─────────── */
  const [code, setCode] = useState("")           // code affiché
  const [userInput, setUserInput] = useState("") // saisi par user
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  /* ─────────── génère un nouveau code à chaque ouverture ─────────── */
  useEffect(() => {
    if (open) {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString()
      setCode(newCode)
      setUserInput("")
    }
  }, [open])

  /* ─────────── submit ─────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (userInput !== code) return // code incorrect → on ne fait rien

    setSubmitting(true)
    try {
      await deletePatient(patientId)
      onSuccess?.()
      setOpen(false)
    } catch (err) {
      console.error("Erreur de suppression", err)
    } finally {
      setSubmitting(false)
    }
  }

  /* ─────────── UI ─────────── */
  return (
    <div className="flex items-center justify-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="text-red-600 hover:underline dark:text-red-400 text-sm"
          >
            <UserRoundMinus width={18} />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
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
              <DialogTitle className="text-base">
                Supprimer le patient
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm/6">
                Cette action supprimera définitivement les données du patient.
                Pour confirmer, saisissez le code&nbsp;:&nbsp;
                <span className="font-semibold text-red-600">{code}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6">
              <Label htmlFor="confirm-code" className="font-medium">
                Code de confirmation
              </Label>
              <Input
                id="confirm-code"
                name="confirm-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                className="mt-2"
                placeholder="Entrez le code"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={submitting}>
                  Annuler
                </Button>
              </DialogClose>

              <Button
                type="submit"
                variant="destructive"
                className="w-full"
                disabled={submitting || userInput !== code}
              >
                {submitting ? "Suppression…" : "Supprimer définitivement"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
