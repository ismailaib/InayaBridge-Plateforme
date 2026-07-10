import { Activity, Calendar, CircleDollarSign, Clock, MapPin, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/Card';
import { CopyableRow } from '../../../components/CopyableRow';
import { format } from "date-fns";
import { getConsultationTypeLabel, getStatusLabel } from '../utils/appointmentUtils';
import { Appointment } from '@/api/appointments';
import { Badge } from '@/components/Badge';

interface AppointmentInfoCardProps {
    appointment: Appointment;
}

export const AppointmentInfoCard = ({ appointment }: AppointmentInfoCardProps) => {
    const appointmentDate = new Date(appointment.date);
    const duration = `${appointment.startTime} ${appointment.endTime ? "- " + appointment.endTime : ""}`;

    return (
        <div>
            <div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                            Informations de consultation
                        </h4>
                    </div>
                    <p className=" flex flex-row items-center text-sm text-gray-600 dark:text-gray-400">
                        <Badge variant="neutral">
                            {getStatusLabel(appointment.status)}
                        </Badge>
                        {appointment.isUrgent && (
                            <>
                                <span className="mx-2">•</span>
                                <Badge variant='error' className='flex flex-row gap-2 w-fit'>
                                    <ShieldAlert width={18}/>
                                    Urgent
                                </Badge>
                            </>
                        )}
                    </p>
                </div>

                <div className="w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-900 mt-2">
                    <table className="w-full table-auto">
                        <tbody>
                            <CopyableRow icon={<Calendar width={18} />} label="Date" value={format(appointmentDate, "dd/MM/yyyy")} />
                            <CopyableRow icon={<Clock width={18} />} label="Horaire Planifié" value={duration} />
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
        </div>
    );
};