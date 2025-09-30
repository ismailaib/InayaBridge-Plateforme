import { STATUS_CONFIG } from '@/app/[locale]/(protected)/dashboard/hooks/constants';
import React from 'react';

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.DEFAULT;
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.bg} ${config.text}`}>
            {config.label}
        </span>
    );
};
