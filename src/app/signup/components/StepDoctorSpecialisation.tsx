"use client"

import React, { useState } from "react"
import {
  RadioCardGroup,
  RadioCardIndicator,
  RadioCardItem,
} from "@/components/RadioCard"
import { Input } from "@/components/Input"
import Link from "next/link"
import { Button } from "@/components/Button"

const ALL_SPECIALISATIONS = [
  "Médecin généraliste",
  "Cardiologue",
  "Dermatologue",
  "Pédiatre",
  "Radiologue",
  "Neurologue",
  "Gynécologue",
  "Dentiste",
  "Oncologue",
  "Autre spécialité",
]


const StepDoctorSpecialisation = ({
  accountType,
  onSuccess,
}: {
  accountType: string
  onSuccess?: () => void
}) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (accountType === "doctor" && onSuccess) {
      onSuccess()
    } else {
      alert("test")
    }
  }

  const [selectedSpeciality, setSelectedSpeciality] = useState("")

  const isOtherSelected = selectedSpeciality === "Autre spécialité"

  return (
    <div className="flex h-full flex-col justify-between">
      {/* Form Section */}
      <form className="">
        <fieldset className="space-y-4 text-start">
          <RadioCardGroup className="mt-4 grid-cols-2 text-sm">
            {ALL_SPECIALISATIONS.map((label) => (
              <RadioCardItem
                key={label}
                value={label}
                checked={selectedSpeciality === label}
                onClick={() => setSelectedSpeciality(label)}
              >
                <div className="flex items-center gap-3">
                  <RadioCardIndicator />
                  <span>{label}</span>
                </div>
              </RadioCardItem>
            ))}
          </RadioCardGroup>

          {isOtherSelected && (
            <div className="mt-6">
              <label
                htmlFor="other-speciality"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Veuillez spécifier votre spécialité
              </label>
              <Input
                type="text"
                id="other-speciality"
                name="other-speciality"
                placeholder="Ex: Médecin du ..."
              />
            </div>
          )}
        </fieldset>
      </form>

      {/* Action Buttons */}
      <div className="mt-12 flex flex-row justify-between gap-4">
        <Link href="/signup">
          <Button variant="secondary">Retour</Button>
        </Link>

        <Button variant="primary" className="w-full" onClick={handleSubmit}>
          Continuer
        </Button>
      </div>
    </div>
  )
}

export default StepDoctorSpecialisation
