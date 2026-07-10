// src/app/appointments/[id]/hooks/useAppointmentData.ts
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAppointmentById, Appointment } from '@/api/appointments';
import { getFlowInstanceByAppointment, FlowInstanceDto } from '@/api/flow';
import { getPatientById, TenantPatient } from '@/api/patients';

export const useAppointmentData = () => {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [flowInstance, setFlowInstance] = useState<FlowInstanceDto | null>(null);
    const [patient, setPatient] = useState<TenantPatient | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError('ID de rendez-vous manquant');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const appointmentRes = await getAppointmentById(id as string);
                const appointmentData = appointmentRes.data;
                setAppointment(appointmentData);

                try {
                    const patientRes = await getPatientById(appointmentData.patientProfileId);
                    setPatient(patientRes.data);
                } catch (patientError) {
                    console.error('Error fetching patient:', patientError);
                }

                try {
                    const flowInstanceRes = await getFlowInstanceByAppointment(id as string);
                    setFlowInstance(flowInstanceRes.data);
                } catch (flowError) {
                    console.error('Error fetching flow instance:', flowError);
                }
            } catch (err) {
                console.error('Error fetching appointment details:', err);
                setError('Erreur lors du chargement des détails du rendez-vous');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return {
        loading,
        error,
        appointment,
        flowInstance,
        patient,
        router,
    };
};