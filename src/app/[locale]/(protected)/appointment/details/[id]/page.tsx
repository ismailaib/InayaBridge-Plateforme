'use client';

import { motion } from 'framer-motion';
import { useAppointmentData } from './hooks/useAppointmentData';
import { AppointmentHeader } from './components/AppointmentHeader';
import { PatientCard } from './components/PatientCard';
import { AppointmentInfoCard } from './components/AppointmentInfoCard';
import { MedicalDataSection } from './components/MedicalDataSection';
import { ErrorState } from './components/ErrorState';
import { Section } from '../../types/appointmentFlow'
import { Card } from '@/components/Card';
import LoadingState from '@/components/custom/LoadingState';

export default function AppointmentDetailsPage() {
    const { loading, error, appointment, flowInstance, patient, router } = useAppointmentData();

    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
        alert('Fonctionnalité d\'export en cours de développement');
    };

    const handleShare = () => {
        alert('Fonctionnalité de partage en cours de développement');
    };

    const handleEdit = () => {
        router.push(`/appointments/${appointment?.id}/edit`);
    };

    if (loading) return <LoadingState />;
    if (error || !appointment) return <ErrorState error={error || 'Rendez-vous non trouvé'} onBack={() => router.back()} />;

    const parsedSchema = flowInstance?.schema ? JSON.parse(flowInstance.schema) : null;
    const parsedData = flowInstance?.data ? JSON.parse(flowInstance.data) : {};
    const sections: Section[] = parsedSchema?.sections?.filter(
        (section: Section) => section.title !== 'Start Node'
    ) || [];

    console.log(appointment.startTime, appointment.endTime, flowInstance?.startTime, flowInstance?.endTime)

    let timeStatus = '';
    if (appointment.startTime && flowInstance?.startTime) {
        const actualStart = new Date(flowInstance.startTime);
        const scheduledTimeParts = appointment.startTime.split(':');
        const scheduledStart = new Date(actualStart);
        scheduledStart.setHours(parseInt(scheduledTimeParts[0]), parseInt(scheduledTimeParts[1]), 0, 0);
        const diffMs = actualStart.getTime() - scheduledStart.getTime();
        const absDiffMs = Math.abs(diffMs);
        const minutes = Math.floor(absDiffMs / 60000);
        const seconds = Math.floor((absDiffMs % 60000) / 1000);
        if (diffMs < 0) {
            timeStatus = `Done earlier by ${minutes} min and ${seconds} sec`;
        } else if (diffMs > 0) {
            timeStatus = `Done late by ${minutes} min and ${seconds} sec`;
        } else {
            timeStatus = 'On time';
        }
    }

    return (
        <div className="p-4 md:p-8 print:p-8">
            <AppointmentHeader
                appointment={appointment}
                onBack={() => router.back()}
                onPrint={handlePrint}
                onExport={handleExport}
                onShare={handleShare}
                onEdit={handleEdit}
            />

            <Card className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                {patient && (
                    <div className="lg:col-span-1">
                        <PatientCard patient={patient} />
                    </div>
                )}
                <div className={patient ? 'lg:col-span-2 pl-4 border-l border-1 border-gray-400 dark:border-gray-800' : 'lg:col-span-3'}>
                    <AppointmentInfoCard appointment={appointment} />
                </div>
            </Card>

            <MedicalDataSection
                flowInstance={flowInstance}
                sections={sections}
                parsedData={parsedData}
                timeStatus={timeStatus}
            />
        </div>
    );
}