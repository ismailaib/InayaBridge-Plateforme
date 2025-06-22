"use client"

import StepSharedFields from "../components/StepSharedFields"
import StepDoctorSpecialisation from "../components/StepDoctorSpecialisation"
import { motion, AnimatePresence } from "framer-motion"
import { SetStateAction, useState } from "react"
import Image from "next/image"
import logo from "../../icon-logo.png"
import { DatePickerBirthDateExample } from "@/components/DateBirth"
import { Label } from "@/components/Label"
import React from "react"

export default function DoctorWelcomePage() {
  const [step, setStep] = useState<"shared" | "specialisation">("shared")
  const [speciality, setSpeciality] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined)

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 w-full overflow-hidden">
      {/* Left form section */}
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 overflow-y-auto">
        <div className="w-full max-w-xl space-y-6 text-start">
          {/* Logo / Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-fit rounded-xl bg-gray-50 p-4 shadow-md shadow-black/10 ring-1 ring-black/10 dark:bg-gray-900 dark:ring-gray-800"
          >
            <div className="absolute left-[9%] top-[9%] size-1 rounded-full bg-gray-100 shadow-inner dark:bg-gray-800" />
            <div className="absolute right-[9%] top-[9%] size-1 rounded-full bg-gray-100 shadow-inner dark:bg-gray-800" />
            <div className="absolute bottom-[9%] left-[9%] size-1 rounded-full bg-gray-100 shadow-inner dark:bg-gray-800" />
            <div className="absolute bottom-[9%] right-[9%] size-1 rounded-full bg-gray-100 shadow-inner dark:bg-gray-800" />
            <div className="w-fit rounded-lg bg-gradient-to-b from-[#00b38fdc] to-[#00b38f] p-3 shadow-sm shadow-[#00b38f]/50 ring-1 ring-inset ring-white/25">
              <Image src={logo} alt="" width={24} height={24} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Bienvenue, Docteur
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {step === "shared"
                ? "Vous êtes sur le point de rejoindre notre communauté médicale."
                : "Merci ! Maintenant, sélectionnez votre spécialité pour compléter votre profil."}
            </p>
          </motion.div>

          {/* Step form with animation */}
          <div className="relative min-h-[480px] w-full">
            <AnimatePresence mode="wait">
              {step === "shared" ? (
                <motion.div
                  key="shared"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <StepDoctorSpecialisation
                    onSuccess={() => setStep("specialisation")}
                    onContinue={(spec: SetStateAction<string | null>) => {
                      setSpeciality(spec)
                      setStep("shared")
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="specialisation"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <StepSharedFields accountType="doctor" speciality={speciality || ""} additionalFields={

                    <>
                      <div>
                        <Label htmlFor="dob" className="font-medium">Date de naissance</Label>
                        <div className="mt-2">
                          <DatePickerBirthDateExample value={selectedDate} onChange={setSelectedDate} />
                          <input
                            type="hidden"
                            name="dateOfBirth"
                            value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                            tabIndex={-1}
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </>
                  } />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right animated showcase section */}
      <motion.aside
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden h-full overflow-hidden p-6 lg:flex"
        aria-label="Product showcase"
      >
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-[#a7f3d0] to-[#10b981] p-16 xl:p-24 dark:from-[#10b981] dark:to-[#059669]">
          <div className="max-w-lg space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-semibold leading-9 text-white">
                La solution intelligente pour les professionnels de santé
              </h2>
              <p className="mt-4 text-white">
                Gérez vos rendez-vous, vos patients et vos dossiers médicaux simplement.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="rounded-xl bg-white/10 p-1.5 ring-1 ring-white/20"
            >
              <Image
                alt="Dashboard illustration"
                src="/opengraph-image.png"
                className="rounded-md shadow-2xl ring-1 ring-white/20"
                width={1028}
                height={1028}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid h-20 grid-cols-3 items-center gap-10"
            >
              {[1, 2, 3].map((id) => (
                <Image
                  key={id}
                  alt={`Partner logo ${id}`}
                  src={`https://blocks.tremor.so/logos/white/placeholder${id}.svg`}
                  width={158}
                  height={48}
                  className="max-h-20 w-full object-contain"
                />
              ))}
            </motion.div>
          </div>
        </div>
      </motion.aside>
    </div>
  )
}
