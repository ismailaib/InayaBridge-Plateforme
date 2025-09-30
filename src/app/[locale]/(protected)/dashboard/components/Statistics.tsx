"use client"

import {
  RiFileHistoryFill,
  RiCheckDoubleFill,
  RiTestTubeFill,
} from "@remixicon/react"

import { cx } from "@/lib/utils"

import { BarChart } from "@/components/BarChart"
import { Card } from "@/components/Card"
import { CategoryBar } from "@/components/CategoryBar"
import { Divider } from "@/components/Divider"
import { Tooltip } from "@/components/Tooltip"
import { Info } from "lucide-react"

const data = [
  {
    name: "Consultations de suivi",
    value: 12,
    icon: RiFileHistoryFill,
    iconColor: "text-indigo-500 dark:text-indigo-500",
    tooltip: "Nombre de consultations prévues pour assurer le suivi médical des patients existants.",
  },
  {
    name: "Consultations clôturées",
    value: 48,
    icon: RiCheckDoubleFill,
    iconColor: "text-emerald-500 dark:text-emerald-500",
    tooltip: "Consultations terminées et enregistrées comme complètes.",
  },
  {
    name: "Diagnostics en attente",
    value: 9,
    icon: RiTestTubeFill,
    iconColor: "text-indigo-500 dark:text-indigo-500",
    tooltip: "Cas médicaux pour lesquels un diagnostic est encore en cours d'évaluation.",
  },
  {
    name: "Diagnostics validés",
    value: 31,
    icon: RiCheckDoubleFill,
    iconColor: "text-emerald-500 dark:text-emerald-500",
    tooltip: "Cas médicaux ayant reçu un diagnostic confirmé.",
  },
]

export default function DoctorAnalyticsSection() {
  return (
    <>
      <Card className="mt-6 overflow-hidden p-0">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-900 dark:bg-[#090E1A] flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
            Vue d&apos;ensemble
          </h3>
          <Tooltip content="Statistiques globales des activités." showArrow={false}>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <Info width={18} />
            </span>
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
          <div>
              <CategoryBar values={[12, 48]} colors={["cyan", "emerald"]} showLabels={false} />
            <p className="mt-2 text-sm text-gray-900 dark:text-gray-50">
              <span className="font-semibold">12</span> consultations de suivi programmées
            </p>
          </div>
          <div>
              <CategoryBar values={[9, 31]} colors={["cyan", "emerald"]} showLabels={false} />
            <p className="mt-2 text-sm text-gray-900 dark:text-gray-50">
              <span className="font-semibold">9</span> diagnostics en attente d’évaluation
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-px border-t border-gray-200 bg-gray-200 md:grid-cols-4 dark:border-gray-900 dark:bg-gray-900">
          {data.map((item) => (
            <Tooltip key={item.name} content={item.tooltip} showArrow={false}>
              <li className="flex flex-col items-center justify-center bg-white p-3 dark:bg-[#090E1A] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
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
            </Tooltip>
          ))}
        </ul>
      </Card>

      <Divider className="my-10">Statistiques avancées</Divider>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 dark:text-gray-50">
              Résumé d&apos;activité médicale
            </h4>
            <Tooltip
              content="Un résumé hebdomadaire des principales activités."
              showArrow={false}
            >
              <Info width={18} className="text-gray-500 dark:text-gray-400" />
            </Tooltip>
          </div>
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
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 dark:text-gray-50">
              Maladies les plus fréquentes
            </h4>
            <Tooltip
              content="Classement des maladies selon le nombre de consultations hebdomadaires."
              showArrow={false}
            >
              <Info width={18} className="text-gray-500 dark:text-gray-400" />
            </Tooltip>
          </div>
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
