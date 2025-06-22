"use client"

import { saveAs } from "file-saver"
import { FileDown } from "lucide-react"
import { useEffect, useState } from "react"
import * as XLSX from "xlsx"

import { Button } from "@/components/Button"
import { getDoctorPatients, Patient } from "../api/patients"; // ⇦ déjà utilisé plus bas
import Add from "./components/Add"
import Filter from "./components/Filter"

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [loading, setLoading] = useState(true)

  /* ─── refetch à chaque ajout ─── */
  useEffect(() => {
    setLoading(true)
    getDoctorPatients()
      .then((res) => setPatients(res.data))
      .catch((err) => console.error("Failed to fetch patients", err))
      .finally(() => setLoading(false))
  }, [refreshKey])

  /* ─── export Excel ─── */
  const handleExport = () => {
    if (!patients.length) return

    // 1. on transforme les objets pour avoir des colonnes lisibles
    const rows = patients.map((p) => ({
      Prenom: p.last_name,
      Nom: p.first_name,
      Sexe: p.gender === "male" ? "Homme" : "Femme",
      "Date naissance": new Date(p?.date_of_birth || "").toLocaleDateString("fr-FR"),
      CIN: p.cin,
      Téléphone: p.phone_number,
      Email: p.email,
      Adresse: p.address,
      "Groupe sanguin": p.blood_type,
      Allergies: p.medical_history?.allergies?.join(", ") ?? "",
      "Urgence (tel)": p.contact_urgence?.phone_number ?? "",
    }))

    // 2. JSON → worksheet / workbook
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Patients")

    // 3. Génère un blob et télécharge
    const wbBlob = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const file = new Blob([wbBlob], { type: "application/octet-stream" })
    saveAs(file, `patients_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Gestion des patients
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ici vous pouvez consulter tous vos patients et générer un rapport
          </p>
        </div>

        <div className="flex gap-4">
          <Add
            onSuccess={() => {
              setRefreshKey((k) => k + 1)
            }}
          />

          <Button
            variant="secondary"
            onClick={handleExport}
            disabled={loading || !patients.length}
          >
            <FileDown className="mr-1" width={22} />
            Exporter en Excel
          </Button>
        </div>
      </div>

      <Filter refreshKey={refreshKey} />
    </div>
  )
}
