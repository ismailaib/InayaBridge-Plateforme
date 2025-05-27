import {
    RiAppleFill,
    RiGoogleFill,
    RiMapPinLine,
    RiMastercardLine,
    RiPhoneLine,
    RiVideoLine,
    RiVisaFill,
} from '@remixicon/react';

import { cx } from '@/lib/utils';

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

const countries = [
    { value: 'all', label: 'Tous les types', icon: null },
    { value: 'video', label: 'Visioconférence', icon: RiVideoLine },
    { value: 'phone', label: 'Téléphone', icon: RiPhoneLine },
    { value: 'physical', label: 'Présentiel', icon: RiMapPinLine }
];;

const status = [
    {
        value: 'all',
        label: 'All',
        disabled: false,
    },
    {
        value: 'completed',
        label: 'Terminé',
        color: 'bg-emerald-600 dark:bg-emerald-500',
    },
    {
        value: 'processing',
        label: 'Confirmé',
        color: 'bg-gray-400 dark:bg-orange-600',
    },
    {
        value: 'failed',
        label: 'Annulé',
        color: 'bg-red-500 dark:bg-red-500',
    },
    {
        value: 'refund-requested',
        label: 'Absent',
        color: 'bg-violet-500 dark:bg-violet-500',
    },
];

const payment = [
    {
        value: 'all',
        label: 'All',
        disabled: false,
    },
    {
        value: 'payed',
        label: 'Payées',
        disabled: false,
        icon: RiVisaFill,
    },
    {
        value: 'not_payed',
        label: 'Non payée',
        disabled: false,
        icon: RiMastercardLine,
    }
];

export default function Example() {
    return (
        <>
            <div className="relative">
                <div className="rounded-lg border border-gray-200 bg-white pb-20 dark:border-gray-800 dark:bg-gray-950 h-full">
                    <div className="grid grid-cols-1 gap-4 border-b border-gray-200 p-6 dark:border-gray-800 sm:grid-cols-2 md:grid-cols-4">
                        <div className="w-full">
                            <Label htmlFor="date_1" className="font-medium">
                                Date
                            </Label>
                            <DateRangePicker
                                id="date_1"
                                defaultValue={{
                                    from: new Date(new Date().setDate(new Date().getDate() - 10)),
                                    to: new Date(),
                                }}
                                className="mt-2"
                            />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="country_1" className="font-medium">
                                Country
                            </Label>
                            <Select defaultValue="all">
                                <SelectTrigger
                                    id="country_1"
                                    name="country_1"
                                    className="mt-2 sm:w-full"
                                >
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full">
                            <Label htmlFor="status_1" className="font-medium">
                                Status
                            </Label>
                            <Select defaultValue="all">
                                <SelectTrigger
                                    id="status_1"
                                    name="status_1"
                                    className="mt-2 sm:w-full"
                                >
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {status.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            <div className="flex items-center gap-x-2.5">
                                                <span
                                                    className={cx(
                                                        item.color,
                                                        'inline-block size-2 shrink-0 rounded-full',
                                                    )}
                                                    aria-hidden={true}
                                                />
                                                {item.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full">
                            <Label htmlFor="payment_method" className="font-medium">
                                Payment Status
                            </Label>
                            <Select defaultValue="all">
                                <SelectTrigger
                                    id="payment_method"
                                    name="payment_method"
                                    className="mt-2 sm:w-full"
                                >
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {payment.map((item) => (
                                        <SelectItem
                                            key={item.value}
                                            value={item.value}
                                            disabled={item.disabled}
                                        >
                                            <div className="flex items-center gap-x-2">
                                                {item.label}
                                            </div>
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