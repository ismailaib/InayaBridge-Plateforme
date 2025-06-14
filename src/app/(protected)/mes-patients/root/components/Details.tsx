"use client"

import { Card } from "@/components/Card"
import React from "react"
import {
    User,
    Calendar,
    CreditCard,
    Users,
    Droplet,
    Phone,
    Mail,
    MapPin,
    UserCheck,
} from "lucide-react"

// Tremor-style components
interface InfoItemProps {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    value: React.ReactNode;
    valueColor?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value, valueColor = "text-gray-900 dark:text-white" }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
        <div className="flex-shrink-0 mt-0.5">
            <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                {label}
            </p>
            <p className={`text-sm font-medium ${valueColor} break-words`}>
                {value}
            </p>
        </div>
    </div>
)


interface SectionHeaderProps {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    badge?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title, badge }) => (
    <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-semibold text-base text-gray-900 dark:text-white">
                {title}
            </h4>
        </div>
        {badge && badge}
    </div>
)

const Details: React.FC = () => {
    return (
        <div className="flex flex-col gap-6 h-full overflow-auto pr-2">
            {/* Patient Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-indigo-50 dark:from-emerald-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-emerald-100 dark:border-emerald-800/50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-600 dark:bg-emerald-500 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Zakaria Bennani
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Dossier Patient • CIN: AB123456
                        </p>
                    </div>
                </div>
            </div>

            {/* Informations Générales */}
            <Card>
                <SectionHeader
                    icon={User}
                    title="Informations Générales"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem
                        icon={User}
                        label="Nom complet"
                        value="Zakaria Bennani"
                    />
                    <InfoItem
                        icon={Calendar}
                        label="Date de naissance"
                        value="12 juin 1991 (33 ans)"
                    />
                    <InfoItem
                        icon={CreditCard}
                        label="CIN"
                        value="AB123456"
                    />
                    <InfoItem
                        icon={Users}
                        label="Sexe"
                        value="Homme"
                    />
                    <div className="md:col-span-2">
                        <InfoItem
                            icon={Droplet}
                            label="Groupe sanguin"
                            value={
                                <div className="flex items-center gap-2">
                                    <span>O+</span>
                                </div>
                            }
                        />
                    </div>
                </div>
            </Card>

            {/* Coordonnées */}
            <Card>
                <SectionHeader
                    icon={Phone}
                    title="Coordonnées" badge={undefined} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem
                        icon={Phone}
                        label="Téléphone"
                        value="+212 612-345678"
                    />
                    <InfoItem
                        icon={Mail}
                        label="Email"
                        value="zakaria.bennani@example.com"
                        valueColor="text-emerald-600 dark:text-emerald-400"
                    />
                    <div className="md:col-span-2">
                        <InfoItem
                            icon={MapPin}
                            label="Adresse"
                            value="24 Avenue Hassan II, Rabat"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <InfoItem
                            icon={UserCheck}
                            label="Contact d'urgence"
                            value="Fatima Bennani – +212 611-223344"
                        />
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default Details