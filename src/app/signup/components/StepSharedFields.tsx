"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import confetti from "canvas-confetti"
import Link from "next/link"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { Conditions } from "@/app/Conditions"
import { Politique } from "@/app/Politique"
import { registerDoctor, registerPatient } from "@/app/signup/api/auth"
import { useAuth } from "@/lib/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"

export default function StepSharedFields({
  accountType,
  speciality,
  additionalFields,
  onSuccess,
}: {
  accountType: "doctor" | "patient"
  speciality?: string
  additionalFields?: React.ReactNode
  onSuccess?: () => void
}) {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  /* --------------------- submit --------------------- */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) return form.reportValidity()

    const fd = Object.fromEntries(new FormData(form))

    try {
      setLoading(true)

      /* ---- DOCTOR ---- */
      if (accountType === "doctor") {
        const payload = {
          firstName: fd.firstName as string,
          lastName: fd.lastName as string,
          phoneNumber: fd.phone as string,
          adress: fd.adress as string,
          email: fd.email as string,
          password: fd.password as string,
          dateOfBirth: fd.dateOfBirth as string,
          speciality: speciality ?? "General",
        }

        const { data } = await registerDoctor(payload)
        login({ token: data.token, user: data.user }) 
        console.log(payload)
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
        onSuccess?.()
        router.replace("/dashboard")
      }
      /* ---- PATIENT ---- */
      else {
        const payload = {
          firstName: fd.firstName as string,
          lastName: fd.lastName as string,
          phoneNumber: fd.phone as string,
          adress: fd.adress as string,
          email: fd.email as string,
          password: fd.password as string,
          dateOfBirth: fd.dateOfBirth as string,
          gender: fd.gender as "male" | "female",
          cin: fd.cin as string,
        }

        const { data } = await registerPatient(payload)
        login({ token: data.token, user: data.user })
        console.log(payload)
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
        onSuccess?.()
        router.replace("/patient/dashboard")
      }
    } catch (err) {
      alert("Erreur lors de l'inscription.")
    } finally {
      setLoading(false)
    }
  }

  const [gender, setGender] = useState<string>("")
  const data = [
    {
      value: "male",
      label: "Homme",
    },
    {
      value: "female",
      label: "Femme",
    },
  ]


  /* ----------------------- UI ----------------------- */
  return (
    <div className="grid grid-rows-[1fr_auto] h-full min-h-0">
      {/* Scrollable form content */}
      <div className="overflow-y-auto pr-2 -mr-2">
        <form onSubmit={handleSubmit} className="grid gap-4 pb-4" noValidate>
          {/* Identité - 2 column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                name="firstName"
                required
                autoComplete="given-name"
                placeholder="Entrez votre prénom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                name="lastName"
                required
                autoComplete="family-name"
                placeholder="Entrez votre nom"
              />
            </div>
          </div>

          {/* Contact info - 2 column grid on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="exemple@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                pattern="^(?:\+212|0)[0-9]{9}$"
                autoComplete="tel"
                placeholder="ex: 0612345678"
              />
            </div>
          </div>

          {/* Address - full width */}
          <div className="space-y-2">
            <Label htmlFor="adress">Adresse complète</Label>
            <Input
              id="adress"
              name="adress"
              required
              autoComplete="street-address"
              placeholder="Entrez votre adresse complète"
            />
          </div>

          {/* Date of birth and Gender/CIN - responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Patient-specific fields */}
            {accountType === "patient" && (
              <div className="space-y-2 sm:col-span-2 md:col-span-4">
                <Label htmlFor="gender">Genre</Label>
                <Select value={gender} onValueChange={setGender } name="gender">
                  <SelectTrigger className="mx-auto h-10">
                    <SelectValue placeholder="Select" aria-label={gender} />
                  </SelectTrigger>
                  <SelectContent>
                    {data.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        <span className="flex items-center gap-x-2">{item.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Password fields - 2 column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={8}
                required
                placeholder="Au moins 8 caractères"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                minLength={8}
                required
                placeholder="Répétez le mot de passe"
              />
            </div>
          </div>

          {/* Additional fields */}
          {additionalFields && (
            <div className="space-y-4">
              {additionalFields}
            </div>
          )}

          {/* Terms and conditions */}
          <div className="pt-2">
            <p className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
              En vous inscrivant, vous acceptez nos <Conditions /> et notre <Politique />.
            </p>
          </div>
        </form>
      </div>

      {/* Fixed footer with actions */}
      <div className="flex justify-between gap-4 pt-4 bg-white dark:bg-gray-950">
        <Link href="/signup">
          <Button variant="secondary" type="button">
            Retour
          </Button>
        </Link>

        <Button
          variant="primary"
          type="submit"
          className="w-full"
          isLoading={loading}
          loadingText="Création en cours..."
          onClick={() => {
            const form = document.querySelector('form');
            if (form) {
              form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
          }}
        >
          Créer mon espace
        </Button>
      </div>
    </div>
  )
}