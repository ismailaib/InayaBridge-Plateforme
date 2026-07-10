"use client";

import { Button } from "@/components/Button";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { HardDriveDownload } from "lucide-react";


import Filter from "./components/Filter";

const Page = () => {
  const t = useTranslations("appointments.history");

  const handleGenerateReport = () => {
    const rows = [
      ["Patient", "Médecin", "Date", "Statut", "Type"],
      ["—", "—", "—", "—", "—"], 
    ];

    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "rapport_rendez_vous.csv";
    link.click();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="mb-4 flex flex-col items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {t("title")}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("subtitle")}
          </p>
        </div>
        <Button
          className="flex flex-row gap-2"
          onClick={handleGenerateReport}
        >          <HardDriveDownload width={18} />
          {t("generateReport")}
        </Button>
      </div>
      <Filter />
    </div>
  );
};

export default Page;
