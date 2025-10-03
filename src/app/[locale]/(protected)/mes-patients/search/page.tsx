"use client";

import { Button } from "@/components/Button";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { saveAs } from "file-saver";
import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";

import { useEffect, useState } from "react";

import { Patient, getDoctorPatients } from "../api/patients";
import Add from "./components/Add";
import Filter from "./components/Filter";

export default function PatientsPage() {
  const t = useTranslations("patients.patients");

  const [patients, setPatients] = useState<Patient[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ─── refetch à chaque ajout ─── */
  useEffect(() => {
    setLoading(true);
    getDoctorPatients()
      .then((res) => setPatients(res.data))
      .catch((err) => console.error("Failed to fetch patients", err))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  /* ─── export Excel ─── */
  const handleExport = () => {
    if (!patients.length) return;

    const rows = patients.map((p) => ({
      [t("export.firstName")]: p.last_name,
      [t("export.lastName")]: p.first_name,
      [t("export.gender")]:
        p.gender === "male" ? t("export.male") : t("export.female"),
      [t("export.birthDate")]: new Date(
        p?.date_of_birth || "",
      ).toLocaleDateString("fr-FR"),
      [t("export.cin")]: p.cin,
      [t("export.phone")]: p.phone_number,
      [t("export.email")]: p.email,
      [t("export.address")]: p.address,
      [t("export.bloodType")]: p.blood_type,
      [t("export.allergies")]: p.medical_history?.allergies?.join(", ") ?? "",
      [t("export.emergencyContact")]: p.contact_urgence?.phone_number ?? "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t("export.sheetName"));

    const wbBlob = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([wbBlob], { type: "application/octet-stream" });
    saveAs(
      file,
      `${t("export.fileName")}_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {t("title")}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex gap-4">
          <Add
            onSuccess={() => {
              setRefreshKey((k) => k + 1);
            }}
          />

          <Button
            variant="secondary"
            onClick={handleExport}
            disabled={loading || !patients.length}
          >
            <FileDown className="mx-1" width={22} />
            {t("exportButton")}
          </Button>
        </div>
      </div>

      <Filter refreshKey={refreshKey} />
    </div>
  );
}
