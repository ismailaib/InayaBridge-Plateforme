// src/app/appointments/[id]/components/AppointmentHeader.tsx
import { Appointment } from '@/api/appointments';
import { Button } from '@/components/Button';
import { Download, Edit, Printer, Share2, Trash2 } from 'lucide-react';

interface AppointmentHeaderProps {
    appointment: Appointment;
    onBack: () => void;
    onPrint: () => void;
    onExport: () => void;
    onShare: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export const AppointmentHeader = ({
    appointment,
    onBack,
    onPrint,
    onExport,
    onShare,
    onEdit,
    onDelete,
}: AppointmentHeaderProps) => {
    return (
        <div className="mb-6">
            {/* <Button
                variant="light"
                onClick={onBack}
                className="mb-4 flex items-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour
            </Button> */}

            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex flex-col items-start">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                        Détails du rendez-vous
                    </h2>
                    <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>Cette page represente les details du rendez-vous</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={onPrint}>
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimer
                    </Button>
                    <Button variant="secondary" onClick={onExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Exporter
                    </Button>
                    <Button variant="secondary" onClick={onShare}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Partager
                    </Button>
                    <Button variant="primary" onClick={onEdit}>
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                    </Button>
                    <Button variant="destructive" onClick={onDelete}>
                        <Trash2 width={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
};