"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/Button"
import {
  CircleOff,
  Trash2,
  GitBranchPlus,
  MapPinCheckInside,
  CalendarCheck,
  CirclePlay,
  ExternalLink,
  Eye,
  Speech,
} from "lucide-react"
import { updateAppointment } from "@/api/appointments"
import { showToast } from "../../../dashboard/hooks/utils"

interface ActionButtonsProps {
  appointment: any
  isLoading: {
    cancelling?: boolean
    starting?: boolean
    markingArrived?: boolean
    confirming?: boolean
  }
  onCancel?: () => void
  onDelete?: () => void
  onEdit?: () => void
  onPatientArrived?: () => void
  onPatientConfirmed?: () => void
  onUpdate?: (updated: any) => void
}

export const ActionButtons = ({
  appointment,
  isLoading,
  onCancel,
  onDelete,
  onEdit,
  onPatientArrived,
  onPatientConfirmed,
  onUpdate,
}: ActionButtonsProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const isInProgress = appointment.status === "IN_PROGRESS"

  // Ensure router is only used after hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleStartConsultation = async () => {
    if (!appointment?.id || !isMounted) return

    try {
      let updatedAppointment = appointment
      if (!isInProgress) {
        const { data: updated } = await updateAppointment(appointment.id, { status: "IN_PROGRESS" })
        updatedAppointment = updated
        if (onUpdate) onUpdate(updated)
        showToast("success", "Succès", "Rendez-vous démarré avec succès.")
      }
      router.push(`/appointment/flow/${appointment.id}`)
    } catch (error) {
      console.error("Failed to start consultation:", error)
      showToast("error", "Erreur", "Erreur lors du démarrage du rendez-vous.")
    }
  }

  if (!isMounted) return null // avoid SSR rendering issues

  if (appointment.status === "COMPLETED") {
    return (
      <Button
        variant="success"
        onClick={() => router.push(`/appointment/details/${appointment.id}`)}
        className="text-sm flex flex-row items-center gap-2 w-full"
      >
        <Eye width={18} /> Voir les détails du rendez-vous
      </Button>
    )
  }

  return (
    <div className="flex justify-between items-center overflow-x-auto space-x-2">
      {appointment.status === "CANCELLED" ? (
        <Button
          variant="destructive"
          onClick={onDelete}
          className="text-sm flex flex-row items-center gap-2"
        >
          <Trash2 width={18} />
        </Button>
      ) : (
        <Button
          variant="destructive"
          onClick={onCancel}
          disabled={isLoading.cancelling || isInProgress}
          className="text-sm flex flex-row items-center gap-2"
        >
          <CircleOff width={18} />
        </Button>
      )}

      <Button
        variant="secondary"
        onClick={onEdit}
        disabled={isInProgress}
        className="text-sm flex flex-row items-center gap-2"
      >
        <Speech width={18} />
      </Button>

      <Button
        variant="secondary"
        onClick={onPatientArrived}
        disabled={isLoading.markingArrived || isInProgress}
        className="text-sm flex flex-row items-center gap-2"
      >
        <MapPinCheckInside width={18} /> {isLoading.markingArrived ? "Traitement..." : "Patient Arrivé"}
      </Button>

      <Button
        variant="secondary"
        onClick={onPatientConfirmed}
        disabled={isLoading.confirming || isInProgress}
        className="text-sm flex flex-row items-center gap-2"
      >
        <CalendarCheck width={18} /> {isLoading.confirming ? "Confirmation..." : "Patient Confirmé"}
      </Button>

      <Button
        variant="primary"
        onClick={handleStartConsultation}
        disabled={isLoading.starting}
        className="text-sm flex flex-row items-center gap-2"
      >
        {isInProgress ? <ExternalLink width={18} /> : <CirclePlay width={18} />}{" "}
        {isLoading.starting ? "Démarrage..." : isInProgress ? "Ouvrir le flux RDV" : "Début Consultation"}
      </Button>
    </div>
  )
}
