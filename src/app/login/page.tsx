"use client"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { RiArrowRightSLine } from "@remixicon/react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import logo from "../icon-logo.png"
import { Conditions } from "../Conditions"
import { Politique } from "../Politique"

export default function LoginPage() {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 overflow-hidden lg:grid-cols-2">
      {/* Left form section */}
      <div className="flex h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-12">
        <div className="flex w-full max-w-xl flex-col gap-8">
          {/* Logo */}
          <div className="flex flex-row items-center justify-start">
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
                <Image
                  src={logo}
                  alt="InayaBridge Logo"
                  width={24}
                  height={24}
                />
              </div>
            </motion.div>
          </div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Connexion à votre espace
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Identifiez-vous pour accéder à votre tableau de bord patient ou
              professionnel.
            </p>
          </motion.div>

          {/* Login Form */}
          <form className="space-y-5 text-start">
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

            <div>
              <Label htmlFor="password" className="font-medium">
                Mot de passe
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="mt-2"
              />
            </div>

            <p className="mt-4 flex justify-center gap-1 text-xs text-gray-500 dark:text-gray-500">
              En vous connectant, vous acceptez nos{" "}
              <Conditions />{" "}
              et notre{" "}
              <Politique />
              .
            </p>
          </form>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-between">
            <Link href="/signup">
              <Button variant="secondary" type="button">
                Créer un compte
              </Button>
            </Link>

            <Button
              variant="primary"
              className="w-full"
              loadingText="Connexion..."
            >
              Se connecter
            </Button>
          </div>
        </div>
      </div>

      {/* Right showcase */}
      <motion.aside
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="border-1 hidden h-full overflow-hidden border-l border-gray-400/20 p-6 lg:flex"
        aria-label="Illustration"
      >
        <div className="flex w-full flex-1 items-center justify-center">
          <div className="max-w-md">
            <div>
              <h2 className="font-mono text-sm text-gray-700 dark:text-gray-300">
                Mise à jour de la plateforme
              </h2>
              <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-50">
                Nouvelle interface patient, rappels de rendez-vous, et dossiers
                médicaux enrichis
              </p>
            </div>

            <div className="relative mt-6 h-64 max-w-[450px] overflow-hidden rounded-xl bg-gradient-to-br from-[#00b38f]/80 to-[#1ec9a8]/20 p-6 shadow-lg shadow-black/10">
              <div className="flex h-full flex-col justify-between">
                <p className="text-2xl font-semibold text-white dark:text-white">
                  Version Automne
                </p>
                <p className="text-lg text-white dark:text-white">2024</p>
              </div>
              <div
                className="pointer-events-none absolute left-1/2 top-0 -mt-2 -translate-x-1/2 select-none"
                aria-hidden="true"
                style={{
                  maskImage:
                    "radial-gradient(rgba(0, 0, 0, 1) 0%, transparent 80%)",
                  WebkitMaskImage:
                    "radial-gradient(rgba(0, 0, 0, 1) 0%, transparent 80%)",
                }}
              >
                <div className="flex flex-col gap-1">
                  {Array.from({ length: 20 }, (_, idx) => (
                    <div key={`outer-${idx}`}>
                      <div className="flex gap-2">
                        {Array.from({ length: 20 }, (_, idx2) => (
                          <div key={`inner-${idx}-${idx2}`}>
                            <div className="dark:shadow-[#00b38f]00/20 size-7 rounded-md shadow shadow-[#00b38f]/40 ring-1 ring-black/5 dark:ring-white/10" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/changelog"
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[#00b38f] hover:underline hover:underline-offset-4"
            >
              Découvrir les nouveautés
              <RiArrowRightSLine
                className="size-5 shrink-0"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </motion.aside>
    </div>
  )
}
