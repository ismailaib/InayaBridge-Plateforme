'use client';

import { Card } from '@/components/Card';

const topMedicalAlerts = [
  {
    category: 'Message urgent',
    date: "20-04-2025 21:21",
  },
  {
    category: 'Message urgent',
    date: "20-04-2025 18:24",
  },
  {
    category: 'Message urgent',
    date: "20-04-2025 15:50",
  },
  {
    category: ' Message urgent',
    date: "20-04-2025 12:20",
  },
  {
    category: 'Message urgent',
    date: "20-04-2025 11:01",
  },
  {
    category: 'Message urgent',
    date: "20-04-2025 05:19",
  },
];

export default function DoctorKPIBlock() {
  return (
    <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-8">
      <Card className="lg:col-span-5">
        <p className="font-semibold text-gray-900 dark:text-gray-50">
          Statistiques de la semaine
        </p>
        <dl className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-6">
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-500">
                Rendez-vous aujourd’hui
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-50">
                24
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-500">
                Patients en attente
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-50">
                11
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-500">
                Consultations terminées (7j)
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-50">
                74
              </dd>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-500">
                Durée moyenne des consultations
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-50">
                18 min
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-500">
                Nouveaux patients (mois)
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-50">
                42
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-500">
                Taux de rétention patient
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-50">
                91.2%
              </dd>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-500">
                Consultations vidéo effectuées
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-50">
                16
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-500">
                Taux de non-présentation
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-50">
                7.4%
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-500">
                Satisfaction patient (CSAT)
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-50">
                4.6 / 5
              </dd>
            </div>
          </div>
        </dl>
      </Card>

      <Card className="lg:col-span-3">
        <p className="font-semibold text-gray-900 dark:text-gray-50">
          Alertes principales
        </p>
        <ol className="mt-4 divide-y divide-gray-200 dark:divide-gray-800">
          {topMedicalAlerts.map((issue) => (
            <li
              key={issue.category}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {issue.category}
                </span>
              </div>
              <div className="text-sm tabular-nums text-gray-600 dark:text-gray-400">
                {issue.date}
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
