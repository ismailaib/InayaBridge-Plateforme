"use client"

import { Divider } from "@/components/Divider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import React from "react"
import Banner from "./components/Banner"
import Kpis from "./components/Kpis"
import SalleAttente from "./components/SalleAttente"
import Statistics from "./components/Statistics"
import Reporting from "./components/Reporting"

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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header>
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Bienvenue Dr. Ismail
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

          <div className="mt-4 flex flex-col gap-2 sm:mt-0 sm:flex-row sm:items-center">
            <div className="w-[150px]">
              <Select>
                <SelectTrigger id="size" className="mt-2">
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
                <SelectTrigger id="size" className="mt-2">
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
      <Banner />
      <Divider />

      <main>
        <Kpis />
        <Statistics />
        <Reporting />     
        <SalleAttente />     
      </main>
    </div>
  )
}
