import React from 'react';
import { Member } from '../../../../hooks/types';
import { formatDate } from '../../../../hooks/utils';

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{label}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">{value}</p>
    </div>
);

export const MemberDetails: React.FC<{ member: Member }> = ({ member }) => (
    <div className="space-y-2">
        <DetailRow label="Date Envoi" value={formatDate(member.sentAt)} />
        {member.expiresAt && <DetailRow label="Date Expiration" value={formatDate(member.expiresAt)} />}
        {member.acceptedAt && <DetailRow label="Date Acceptation" value={formatDate(member.acceptedAt)} />}
    </div>
);