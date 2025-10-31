"use client";

import { Button } from "@/components/Button";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { saveAs } from "file-saver";
import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";

import Add from "./components/Add";
import Filter from "./components/Filter";
import { getPatientsByTenant, TenantPatient } from "@/api/patients";

export default function PatientsPage() {
  const t = useTranslations("patients.patients");
  const [patients, setPatients] = useState<TenantPatient[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        const tid = user?.doctorProfile?.tenantId || user?.tenantId || null;
        if (tid) {
          setTenantId(tid);
          console.log("tenantId loaded:", tid);
        }
      }
    } catch (err) {
      console.error("Erreur lecture tenantId:", err);
    }
  }, []);

  useEffect(() => {
    if (!tenantId) return; // Wait until tenantId is loaded

    const fetchPatients = async () => {
      try {
        setLoading(true);
        console.log("Fetching patients for tenant:", tenantId);
        const res = await getPatientsByTenant(tenantId);
        setPatients(res.data || []);
      } catch (err) {
        console.error("Erreur chargement patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [tenantId, refreshKey]); // depend also on tenantId

  const handleExport = () => {
    if (!patients.length) return;

    const rows = patients.map((p) => ({
      [t("export.firstName")]: p.firstName,
      [t("export.lastName")]: p.lastName,
      [t("export.gender")]:
        p.gender === "male" ? t("export.male") : t("export.female"),
      [t("export.birthDate")]: p.dateOfBirth
        ? new Date(p.dateOfBirth).toLocaleDateString("fr-FR")
        : "",
      [t("export.cin")]: p.cin,
      [t("export.phone")]: p.phone || "",
      [t("export.email")]: p.email || "",
      [t("export.address")]: p.address || "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t("export.sheetName"));

    const wbBlob = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([wbBlob], { type: "application/octet-stream" });
    saveAs(
      file,
      `${t("export.fileName")}_${new Date().toISOString().slice(0, 10)}.xlsx`
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
          <Add onSuccess={() => setRefreshKey((k) => k + 1)} />

          <Button
            variant="secondary"
            onClick={handleExport}
            disabled={!patients.length}
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
