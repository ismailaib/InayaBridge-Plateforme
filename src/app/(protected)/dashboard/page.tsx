"use client"

import { Divider } from "@/components/Divider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { motion } from "framer-motion"
import Banner from "./components/Banner"
import { DashboardModal } from "./components/DashboardModal"
import Kpis from "./components/Kpis"
import Reporting from "./components/Reporting"
import SalleAttente from "./components/SalleAttente"
import Statistics from "./components/Statistics"


const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
}

export default function Dashboard() {
  const monthSelect = [
    { label: "Janvier", value: "janvier" },
    { label: "Février", value: "février" },
    { label: "Mars", value: "mars" },
    { label: "Avril", value: "avril" },
    { label: "Mai", value: "mai" },
    { label: "Juin", value: "juin" },
    { label: "Juillet", value: "juillet" },
    { label: "Août", value: "août" },
    { label: "Septembre", value: "septembre" },
    { label: "Octobre", value: "octobre" },
    { label: "Novembre", value: "novembre" },
    { label: "Décembre", value: "décembre" },
  ]

  const yearSelect = [
    { label: "2025", value: "2025" },
    { label: "2024", value: "2024" },
    { label: "2023", value: "2023" },
    { label: "2022", value: "2022" },
    { label: "2021", value: "2021" },
    { label: "2020", value: "2020" },
  ]

  let user = { lastName: "AIT BOUHMAD" }
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        if (parsed && parsed.lastName) {
          user.lastName = parsed.lastName
        }
      } catch {}
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header>
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Bienvenue Dr. {user.lastName}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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
              <Select>
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
              <Select>
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

      <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0}>
        <Banner />
      </motion.div>

      <Divider />

      <main className="space-y-8">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={1}>
          <Kpis />
        </motion.div>

        <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={2}>
          <Statistics />
        </motion.div>

        <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={3}>
          <Reporting />
        </motion.div>

        <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={4}>
          <SalleAttente />
        </motion.div>
      </main>
    </div>
  )
}
