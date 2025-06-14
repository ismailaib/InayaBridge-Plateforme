"use client";

import {
  RiCheckLine,
  RiCalendarLine,
  RiMoneyDollarCircleLine,
  RiUserReceivedLine,
} from '@remixicon/react';

import { cx } from '@/lib/utils';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs';
import { FileCheck2 } from 'lucide-react';

const steps = [
  {
    id: 1,
    type: 'done',
    title: 'Consultation générale',
    description: 'Consultation pour maux de tête persistants',
    activityTime: '05/03/2025',
  },
  {
    id: 2,
    type: 'done',
    title: 'Prescription ajoutée',
    description: 'Paracétamol 500mg - 3 fois par jour',
    activityTime: '05/03/2025',
  },
  {
    id: 3,
    type: 'done',
    title: 'Suivi de contrôle',
    description: 'Amélioration signalée par le patient',
    activityTime: '12/03/2025',
  },
  {
    id: 4,
    type: 'in progress',
    title: 'Analyse sanguine en attente',
    description: 'Résultats attendus du laboratoire',
    activityTime: 'En cours',
  },
  {
    id: 5,
    type: 'open',
    title: 'Prochain rendez-vous',
    description: 'Consultation prévue avec le Dr. Leila',
    activityTime: '01/06/2025',
  },
];

const financialDetails = [
  {
    label: 'Total payé',
    value: '1 200 DH',
    icon: <RiMoneyDollarCircleLine className="size-5 text-green-500" />,
  },
  {
    label: 'Consultations payées',
    value: '8',
    icon: <RiUserReceivedLine className="size-5 text-blue-500" />,
  },
  {
    label: 'Dernier paiement',
    value: '20/05/2025',
    icon: <RiCalendarLine className="size-5 text-gray-500" />,
  },
  {
    label: 'Moyenne par rendez-vous',
    value: '150 DH',
    icon: <RiMoneyDollarCircleLine className="size-5 text-yellow-500" />,
  },
];

export default function PatientHistorySidebar() {
  return (
    <div className="w-full">
      <Card className="overflow-hidden p-0">
        <div className="flex flex-col space-y-4 border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-900 dark:bg-[#090E1A]">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-50">
              Historique du patient
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Détails des consultations et paiements récents.
            </p>
          </div>
        </div>
        <Tabs defaultValue="history" className="p-6">
          <TabsList className="w-full" variant="solid">
            <TabsTrigger value="history" className="w-full">
              Historique
            </TabsTrigger>
            <TabsTrigger value="details" className="w-full">
              Financier
            </TabsTrigger>
          </TabsList>

          {/* Timeline (History) Tab */}
          <TabsContent value="history">
            <ul role="list" className="mt-6 space-y-6">
              {steps.map((step, stepIndex) => (
                <li key={step.id} className="relative flex gap-x-3">
                  <div
                    className={cx(
                      stepIndex === steps.length - 1 ? 'h-6' : '-bottom-6',
                      'absolute left-0 top-0 flex w-6 justify-center',
                    )}
                  >
                    <span
                      className="w-px bg-gray-200 dark:bg-gray-700"
                      aria-hidden={true}
                    />
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <div className="relative flex size-6 flex-none items-center justify-center bg-white dark:bg-[#090E1A]">
                      {step.type === 'done' ? (
                        <RiCheckLine
                          className="size-5 text-emerald-500"
                          aria-hidden={true}
                        />
                      ) : step.type === 'in progress' ? (
                        <div className="size-2.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-[#090E1A]" />
                      ) : (
                        <div className="size-3 rounded-full border border-gray-200 bg-white ring-4 ring-white dark:border-gray-800 dark:bg-[#090E1A] dark:ring-[#090E1A]" />
                      )}
                    </div>
                    <div>
                      <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-gray-50">
                        {step.title}{' '}
                        <span className="font-normal text-gray-400 dark:text-gray-600">
                          &#8729; {step.activityTime}
                        </span>
                      </p>
                      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6 h-10 w-full" variant="secondary">
              <a href="#">
                <FileCheck2 className="mr-2 size-5" />
                Génerer Un Rapport
              </a>
            </Button>
          </TabsContent>

          {/* Financial Details Tab */}
          <TabsContent value="details">
            <h4 className="mt-6 text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-600">
              Paiements & Statistiques
            </h4>
            <ul className="mt-3 divide-y divide-gray-200 rounded-md bg-gray-50 text-sm text-gray-500 dark:divide-gray-700 dark:bg-gray-800 dark:text-gray-400">
              {financialDetails.map((item) => (
                <li key={item.label} className="flex h-14 items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-50">{item.value}</span>
                </li>
              ))}
            </ul>
            <Button asChild variant="secondary" className="mt-4 h-10 w-full">
              <a href="#">
                Gérer les paiements
              </a>
            </Button>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
