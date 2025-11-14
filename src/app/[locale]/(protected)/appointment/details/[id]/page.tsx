// src/app/appointments/[id]/page.tsx
'use client';

import { motion } from 'framer-motion';
import { useAppointmentData } from './hooks/useAppointmentData';
import { AppointmentHeader } from './components/AppointmentHeader';
import { PatientCard } from './components/PatientCard';
import { AppointmentInfoCard } from './components/AppointmentInfoCard';
import { MedicalDataSection } from './components/MedicalDataSection';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState'; // Keep this import
import { Section } from '../../types/appointmentFlow'; // Corrected import path

export default function AppointmentDetailsPage() {
    const { loading, error, appointment, flowInstance, patient, router } = useAppointmentData();

    // Action handlers
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

    const handleDelete = () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
            alert('Fonctionnalité de suppression en cours de développement');
        }
    };

    if (loading) return <LoadingState />;
    if (error || !appointment) return <ErrorState error={error || 'Rendez-vous non trouvé'} onBack={() => router.back()} />;

    const parsedSchema = flowInstance?.schema ? JSON.parse(flowInstance.schema) : null;
    const parsedData = flowInstance?.data ? JSON.parse(flowInstance.data) : {};
    const sections: Section[] = parsedSchema?.sections?.filter(
        (section: Section) => section.title !== 'Start Node'
    ) || [];

    return (
        <div className="p-4 md:p-8 print:p-8">
            <AppointmentHeader
                appointment={appointment}
                onBack={() => router.back()}
                onPrint={handlePrint}
                onExport={handleExport}
                onShare={handleShare}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {patient && (
                    <div className="lg:col-span-1">
                        <PatientCard patient={patient} />
                    </div>
                )}
                <div className={patient ? 'lg:col-span-2' : 'lg:col-span-3'}>
                    <AppointmentInfoCard appointment={appointment} />
                </div>
            </div>

            <MedicalDataSection
                flowInstance={flowInstance}
                sections={sections}
                parsedData={parsedData}
            />
        </div>
    );
}