import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/Accordion';
import { StatusBadge } from '@/components/custom/StatusBadge';
import React from 'react';
import { Member } from '../../../../hooks/types';
import { EmptyState } from './EmptyState';
import { MemberDetails } from './MemberDetails';
import { MemberActions } from './MemberActions';

export const MembersList: React.FC<{ members: Member[], tenantId: string, onSuccess: () => void; }> = ({ members: initialMembers, tenantId }) => {
    const [members, setMembers] = React.useState(initialMembers);

    if (!members.length) return <EmptyState />;

    const handleRemoveMember = (id: string) => {
        setMembers(prev => prev.filter(m => m.id !== id));
    };

     const handleRecentInvitation = () => {
        return;
    };

    return (
        <Accordion type="multiple" className="mt-3">
            {members.map((member) => (
                <AccordionItem key={member.id} value={member.id}>
                    <AccordionTrigger className="py-5">
                        <div className="flex w-full items-center justify-between pr-4">
                            <div className="flex items-center gap-2.5">
                                <span>{member.email}</span>
                                <StatusBadge status={member.status} />
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <MemberDetails member={member} />
                        <MemberActions
                            member={member}
                            tenantId={tenantId}
                            onDelete={handleRemoveMember}
                            onRecentInvitation={handleRecentInvitation}
                        />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};
