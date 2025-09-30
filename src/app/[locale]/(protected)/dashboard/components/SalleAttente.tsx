"use client"

import { RiTimeLine } from "@remixicon/react"

import { cx } from "@/lib/utils"
import { Card } from "@/components/Card"
import { Divider } from "@/components/Divider"
import { ProgressCircle } from "@/components/ProgressCircle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs"
import {
  ClipboardPlus,
  FileText,
  MonitorDot,
  SquareActivity,
} from "lucide-react"

const data = [
  {
    status: "En consultation",
    icon: SquareActivity,
    iconColor: "text-blue-500",
    dossiers: [
      {
        patient: "Fatima El Amrani",
        motif: "Suivi post-opératoire",
        lieu: "Cabinet principal",
        remarque: "Consultation en cours",
        progressionActuelle: 1,
        progressionTotale: 2,
        misAJour: "il y a 5 min",
      },
    ],
  },
  {
    status: "Salle d’attente",
    icon: RiTimeLine,
    iconColor: "text-orange-500",
    dossiers: [
      {
        patient: "Mohamed Lakhlifi",
        motif: "Vertiges",
        lieu: "Salle A",
        remarque: "Patient arrivé",
        progressionActuelle: 1,
        progressionTotale: 2,
        misAJour: "il y a 2 min",
      },
      {
        patient: "Zineb Rami",
        motif: "Suivi de grossesse",
        lieu: "Salle A",
        remarque: "En attente",
        progressionActuelle: 1,
        progressionTotale: 1,
        misAJour: "il y a 10 min",
      },
      {
        patient: "Amine Hafidi",
        motif: "Bilan sanguin",
        lieu: "Salle B",
        remarque: "Arrivé",
        progressionActuelle: 1,
        progressionTotale: 1,
        misAJour: "il y a 15 min",
      },
    ],
  },
  {
    status: "Rendez-vous visioconférence",
    icon: MonitorDot,
    iconColor: "text-emerald-500",
    dossiers: [
      {
        patient: "Soukaina Jebari",
        motif: "Anxiété",
        lieu: "Téléconsultation - 17:00",
        remarque: "En attente",
        progressionActuelle: 0,
        progressionTotale: 1,
        misAJour: "prévu à 17:00",
      },
      {
        patient: "Omar El Idrissi",
        motif: "Résultats scanner",
        lieu: "Téléconsultation - 18:30",
        remarque: "Prévu",
        progressionActuelle: 0,
        progressionTotale: 1,
        misAJour: "prévu à 18:30",
      },
      {
        patient: "Sofia Berrada",
        motif: "Contrôle diabète",
        lieu: "Téléconsultation - 19:00",
        remarque: "À confirmer",
        progressionActuelle: 0,
        progressionTotale: 1,
        misAJour: "prévu à 19:00",
      },
    ],
  },
]

const statusColor = {
  "En consultation":
    "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20",
  "Salle d’attente":
    "bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/20",
  "Rendez-vous visioconférence":
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",
}

export default function PatientTracking() {
  return (
    <Card className="mt-6 bg-gray-50 p-0 dark:bg-gray-900">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Patients en cours de gestion
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Suivi en temps réel des dossiers actifs
        </p>
      </div>
      <Tabs defaultValue={data[0].status}>
        <TabsList className="bg-gray-50 px-6 dark:bg-gray-900">
          {data.map((category) => (
            <TabsTrigger
              key={category.status}
              value={category.status}
              className="group"
            >
              <div className="sm:flex sm:items-center sm:space-x-2">
                <category.icon
                  className={cx(category.iconColor, "hidden size-5 sm:block")}
                  aria-hidden={true}
                />
                <span className="group-data-[state=active]:text-gray-900 group-data-[state=active]:dark:text-gray-50">
                  {category.status}
                </span>
                <span className="hidden rounded-md bg-white px-2 py-1 text-xs font-semibold tabular-nums ring-1 ring-inset ring-gray-200 group-data-[state=active]:text-gray-700 sm:block dark:bg-[#090E1A] dark:ring-gray-800 group-data-[state=active]:dark:text-gray-300">
                  {category.dossiers.length}
                </span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        <ul role="list" className="rounded-b-md bg-white dark:bg-gray-950">
          {data.map((category) => (
            <TabsContent
              key={category.status}
              value={category.status}
              className="space-y-4 p-6"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {category.dossiers.map((dossier) => (
                  <Card
                    key={dossier.patient}
                    asChild
                    className="dark:border-gray-800"
                  >
                    <li>
                      <div className="flex items-center justify-between space-x-4 sm:justify-start sm:space-x-2">
                        <h4 className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                          {dossier.patient}
                        </h4>
                        <span
                          className={cx(
                            statusColor[
                              category.status as keyof typeof statusColor
                            ],
                            "inline-flex items-center whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                          )}
                        >
                          {category.status}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
                        <div className="flex items-center space-x-1.5">
                          <ClipboardPlus
                            width={18}
                            className="text-gray-400 dark:text-gray-600"
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {dossier.motif}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <FileText
                            width={18}
                            className="text-gray-400 dark:text-gray-600"
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Description .....
                          </p>
                        </div>
                      </div>
                      <Divider />
                      <div className="block sm:flex sm:items-center sm:justify-between sm:space-x-2">
                        <div className="flex items-center space-x-2">
                          <ProgressCircle
                            value={
                              (dossier.progressionActuelle /
                                dossier.progressionTotale) *
                              100
                            }
                            radius={9}
                            strokeWidth={3.5}
                          />
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                            Consultations ({dossier.progressionActuelle}/
                            {dossier.progressionTotale})
                          </p>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 sm:mt-0 dark:text-gray-500">
                          Mis à jour {dossier.misAJour}
                        </p>
                      </div>
                    </li>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </ul>
      </Tabs>
    </Card>
  )
}
