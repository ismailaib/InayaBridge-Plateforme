"use client"

import { RiStethoscopeLine, RiUserHeartLine } from "@remixicon/react"
import { Card } from "@/components/Card"
import { Button } from "@/components/Button"
import { useState } from "react"
import { Frown, Smile } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import logo from "../icon-logo.png"
import Link from "next/link"
import { Politique } from "../Politique"
import { Conditions } from "../Conditions"

const roles = [
  {
    label: "Médecin",
    value: "doctor",
    icon: RiStethoscopeLine,
    description:
      "Gérez vos patients, rédigez des ordonnances et connectez-vous aux réseaux de soins.",
    border: "border-[#00b38f]",
  },
  {
    label: "Patient",
    value: "patient",
    icon: RiUserHeartLine,
    description:
      "Accédez à des soins personnalisés, gérez vos rendez-vous et échangez avec les médecins.",
    border: "border-[#00b38f]",
  },
]

export default function Example() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-40 lg:px-6">
        <motion.div className="relative sm:w-full sm:max-w-2xl">
          {/* Decorative Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pointer-events-none absolute -top-[25%] left-1/2 -translate-x-1/2 select-none opacity-60 dark:opacity-90"
            aria-hidden="true"
            style={{
              maskImage:
                "radial-gradient(rgba(0, 0, 0, 1) 0%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(rgba(0, 0, 0, 1) 0%, transparent 80%)",
            }}
          >
            <div className="flex flex-col gap-1">
              {Array.from({ length: 10 }, (_, idx) => (
                <div key={`outer-${idx}`} className="flex gap-2">
                  {Array.from({ length: 10 }, (_, idx2) => (
                    <div key={`inner-${idx}-${idx2}`}>
                      <div className="size-7 rounded-md shadow shadow-indigo-500/40 ring-1 ring-black/5 dark:shadow-indigo-400/20 dark:ring-white/10" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Logo / Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mx-auto w-fit rounded-xl bg-gray-50 p-4 shadow-md shadow-black/10 ring-1 ring-black/10 dark:bg-gray-900 dark:ring-gray-800"
          >
            <div className="absolute left-[9%] top-[9%] size-1 rounded-full bg-gray-100 shadow-inner dark:bg-gray-800" />
            <div className="absolute right-[9%] top-[9%] size-1 rounded-full bg-gray-100 shadow-inner dark:bg-gray-800" />
            <div className="absolute bottom-[9%] left-[9%] size-1 rounded-full bg-gray-100 shadow-inner dark:bg-gray-800" />
            <div className="absolute bottom-[9%] right-[9%] size-1 rounded-full bg-gray-100 shadow-inner dark:bg-gray-800" />
            <div className="w-fit rounded-lg bg-gradient-to-b from-[#00b38fdc] to-[#00b38f] p-3 shadow-sm shadow-[#00b38f]/50 ring-1 ring-inset ring-white/25">
              <Image src={logo} alt="" width={24} height={24} />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-xl font-semibold text-gray-900 dark:text-gray-50"
          >
            On fait connaissance ? Vous êtes plutôt...
          </motion.h2>

          <div className="mt-10 grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2">
            {roles.map(({ label, value, icon: Icon, description, border }) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <Card
                  onClick={() => setSelectedRole(value)}
                  className={`flex h-full cursor-pointer flex-col justify-between border transition-all duration-200 ${
                    selectedRole === value
                      ? `ring-2 ring-[#00b38f] ${border} shadow-md`
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-md bg-gray-100 p-3 dark:bg-gray-800">
                      <Icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {label}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* <AnimatePresence mode="wait">
            {selectedRole && (
              <motion.p
                key={selectedRole}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-center text-sm text-[#00b38f]"
              >
                {selectedRole === "doctor"
                  ? "Génial ! Un espace dédié aux professionnels de santé vous attend 🩺"
                  : "Super ! On va prendre soin de vous 💚"}
              </motion.p>
            )}
          </AnimatePresence> */}

          <motion.div
            className="flex w-full justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href={"/"}>
              <Button
                type="button"
                variant="secondary"
                className="mt-12 flex w-fit flex-row justify-between gap-4 px-6"
              >
                Retour
                <Frown />
              </Button>
            </Link>
            <Link
              href={
                selectedRole === "doctor" ? "signup/doctor" : "signup/patient"
              }
            >
              <Button
                type="button"
                variant="secondary"
                disabled={!selectedRole}
                className="mt-12 flex w-fit flex-row justify-between gap-4 px-6"
              >
                C&apos;est parti
                <Smile />
              </Button>
            </Link>
          </motion.div>

          <p className="mt-4 flex justify-center gap-1 text-xs text-gray-500 dark:text-gray-500">
            En vous connectant, vous acceptez nos <Conditions /> et notre{" "}
            <Politique />.
          </p>
        </motion.div>
      </div>
    </>
  )
}
