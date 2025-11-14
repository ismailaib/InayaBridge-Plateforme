import { Activity, Calendar, CircleDollarSign, Clock, MapPin } from 'lucide-react';
import { Card } from '@/components/Card';
import { CopyableRow } from '../../../components/CopyableRow';
import { cx } from '@/lib/utils';
import { format } from "date-fns";
import { getConsultationTypeLabel, getStatusColor, getStatusLabel } from '../utils/appointmentUtils';
import { Appointment } from '@/api/appointments';

interface AppointmentInfoCardProps {
    appointment: Appointment;
}

export const AppointmentInfoCard = ({ appointment }: AppointmentInfoCardProps) => {
    const appointmentDate = new Date(appointment.date);
    const duration = `${appointment.startTime} - ${appointment.endTime}`;

    return (
        <Card>
            <div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                            Informations de consultation
                        </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <span
                            className={cx(
                                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                `bg-${getStatusColor(appointment.status)}-100 text-${getStatusColor(appointment.status)}-800 dark:bg-${getStatusColor(appointment.status)}-900 dark:text-${getStatusColor(appointment.status)}-300`
                            )}
                        >
                            {getStatusLabel(appointment.status)}
                        </span>
                        {appointment.isUrgent && (
                            <>
                                <span className="mx-2">•</span>
                                <span
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                >
                                    Urgent
                                </span>
                            </>
                        )}
                        {appointment.motif && (
                            <>
                                <span className="mx-2">•</span>
                                <span>{appointment.motif}</span>
                            </>
                        )}
                    </p>
                </div>

                <div className="w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-900 mt-2">
                    <table className="w-full table-auto">
                        <tbody>
                            <CopyableRow icon={<Calendar width={18} />} label="Date" value={format(appointmentDate, "dd/MM/yyyy")} />
                            <CopyableRow icon={<Clock width={18} />} label="Horaire" value={duration} />
                            {appointment.location && (
                                <CopyableRow icon={<MapPin width={18} />} label="Lieu" value={`${appointment.location} (${getConsultationTypeLabel(appointment.consultationType)})`} />
                            )}
                            {appointment.price && (
                                <CopyableRow icon={<CircleDollarSign width={18} />} label="Prix" value={`${appointment.price} DH`} />
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    );
};