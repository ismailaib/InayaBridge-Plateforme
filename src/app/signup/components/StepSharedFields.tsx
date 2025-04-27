"use client"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import Link from "next/link"
// import { useRouter } from "next/navigation"
import React, { useState } from "react"
import confetti from "canvas-confetti"
import { Conditions } from "@/app/Conditions"
import { Politique } from "@/app/Politique"
import { useRouter } from "next/navigation";

const StepSharedFields = ({
  accountType,
  additionalFields,
  onSuccess,
}: {
  accountType: string
  additionalFields: any
  onSuccess?: () => void
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    router.push("/dashboard");
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#00b38f", "#38bdf8", "#facc15"],
    })

    setTimeout(() => {
      if (accountType === "doctor" && onSuccess) {
        onSuccess()
        setLoading(false)
      } else {
        setLoading(false)
      }
    }, 300)
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <form onSubmit={handleSubmit} className="space-y-5 text-start">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first-name" className="font-medium">
              Prénom
            </Label>
            <Input
              type="text"
              id="first-name"
              name="first-name"
              placeholder="Prénom"
              autoComplete="given-name"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="last-name" className="font-medium">
              Nom
            </Label>
            <Input
              type="text"
              id="last-name"
              name="last-name"
              placeholder="Nom de famille"
              autoComplete="family-name"
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="font-medium">
            Adresse e-mail
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="exemple@domaine.com"
            autoComplete="email"
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="password" className="font-medium">
              Mot de passe
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              autoComplete="new-password"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="confirm-password" className="font-medium">
              Confirmer le mot de passe
            </Label>
            <Input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="••••••••"
              autoComplete="new-password"
              className="mt-2"
            />
          </div>
        </div>
        {additionalFields && <div className="pt-4">{additionalFields}</div>}

        <p className="mt-4 flex justify-center gap-1 text-xs text-gray-500 dark:text-gray-500">
          En vous connectant, vous acceptez nos{" "}
          {typeof window !== "undefined" && <Conditions />} et notre{" "}
          {typeof window !== "undefined" && <Politique />}.
        </p>
      </form>

      {/* Bottom Section (Actions) */}
      <div className="mt-12 flex flex-row justify-between gap-4">
        <Link href="/signup">
          <Button variant="secondary" type="button">
            Retour
          </Button>
        </Link>
        <Link href="/dashboard" className="w-full">
          <Button
            variant="primary"
            className="w-full"
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Création en cours..."
          >
            Créer mon espace de travail
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default StepSharedFields
