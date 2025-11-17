// src/app/appointments/[id]/utils/appointmentUtils.ts
import { formatDate as formatDateLib} from 'date-fns'; // Assuming you use date-fns for better date handling; install if needed.

export const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return formatDateLib(date, 'dd MMMM yyyy'); // Use date-fns with French locale
};

export const formatTime = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return formatDateLib(date, 'HH:mm');
};

export const calculateDuration = (start: string | undefined, end: string | undefined): string => {
    if (!start || !end) return 'N/A';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return `${diffMins} min`;
};

export const calculateAge = (dateOfBirth: string | undefined): number | null => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
        COMPLETED: 'Terminé',
        IN_PROGRESS: 'En cours',
        PENDING: 'En attente',
        CANCELLED: 'Annulé',
        CONFIRMED: 'Confirmé',
        ARRIVED: 'Arrivé',
    };
    return labels[status] || status;
};

export const getConsultationTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
        LOCAL: 'Sur place',
        IN_PERSON: 'En personne',
        VIDEO: 'Vidéo',
    };
    return labels[type] || type;
};