'use client';

import { TenantPatient } from '@/api/patients';
import { Card } from '@/components/Card';
import { cx } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

const stats = [
    { id: 1, name: 'Total appointments', value: 12, color: 'bg-blue-500' },
    { id: 2, name: 'Last visit', value: '14 Oct 2025', color: 'bg-green-500' },
    { id: 3, name: 'Active treatments', value: 2, color: 'bg-violet-500' },
    { id: 4, name: 'Dernier maladie', value: 'Hypertension', color: 'bg-yellow-500' },
];

export default function Statistics({ patient }: { patient: TenantPatient }) {
    return (
        <div className="space-y-6">
            <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {stats.map((item,) => (
                    <Card key={item.id} className="group rounded-md px-3 py-2">
                        <div className="flex items-center space-x-2">
                            <span
                                className={cx(item.color, 'size-2.5 rounded-sm')}
                                aria-hidden={true}
                            />
                            <dt className="text-sm text-gray-500 dark:text-gray-500">
                                <a href={"#"} className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden={true} />
                                    {item.name}
                                </a>
                            </dt>
                        </div>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-50">
                            {item.value}
                        </dd>
                    </Card>
                ))}
            </dl>
            <div className="w-full dark:bg-gray-950 p-4 rounded-lg">
                <div className='flex flex-row items-center gap-2 '>
                    <Sparkles width={14}  />
                    <h2>Résumée</h2>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Notre moteur d&apos;intelligence artificielle analyse les données en temps réel pour fournir des insights prédictifs, identifiant les risques potentiels et suggérant des interventions proactives pour améliorer les résultats pour les patients.
                </p>
            </div>
            <div className="sm:mx-auto sm:max-w-2xl">
            </div>
        </div>
    );
}
