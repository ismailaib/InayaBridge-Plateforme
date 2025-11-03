'use client';

import { Card } from '@/components/Card';
import { cx } from '@/lib/utils';
import { RiArrowRightUpLine } from '@remixicon/react';
import { Sparkles } from 'lucide-react';

const stats = [
    { id: 1, name: 'Total appointments', value: 12, change: '+2 this month', color: 'bg-blue-500' },
    { id: 2, name: 'Last visit', value: '14 Oct 2025', change: '', color: 'bg-green-500' },
    { id: 3, name: 'Active treatments', value: 2, change: '', color: 'bg-violet-500' },
    { id: 4, name: 'Dernier maladie', value: 'Hypertension', change: '', color: 'bg-yellow-500' },
];

export default function Statistics() {
    return (
        <div className="space-y-6">
            {/* --- Summary cards --- */}
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
                            <span className="font-semibold">{item.change}</span> {' '}
                            {item.value}
                        </dd>
                        <span
                            className="pointer-events-none absolute right-2 top-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-600 group-hover:dark:text-gray-500"
                            aria-hidden={true}
                        >
                            <RiArrowRightUpLine className="size-4" aria-hidden={true} />
                        </span>
                    </Card>
                ))}
            </dl>
            <div className="max-w-lg dark:bg-gray-950 p-4 rounded-lg">
                <div className='flex flex-row items-center gap-2 '>
                    <Sparkles width={14}  />
                    <h2 className="bg-gradient-to-r from-gray-400 to-blue-600 bg-clip-text text-transparent animate-gradient-x">Analyse AI</h2>
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
