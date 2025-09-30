"use client"

import { registerDoctor, registerDoctorProfile, registerPatient } from "@/api/profile"
import { Conditions } from "@/app/Conditions"
import { Politique } from "@/app/Politique"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/lib/useToast"
import confetti from "canvas-confetti"
import Link from "next/link"
import { useState } from "react"

interface ValidationErrors {
  [key: string]: string
}

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
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  console.log(speciality)

  /* --------------------- Frontend Validation --------------------- */
  const validateForm = (formData: FormData): ValidationErrors => {
    const errors: ValidationErrors = {}
    const data = Object.fromEntries(formData)

    // First name validation
    if (!data.firstName || (data.firstName as string).trim().length < 2) {
      errors.firstName = "Le prénom doit contenir au moins 2 caractères"
    }

    // Last name validation
    if (!data.lastName || (data.lastName as string).trim().length < 2) {
      errors.lastName = "Le nom doit contenir au moins 2 caractères"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!data.email || !emailRegex.test(data.email as string)) {
      errors.email = "Veuillez entrer une adresse e-mail valide"
    }

    // Phone validation (Moroccan numbers)
    const phoneRegex = /^(?:\+212|0)[0-9]{9}$/
    if (!data.phone || !phoneRegex.test(data.phone as string)) {
      errors.phone = "Le numéro doit être un numéro marocain valide (+212XXXXXXXXX)"
    }

    // Address validation
    if (!data.adress || (data.adress as string).trim().length < 5) {
      errors.adress = "L'adresse doit contenir au moins 5 caractères"
    }

    // Password validation
    if (!data.password || (data.password as string).length < 8) {
      errors.password = "Le mot de passe doit contenir au moins 8 caractères"
    }

    // Password confirmation validation
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas"
    }

    // Patient-specific validations
    if (accountType === "patient") {
      // Gender validation
      if (!data.gender) {
        errors.gender = "Veuillez sélectionner votre genre"
      }

      // CIN validation (Moroccan national ID)
      const cinRegex = /^[A-Z]{1,2}[0-9]{6}$/
      if (!data.cin || !cinRegex.test(data.cin as string)) {
        errors.cin = "Le CIN doit être au format valide (ex: AB123456)"
      }
    }

    return errors
  }

  /* --------------------- Error Message Handling --------------------- */
  const getErrorMessage = (error: any): string => {
    // Handle validation errors from backend
    if (error?.details) {
      const firstField = Object.keys(error.details)[0]
      const firstError = error.details[firstField]
      
      // Map backend field names to French messages
      const fieldMessages: { [key: string]: string } = {
        phoneNumber: "Numéro de téléphone invalide il faut commencer par +212",
        email: "Cette adresse e-mail existe déjà",
        cin: "Ce CIN existe déjà",
        firstName: "Prénom invalide",
        lastName: "Nom invalide",
        password: "Mot de passe trop faible",
        dateOfBirth: "Date de naissance invalide"
      }

      return fieldMessages[firstField] || firstError || "Erreur de validation"
    }

    // Handle specific error messages
    if (error?.message) {
      const messageMap: { [key: string]: string } = {
        "Email already exists": "Cette adresse e-mail est déjà utilisée",
        "Phone number already exists": "Ce numéro de téléphone est déjà utilisé",
        "CIN already exists": "Ce CIN est déjà enregistré",
        "Invalid phone number": "Numéro de téléphone invalide",
        "Validation Failed": "Veuillez vérifier vos informations"
      }

      return messageMap[error.message] || error.message
    }

    // Default error messages
    return "Une erreur s'est produite. Veuillez réessayer."
  }

  /* --------------------- submit --------------------- */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    // Clear previous validation errors
    setValidationErrors({})

    // Frontend validation
    const errors = validateForm(formData)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      
      // Show first error in toast
      const firstError = Object.values(errors)[0]
      toast({
        title: "Erreur de validation",
        description: firstError,
        variant: "error",
        duration: 4000,
      })
      return
    }

    const fd = Object.fromEntries(formData)

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
          status: "PENDING_VERIFICATION" as string,
        }

        const { data } = await registerDoctor(payload)

        const profile = {
          tenantId: "",
          userId: data.user.id,
          licenseNumber: "",
          specialty: speciality ?? "General"
        }

        await registerDoctorProfile(profile)
        login({ token: data.token, user: data.user })
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
        onSuccess?.()
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
      }
    } catch (err: any) {
      console.error("Registration error:", err)
      
      const errorMessage = getErrorMessage(err?.response?.data || err)
      
      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "error",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const [gender, setGender] = useState<string>("")
  const genderData = [
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
                className={validationErrors.firstName ? "border-red-500" : ""}
              />
              {validationErrors.firstName && (
                <p className="text-xs text-red-500">{validationErrors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                name="lastName"
                required
                autoComplete="family-name"
                placeholder="Entrez votre nom"
                className={validationErrors.lastName ? "border-red-500" : ""}
              />
              {validationErrors.lastName && (
                <p className="text-xs text-red-500">{validationErrors.lastName}</p>
              )}
            </div>
          </div>

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
                className={validationErrors.email ? "border-red-500" : ""}
              />
              {validationErrors.email && (
                <p className="text-xs text-red-500">{validationErrors.email}</p>
              )}
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
                placeholder="ex: +212612345678"
                className={validationErrors.phone ? "border-red-500" : ""}
              />
              {validationErrors.phone && (
                <p className="text-xs text-red-500">{validationErrors.phone}</p>
              )}
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
              className={validationErrors.adress ? "border-red-500" : ""}
            />
            {validationErrors.adress && (
              <p className="text-xs text-red-500">{validationErrors.adress}</p>
            )}
          </div>

          {/* Date of birth and Gender/CIN - responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Patient-specific fields */}
            {accountType === "patient" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="gender">Genre</Label>
                  <Select value={gender} onValueChange={setGender} name="gender">
                    <SelectTrigger className={`mx-auto h-10 ${validationErrors.gender ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Sélectionnez" aria-label={gender} />
                    </SelectTrigger>
                    <SelectContent>
                      {genderData.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          <span className="flex items-center gap-x-2">{item.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.gender && (
                    <p className="text-xs text-red-500">{validationErrors.gender}</p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="cin">CIN (Carte d&apos;identité nationale)</Label>
                  <Input
                    id="cin"
                    name="cin"
                    required
                    placeholder="ex: AB123456"
                    pattern="^[A-Z]{1,2}[0-9]{6}$"
                    className={validationErrors.cin ? "border-red-500" : ""}
                  />
                  {validationErrors.cin && (
                    <p className="text-xs text-red-500">{validationErrors.cin}</p>
                  )}
                  <p className="text-xs text-gray-500">Format: 1-2 lettres suivies de 6 chiffres</p>
                </div>
              </>
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
                className={validationErrors.password ? "border-red-500" : ""}
              />
              {validationErrors.password && (
                <p className="text-xs text-red-500">{validationErrors.password}</p>
              )}
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
                className={validationErrors.confirmPassword ? "border-red-500" : ""}
              />
              {validationErrors.confirmPassword && (
                <p className="text-xs text-red-500">{validationErrors.confirmPassword}</p>
              )}
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