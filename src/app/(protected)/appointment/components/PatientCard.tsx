import { Card } from "@/components/Card"
import { Divider } from "@/components/Divider"
import { ProgressCircle } from "@/components/ProgressCircle"
import { cx } from "@/lib/utils"
import { ClipboardPlus, FileText } from "lucide-react"


interface Patient {
    patient: string
    motif: string
    lieu: string
    remarque: string
    progressionActuelle: number
    progressionTotale: number
    misAJour: string
  }

  
const statusColor = {
  "En consultation":
    "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20",
  "Salle d'attente":
    "bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/20",
  "Rendez-vous visioconférence":
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",
}


 export const PatientCard = ({
    dossier,
    status,
  }: {
    dossier: Patient
    status: keyof typeof statusColor
  }) => (
    <Card asChild className="dark:border-gray-800">
      <div>
        <div className="flex items-center justify-between space-x-4 sm:justify-start sm:space-x-2">
          <h4 className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
            {dossier.patient}
          </h4>
          <span
            className={cx(
              statusColor[status],
              "inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
            )}
          >
            {status}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
          <div className="flex items-center space-x-1.5">
            <ClipboardPlus
              width={18}
              className="text-gray-400 dark:text-gray-600"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {dossier.motif}
            </p>
          </div>
          <div className="flex items-center space-x-1.5">
            <FileText width={18} className="text-gray-400 dark:text-gray-600" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Description .....
            </p>
          </div>
        </div>
        <Divider />
        <div className="block sm:flex sm:items-center sm:justify-between sm:space-x-2">
          <div className="flex items-center space-x-2">
            <ProgressCircle
              value={
                (dossier.progressionActuelle / dossier.progressionTotale) * 100
              }
              radius={9}
              strokeWidth={3.5}
            />
            <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
              Consultations ({dossier.progressionActuelle}/
              {dossier.progressionTotale})
            </p>
          </div>
          <p className="mt-2 text-sm text-gray-500 sm:mt-0 dark:text-gray-500">
            Mis à jour {dossier.misAJour}
          </p>
        </div>
      </div>
    </Card>
  )