import { getInvitations } from "@/api/invitations";
import useTranslations from "@/lib/i18n/useTranslations";
import { toast } from "@/lib/useToast";

import { useCallback, useEffect, useState } from "react";

import { Member } from "./types";

export const useMembers = (tenantId: string) => {
  const [members, setMembers] = useState<Member[]>([]);
  const t = useTranslations("dashboard.invitations");

  const fetchMembers = useCallback(async () => {
    if (!tenantId) return;
    try {
      const res = await getInvitations(tenantId);
      setMembers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching invitations:", err);
      setMembers([]);
      toast({
        title: t("toasts.errorTitle"),
        description: t("toasts.fetchError"),
        variant: "error",
        duration: 3000,
      });
    }
  }, [tenantId, t]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, refreshMembers: fetchMembers };
};
