// src/app/appointments/[id]/components/ErrorState.tsx
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/Button';

interface ErrorStateProps {
    error: string;
    onBack: () => void;
}

export const ErrorState = ({ error, onBack }: ErrorStateProps) => (
    <div className="flex items-center justify-center h-screen">
        <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">{error}</p>
            <Button onClick={onBack} variant="secondary">
                Retour
            </Button>
        </div>
    </div>
);