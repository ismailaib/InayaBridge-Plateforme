import { useTranslationsContext } from "@/lib/i18n/TranslationsProvider";
import useTranslations from "@/lib/i18n/useTranslations";

import React from "react";

import { Member } from "../../../../hooks/types";
import { formatDate } from "../../../../hooks/utils";

const DetailRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
      {label}
    </p>
    <p className="text-sm text-gray-700 dark:text-gray-300">{value}</p>
  </div>
);

export const MemberDetails: React.FC<{ member: Member }> = ({ member }) => {
  const t = useTranslations("dashboard.invitations");
  const { locale } = useTranslationsContext();
  const fallback = t("details.invalidDate");

  return (
    <div className="space-y-2">
      <DetailRow
        label={t("details.sentAt")}
        value={formatDate(member.sentAt, locale, fallback)}
      />
      {member.expiresAt && (
        <DetailRow
          label={t("details.expiresAt")}
          value={formatDate(member.expiresAt, locale, fallback)}
        />
      )}
      {member.acceptedAt && (
        <DetailRow
          label={t("details.acceptedAt")}
          value={formatDate(member.acceptedAt, locale, fallback)}
        />
      )}
    </div>
  );
};
