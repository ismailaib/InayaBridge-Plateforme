// 'use client';

import { AreaChart } from "@/components/AreaChart"
import { Card } from "@/components/Card"
import { CategoryBar } from "@/components/CategoryBar"

// used custom gray in installChartUtils.ts for <CategoryBar />

// lightGray: {
//   bg: 'bg-gray-300 dark:bg-gray-700',
//   stroke: 'stroke-gray-300 dark:stroke-gray-700',
//   fill: 'fill-gray-300 dark:fill-gray-700',
//   text: 'text-gray-300 dark:text-gray-700',
// },

const data = [
  {
    date: "19-09-2025",
    "Rendez-vous": 0,
    "diagnostics": 0,
  },
  {
    date: "20-09-2025",
    "Rendez-vous": 16,
    "diagnostics": 5,
  },
  {
    date: "21-09-2025",
    "Rendez-vous": 24,
    "diagnostics": 8,
  },
  {
    date: "22-09-2025",
    "Rendez-vous": 28,
    "diagnostics": 10,
  },
  {
    date: "23-09-2025",
    "Rendez-vous": 31,
    "diagnostics": 12,
  },
  {
    date: "24-09-2025",
    "Rendez-vous": 32,
    "diagnostics": 13,
  },
  {
    date: "25-09-2025",
    "Rendez-vous": 35,
    "diagnostics": 15,
  },
  {
    date: "26-09-2025",
    "Rendez-vous": 65,
    "diagnostics": 24,
  },
  {
    date: "27-09-2025",
    "Rendez-vous": 58,
    "diagnostics": 22,
  },
  {
    date: "28-09-2025",
    "Rendez-vous": 60,
    "diagnostics": 24,
  },
  {
    date: "29-09-2025",
    "Rendez-vous": 65,
    "diagnostics": 25,
  },
]

export default function Example() {
  return (
    <>
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mt-6">
        Statistiques de performance
      </h1>
      <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">
        Suivi des rendez-vous, consultations et temps de prise en charge.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* RDV honorés */}
        <Card className="mt-6 overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-900 dark:bg-gray-900">
            <h1 className="text-sm font-medium text-gray-900 dark:text-gray-50">
              Respect des rendez-vous
            </h1>
          </div>
          <div className="p-4">
            <p className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
              92.4%
            </p>
            <p className="text-sm/6 text-gray-500 dark:text-gray-500">
              Taux de présence des patients ce mois
            </p>
            <CategoryBar
              values={[92.4, 7.6]}
              colors={["emerald", "amber"]}
              showLabels={false}
              className="mt-6"
            />
            <ul className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex justify-between">
                <span>Rendez-vous honorés</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  92.4% (145)
                </span>
              </li>
              <li className="flex justify-between">
                <span>Rendez-vous manqués</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  7.6% (12)
                </span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Temps de prise en charge */}
        <Card className="mt-6 overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-900 dark:bg-gray-900">
            <h1 className="text-sm font-medium text-gray-900 dark:text-gray-50">
              Temps moyen de consultation
            </h1>
          </div>
          <div className="p-4">
            <p className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
              17min 30s
            </p>
            <p className="text-sm/6 text-gray-500 dark:text-gray-500">
              Moyenne sur les 30 derniers jours
            </p>
            <CategoryBar
              values={[85.2, 14.8]}
              colors={["blue", "gray"]}
              showLabels={false}
              className="mt-6"
            />
            <ul className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex justify-between">
                <span>Consultations {"<"} 20 min</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  85.2%
                </span>
              </li>
              <li className="flex justify-between">
                <span>Consultations {">"} 20 min</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  14.8%
                </span>
              </li>
            </ul>
          </div>
        </Card>
      </div>

      {/* Évolution du nombre de consultations */}
      <Card className="mt-6 overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-900 dark:bg-gray-900">
          <h1 className="text-sm font-medium text-gray-900 dark:text-gray-50">
            Évolution des consultations
          </h1>
        </div>
        <div className="p-4">
          <AreaChart
            data={data}
            index="date"
            categories={["Rendez-vous", "diagnostics"]}
            colors={["emerald", "blue"]}
            fill="solid"
            valueFormatter={(v) => `${v}`}
            onValueChange={() => {}}
            tickGap={15}
            className="hidden sm:block"
          />
          <AreaChart
            data={data}
            index="date"
            categories={["Rendez-vous", "diagnostics"]}
            colors={["emerald", "blue"]}
            fill="solid"
            valueFormatter={(v) => `${v}`}
            onValueChange={() => {}}
            showYAxis={false}
            startEndOnly={true}
            tickGap={15}
            className="sm:hidden"
          />
        </div>
      </Card>
    </>
  )
}
