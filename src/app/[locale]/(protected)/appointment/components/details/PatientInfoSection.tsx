"use client"

import { format } from "date-fns"
import { CreditCard, Phone, Mail, MapPin, User, AlertCircle } from "lucide-react"
import { cx } from "@/lib/utils"
import { CopyableRow } from "../CopyableRow"
import { getGenderLabel, getValidDate } from "../helpers/details"

export const PatientInfoSection = ({ patientData, loading }: any) => {
  if (loading) return <p className="text-sm text-gray-500">Chargement...</p>

  if (!patientData)
    return (
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <p className="text-sm text-gray-700 dark:text-gray-300">Données patient indisponibles</p>
      </div>
    )

  const patientFullName = `${patientData.firstName} ${patientData.lastName}`.trim()
  const patientBirthDate = getValidDate(patientData.dateOfBirth)

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{patientFullName}</h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          <span
            className={cx(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              getGenderLabel(patientData.gender) === "Homme"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                : "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
            )}
          >
            {getGenderLabel(patientData.gender)}
          </span>
          {patientBirthDate && (
            <>
              <span className="mx-2">•</span>
              <span>
                {format(patientBirthDate, "dd/MM/yyyy")} ({new Date().getFullYear() - patientBirthDate.getFullYear()} ans)
              </span>
            </>
          )}
        </p>
      </div>

      <div className="w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-900 mt-2">
        <table className="w-full table-auto">
          <tbody>
            {patientData.cin && <CopyableRow icon={<CreditCard width={18} />} label="CIN" value={patientData.cin} />}
            {patientData.phone && <CopyableRow icon={<Phone width={18} />} label="Téléphone" value={patientData.phone} />}
            {patientData.email && <CopyableRow icon={<Mail width={18} />} label="Email" value={patientData.email} />}
            {patientData.address && <CopyableRow icon={<MapPin width={18} />} label="Adresse" value={patientData.address} />}
          </tbody>
        </table>
      </div>
    </div>
  )
}
