"use client"

import { DateRangePicker } from '@/components/DatePicker';
import { Label } from '@/components/Label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/Select';
import Table from './Table';
import { Input } from '@/components/Input';

export default function Example() {
    return (
        <>
            <div className="relative">
                <div className="rounded-lg border border-gray-200 bg-white pb-20 dark:border-gray-800 dark:bg-gray-950 h-full">
                    <div className="grid grid-cols-1 gap-4 border-b border-gray-200 p-6 dark:border-gray-800 sm:grid-cols-2 md:grid-cols-4">
                        <div className="w-full">
                            <Label htmlFor="dob_filter" className="font-medium">
                                Filtrer
                            </Label>
                           <Input placeholder='Filtrer par Nom, Prenom, Tel ..' className="mt-2"/>
                        </div>

                        <div className="w-full">
                            <Label htmlFor="dob_filter" className="font-medium">
                                Date de naissance
                            </Label>
                            <DateRangePicker
                                id="dob_filter"
                                defaultValue={{
                                    from: new Date(new Date().setFullYear(new Date().getFullYear() - 50)),
                                    to: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
                                }}
                                className="mt-2"
                            />
                        </div>

                        <div className="w-full">
                            <Label htmlFor="gender_filter" className="font-medium">
                                Sexe
                            </Label>
                            <Select defaultValue="all">
                                <SelectTrigger id="gender_filter" name="gender_filter" className="mt-2 sm:w-full">
                                    <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        { value: 'all', label: 'Tous' },
                                        { value: 'Homme', label: 'Homme' },
                                        { value: 'Femme', label: 'Femme' },
                                    ].map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full">
                            <Label htmlFor="sort_filter" className="font-medium">
                                Dernière visite
                            </Label>
                            <Select defaultValue="desc">
                                <SelectTrigger id="sort_filter" name="sort_filter" className="mt-2 sm:w-full">
                                    <SelectValue placeholder="Trier" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        { value: 'desc', label: 'Plus récente' },
                                        { value: 'asc', label: 'Plus ancienne' },
                                    ].map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>



                    <Table />
                </div>

            </div>
        </>
    );
}