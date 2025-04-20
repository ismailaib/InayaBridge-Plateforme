"use client"

import {
  RiFileHistoryFill,
  RiCheckDoubleFill,
  RiTestTubeFill,
  RiStethoscopeFill,
} from "@remixicon/react"

import { cx } from "@/lib/utils"

import { BarChart } from "@/components/BarChart"
import { Card } from "@/components/Card"
import { CategoryBar } from "@/components/CategoryBar"
import { Divider } from "@/components/Divider"

const data = [
  {
    name: "Consultations de suivi",
    value: 12,
    icon: RiFileHistoryFill,
    iconColor: "text-indigo-500 dark:text-indigo-500",
  },
  {
    name: "Consultations clôturées",
    value: 48,
    icon: RiCheckDoubleFill,
    iconColor: "text-emerald-500 dark:text-emerald-500",
  },
  {
    name: "Diagnostics en attente",
    value: 9,
    icon: RiTestTubeFill,
    iconColor: "text-indigo-500 dark:text-indigo-500",
  },
  {
    name: "Diagnostics validés",
    value: 31,
    icon: RiCheckDoubleFill,
    iconColor: "text-emerald-500 dark:text-emerald-500",
  },
]


export default function DoctorAnalyticsSection() {
  return (
    <>
      <Card className="mt-6 overflow-hidden p-0">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-900 dark:bg-[#090E1A]">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
            Vue d’ensemble clinique
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
          <div>
            <CategoryBar
              values={[12, 48]}
              colors={["cyan", "emerald"]}
              showLabels={false}
            />
            <p className="mt-2 text-sm text-gray-900 dark:text-gray-50">
              <span className="font-semibold">12</span> consultations de suivi
              programmées
            </p>
          </div>
          <div>
            <CategoryBar
              values={[9, 31]}
              colors={["cyan", "emerald"]}
              showLabels={false}
            />
            <p className="mt-2 text-sm text-gray-900 dark:text-gray-50">
              <span className="font-semibold">9</span> diagnostics en attente
              d’évaluation
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-px border-t border-gray-200 bg-gray-200 md:grid-cols-4 dark:border-gray-900 dark:bg-gray-900">
          {data.map((item) => (
            <li
              key={item.name}
              className="flex flex-col items-center justify-center bg-white p-3 dark:bg-[#090E1A]"
            >
              <div className="flex items-center space-x-1">
                <item.icon
                  className={cx(item.iconColor, "size-5")}
                  aria-hidden={true}
                />
                <span className="font-semibold text-gray-900 dark:text-gray-50">
                  {item.value}
                </span>
              </div>
              <span className="text-sm text-gray-900 dark:text-gray-50">
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Divider className="my-10">Statistiques avancées</Divider>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-50">
            Résumé d&apos;activité médicale
          </h4>
          <p className="mt-4 text-sm/6 text-gray-500 dark:text-gray-500">
            Cette semaine, les praticiens ont enregistré un total de{" "}
            <span className="font-medium text-gray-900 dark:text-gray-50">
              60 consultations
            </span>
            , incluant{" "}
            <span className="font-medium text-gray-900 dark:text-gray-50">
              9 diagnostics en cours
            </span>{" "}
            et{" "}
            <span className="font-medium text-gray-900 dark:text-gray-50">
              31 validés
            </span>
            . Une moyenne de{" "}
            <span className="font-medium text-gray-900 dark:text-gray-50">
              12 suivis
            </span>{" "}
            a été planifiée, assurant un bon rythme de prise en charge continue.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-50">
            Maladies les plus fréquentes
          </h4>
          <BarChart
            data={[
              { maladie: "Hypertension", Consultations: 14 },
              { maladie: "Diabète de type 2", Consultations: 11 },
              { maladie: "Infections respiratoires", Consultations: 9 },
              { maladie: "Allergies saisonnières", Consultations: 7 },
              { maladie: "Douleurs chroniques", Consultations: 6 },
            ]}
            index="maladie"
            categories={["Consultations"]}
            colors={["amber"]}
            showLegend={false}
            layout="vertical"
            yAxisWidth={120}
            className="mt-4 h-48"
          />
        </div>
      </div>
    </>
  )
}
