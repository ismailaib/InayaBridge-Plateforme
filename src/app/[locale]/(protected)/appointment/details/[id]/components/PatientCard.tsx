import { User, Mail, CreditCard, Phone, MapPin } from 'lucide-react';
import { Card } from '@/components/Card';
import { TenantPatient } from '@/api/patients';
import { CopyableRow } from '../../../components/CopyableRow';
import { getGenderLabel, getValidDate } from '../../../components/helpers/details';
import { cx } from '@/lib/utils';
import { format } from "date-fns"

interface PatientCardProps {
    patient: TenantPatient;
}

export const PatientCard = ({ patient }: PatientCardProps) => {
    const patientFullName = `${patient.firstName} ${patient.lastName}`.trim()
    const patientBirthDate = getValidDate(patient.dateOfBirth)

    return (
        <div>
            <div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{patientFullName}</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <span
                            className={cx(
                                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                getGenderLabel(patient.gender) === "Homme"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                    : "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
                            )}
                        >
                            {getGenderLabel(patient.gender)}
                        </span>
                        {patientBirthDate && (
                            <>
                                <span className="mx-2">•</span>
                                <span>
                                    {format(patientBirthDate, "dd/MM/yyyy")} ({new Date().getFullYear() - patientBirthDate.getFullYear()} ans)
                                </span>
                            </>
                        )}
                    </p>
                </div>

                <div className="w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-900 mt-2">
                    <table className="w-full table-auto">
                        <tbody>
                            {patient.cin && <CopyableRow icon={<CreditCard width={18} />} label="CIN" value={patient.cin} />}
                            {patient.phone && <CopyableRow icon={<Phone width={18} />} label="Téléphone" value={patient.phone} />}
                            {patient.email && <CopyableRow icon={<Mail width={18} />} label="Email" value={patient.email} />}
                            {patient.address && <CopyableRow icon={<MapPin width={18} />} label="Adresse" value={patient.address} />}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};