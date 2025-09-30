import React from 'react';
import { UserRoundX } from 'lucide-react';

export const EmptyState: React.FC = () => (
    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <UserRoundX className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
        <p className="text-sm">Aucun membre dans cet établissement</p>
        <p className="text-xs mt-1">Commencez par inviter vos collègues !</p>
    </div>
);