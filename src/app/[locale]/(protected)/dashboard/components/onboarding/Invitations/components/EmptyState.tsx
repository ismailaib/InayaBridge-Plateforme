import React from "react";
import { UserRoundX } from "lucide-react";
import useTranslations from "@/lib/i18n/useTranslations";

export const EmptyState: React.FC = () => {
  const t = useTranslations("dashboard.invitations");

  return (
    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
      <UserRoundX className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
      <p className="text-sm">{t("emptyState.title")}</p>
      <p className="text-xs mt-1">{t("emptyState.subtitle")}</p>
    </div>
  );
};
