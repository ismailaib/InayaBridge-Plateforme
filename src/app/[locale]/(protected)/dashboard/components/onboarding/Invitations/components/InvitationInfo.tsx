import React from 'react';
import { Mail } from 'lucide-react';

export const InvitationInfo: React.FC = () => (
    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
        <div className="flex items-start space-x-2">
            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Invitation par e-mail</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Les personnes invitées recevront un e-mail avec un lien pour rejoindre votre établissement.
                </p>
            </div>
        </div>
    </div>
);