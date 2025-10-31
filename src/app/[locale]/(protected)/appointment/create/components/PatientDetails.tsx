"use client";

import { cx } from "@/lib/utils";
import { format } from "date-fns";
import { TenantPatient } from "@/api/patients";
import { User, CreditCard, Phone, Mail, MapPin } from "lucide-react";
import { getGenderLabel } from "../../components/helpers/details";
import { CopyableRow } from "../../components/CopyableRow";

export default function PatientDetails({ patient }: { patient: TenantPatient }) {
  return (
    <div className="space-y-6 border-l border-gray-200 dark:border-gray-800 pl-6 h-full">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              {patient.firstName} {patient.lastName}
            </h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            <span
              className={cx(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                getGenderLabel(patient.gender) === "Homme"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
              )}
            >
              {patient.gender}
            </span>
            {patient.createdAt && <span className="mx-2">•</span>}
            {patient.createdAt && (
              <span>
                {format(patient.createdAt, "dd/MM/yyyy")} (
                {new Date().getFullYear() - new Date(patient.createdAt).getFullYear()} ans)
              </span>
            )}
          </p>
        </div>

        <div className="w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mt-2">
          <table className="w-full table-auto">
            <tbody>
              {patient.cin && (
                <CopyableRow
                  icon={<CreditCard className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
                  label="CIN"
                  value={patient.cin}
                />
              )}
              {patient.phone && (
                <CopyableRow
                  icon={<Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
                  label="Téléphone"
                  value={patient.phone}
                />
              )}
              {patient.email && (
                <CopyableRow
                  icon={<Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
                  label="Email"
                  value={patient.email}
                />
              )}
              {patient.address && (
                <CopyableRow
                  icon={<MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
                  label="Adresse"
                  value={patient.address}
                />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
