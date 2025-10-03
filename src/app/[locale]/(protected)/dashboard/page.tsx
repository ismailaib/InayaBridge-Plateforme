"use client"

import { Divider } from "@/components/Divider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { DashboardModal } from "./components/DashboardModal"
import Kpis from "./components/Kpis"
import Banner from "./components/onboarding/Banner"
import Reporting from "./components/Reporting"
import SalleAttente from "./components/SalleAttente"
import Statistics from "./components/Statistics"
import useTranslations from "@/lib/i18n/useTranslations"

// Greeting Loader Component
function GreetingLoader() {
  const greetings = ["Hello", "Hola", "Bonjour", "سلام"]
  const [currentIndex, setCurrentIndex] = useState(0)

  

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % greetings.length)
    }, 1000)

    return () => clearInterval(interval)
  }, [greetings.length])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-5xl font-bold text-gray-900 dark:text-gray-50"
          >
            {greetings[currentIndex]}
          </motion.div>
        </AnimatePresence>
        <motion.div
          className="mt-6 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {greetings.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${index === currentIndex
                  ? "bg-blue-500 w-8"
                  : "bg-gray-300 dark:bg-gray-700"
                }`}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const t = useTranslations("common")
  const d = useTranslations("signup")
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // --- Load user from localStorage ---
  let user: {
    lastName?: string
    firstName?: string
    role?: string
    doctorProfile?: { specialty?: string }
  } = {}

  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        console.log("Parsed user from localStorage:", parsed)

        user = {
          lastName: parsed.lastName,
          firstName: parsed.firstName,
          role: parsed.role,
          doctorProfile: parsed.doctorProfile,
        }
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err)
      }
    }
  }

  // --- Month & Year Selects ---
  const monthSelect = [
    { label: t("months.1"), value: "janvier" },
    { label: t("months.2"), value: "février" },
    { label: t("months.3"), value: "mars" },
    { label: t("months.4"), value: "avril" },
    { label: t("months.5"), value: "mai" },
    { label: t("months.6"), value: "juin" },
    { label: t("months.7"), value: "juillet" },
    { label: t("months.8"), value: "août" },
    { label: t("months.9"), value: "septembre" },
    { label: t("months.10"), value: "octobre" },
    { label: t("months.11"), value: "novembre" },
    { label: t("months.12"), value: "décembre" },
  ]

  const currentYear = new Date().getFullYear()
  const yearSelect = Array.from({ length: 6 }, (_, i) => {
    const year = (currentYear - i).toString()
    return { label: year, value: year }
  })

  if (isLoading) {
    return <GreetingLoader />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 lg:p-8"
    >
      {/* Header */}
      <header>
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              {d('doctor.title')} {user.lastName} {user.firstName}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {user.doctorProfile?.specialty ?? "Médecin"} •{" "}
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:mt-0 sm:flex-row sm:items-end">
            <DashboardModal />
            <div className="w-[150px]">
              <Select defaultValue={monthSelect[new Date().getMonth()].value}>
                <SelectTrigger id="month" className="mt-2">
                  <SelectValue placeholder="Mois" />
                </SelectTrigger>
                <SelectContent>
                  {monthSelect.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[150px]">
              <Select defaultValue={new Date().getFullYear().toString()}>
                <SelectTrigger id="year" className="mt-2">
                  <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
                  {yearSelect.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <Divider />

      <motion.div initial="hidden" animate="visible" custom={0}>
        <Banner />
      </motion.div>

      <Divider />

      {/* Main Content */}
      <main className="space-y-8">
        <motion.div initial="hidden" animate="visible" custom={1}>
          <Kpis />
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={2}>
          <Statistics />
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={3}>
          <Reporting />
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={4}>
          <SalleAttente />
        </motion.div>
      </main>
    </motion.div>
  )
}
