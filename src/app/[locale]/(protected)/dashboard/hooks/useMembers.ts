import { useCallback, useEffect, useState } from 'react';
import { getInvitations } from '@/api/invitations';
import { toast } from '@/lib/useToast';
import { TOAST_MESSAGES } from './constants';
import { Member } from './types';

export const useMembers = (tenantId: string) => {
    const [members, setMembers] = useState<Member[]>([]);

    const fetchMembers = useCallback(async () => {
        if (!tenantId) return;
        try {
            const res = await getInvitations(tenantId);
            setMembers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Error fetching invitations:", err);
            setMembers([]);
            toast({ title: "Erreur", description: TOAST_MESSAGES.FETCH_ERROR, variant: "error", duration: 3000 });
        }
    }, [tenantId]);

    useEffect(() => { fetchMembers(); }, [fetchMembers]);

    return { members, refreshMembers: fetchMembers };
};