"use client";

import { Card } from "@/components/Card";
import { Tooltip } from "@/components/Tooltip";
import { BookmarkX, CheckCheck, Info, Pin } from "lucide-react";

const topMedicalAlerts = [
  { category: "Message urgent", date: "20-04-2025 21:21", clotured: false },
  { category: "Message urgent", date: "20-04-2025 18:24", clotured: false },
  { category: "Message urgent", date: "20-04-2025 15:50", clotured: true },
  { category: "Message urgent", date: "20-04-2025 12:20", clotured: true },
];

const kpiData = [
  [
    {
      title: "Rendez-vous aujourd’hui",
      value: "24",
      tooltip: "Nombre total de rendez-vous programmés aujourd’hui.",
    },
    {
      title: "Patients en attente",
      value: "11",
      tooltip:
        "Patients actuellement en salle d’attente ou non encore pris en charge.",
    },
    {
      title: "Consultations terminées (7j)",
      value: "74",
      tooltip: "Total des consultations terminées durant les 7 derniers jours.",
    },
  ],
  [
    {
      title: "Nouveaux patients (mois)",
      value: "42",
      tooltip: "Nombre de nouveaux patients enregistrés ce mois-ci.",
    },
    {
      title: "Consultations vidéo effectuées",
      value: "16",
      tooltip: "Nombre total de consultations effectuées via vidéoconférence.",
    },
    {
      title: "Satisfaction patient (CSAT)",
      value: "4.6 / 5",
      tooltip:
        "Score moyen de satisfaction des patients (Customer Satisfaction Score).",
    },
  ],
];
export default function DoctorKPIBlock() {
  return (
    <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-8">
      <Card className="h-full lg:col-span-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900 dark:text-gray-50">
            Statistiques de la semaine
          </p>
          <Tooltip
            content="Ces statistiques représentent les données clés de la semaine."
            showArrow={false}
          >
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <Info width={18} />
            </span>
          </Tooltip>
        </div>
        <dl className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {kpiData.map((column, i) => (
            <div key={i} className="flex flex-col space-y-6">
              {column.map((kpi, index) => (
                <Tooltip key={index} content={kpi.tooltip} showArrow={false}>
                  <div className="flex flex-col justify-start">
                    <dt className="text-start text-sm text-gray-500 dark:text-gray-500">
                      {kpi.title}
                    </dt>
                    <div className="flex items-center gap-4">
                      <dd className="mt-1 text-start text-2xl font-semibold text-gray-900 dark:text-gray-50">
                        {kpi.value}
                      </dd>
                      <div className="flex flex-row items-center gap-0.5">
                        <div className="w-1.5 h-6 bg-blue-500 dark:bg-blue-800 rounded-lg"></div>
                        <div className="w-1.5 h-6 bg-blue-500 dark:bg-blue-800 rounded-lg"></div>
                        <div className="w-1.5 h-6 bg-yellow-200 dark:bg-yellow-600 rounded-lg"></div>
                        <div className="w-1.5 h-6 bg-blue-200/20 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </Tooltip>
              ))}
            </div>
          ))}
        </dl>
      </Card>

      <Card className="h-full lg:col-span-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900 dark:text-gray-50">
            Alertes principales
          </p>
          <Tooltip
            content="Ces alertes représentent les messages urgents nécessitant une attention immédiate."
            showArrow={false}
          >
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <Info width={18} />
            </span>
          </Tooltip>
        </div>
        <ol className="mt-4 divide-y divide-gray-200 dark:divide-gray-800/20">
          {topMedicalAlerts.map((issue, index) => (
            <li
              key={index}
              className={`flex cursor-pointer items-center justify-between px-2 py-2 transition-all duration-300 hover:bg-gray-50 hover:dark:bg-gray-800 ${
                issue.clotured ? "" : ""
              } `}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {issue.category}
                  <p className="text-sm tabular-nums text-gray-600 dark:text-gray-400">
                    {issue.date}
                  </p>
                </span>
              </div>

              {issue.clotured === false ? (
                <>
                  <div className="items-top flex justify-end gap-2">
                    <Tooltip content="Clotuer l'alerte" showArrow={false}>
                      <BookmarkX
                        width={18}
                        className="cursor-pointer text-red-500"
                      />
                    </Tooltip>
                    <Tooltip content="Épingler l'alerte" showArrow={false}>
                      <Pin
                        width={18}
                        className="cursor-pointer text-blue-500"
                      />
                    </Tooltip>
                  </div>
                </>
              ) : (
                <>
                  <Tooltip content="Alerte Cloturée" showArrow={false}>
                    <CheckCheck
                      width={18}
                      className="cursor-pointer text-blue-500"
                    />
                  </Tooltip>
                </>
              )}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
