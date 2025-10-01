import { STATUS_CONFIG } from "@/app/[locale]/(protected)/dashboard/hooks/constants";
import useTranslations from "@/lib/i18n/useTranslations";
import React from "react";

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.DEFAULT;
  const t = useTranslations("dashboard.invitations");

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.bg} ${config.text}`}>
      {t(config.labelKey)}
    </span>
  );
};
