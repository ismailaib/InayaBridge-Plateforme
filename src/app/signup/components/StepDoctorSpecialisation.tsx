"use client"

import { useState } from "react"
import {
  RadioCardGroup,
  RadioCardIndicator,
  RadioCardItem,
} from "@/components/RadioCard"
import { Input } from "@/components/Input"
import { Button } from "@/components/Button"
import Link from "next/link"

const SPECIALITIES = [
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

export default function StepDoctorSpecialisation({
  selected,
  onContinue,
  onSuccess,
}: {
  selected?: string
  onContinue: (spec: string) => void
  onSuccess?: () => void
}) {
  const [choice, setChoice] = useState(selected ?? "Médecin généraliste")
  const [other, setOther] = useState("")

  const current = choice === "Autre spécialité" ? other : choice
  const valid = current.trim().length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    onContinue(current.trim())
    onSuccess?.()        // ← déclenché juste après si présent
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset>
          <RadioCardGroup className="mt-4 grid-cols-2">
            {SPECIALITIES.map((label) => (
              <RadioCardItem
                key={label}
                value={label}
                checked={choice === label}
                onClick={() => setChoice(label)}
              >
                <div className="flex items-center gap-3">
                  <RadioCardIndicator />
                  <span>{label}</span>
                </div>
              </RadioCardItem>
            ))}
          </RadioCardGroup>

          {choice === "Autre spécialité" && (
            <div className="mt-6">
              <label
                htmlFor="other"
                className="mb-1 block text-sm font-medium"
              >
                Spécialité
              </label>
              <Input
                id="other"
                placeholder="Ex : Médecin du sport"
                value={other}
                onChange={(e) => setOther(e.target.value)}
              />
            </div>
          )}
        </fieldset>

        <div className="mt-12 flex justify-between gap-4">
          <Link href="/signup">
            <Button variant="secondary" type="button">
              Retour
            </Button>
          </Link>

          <Button
            variant="primary"
            type="submit"
            className="w-full"
            disabled={!valid}
          >
            Continuer
          </Button>
        </div>
      </form>
    </div>
  )
}
