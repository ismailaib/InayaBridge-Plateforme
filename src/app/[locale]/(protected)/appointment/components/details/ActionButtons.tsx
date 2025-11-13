"use client"

import { Button } from "@/components/Button"
import { CircleOff, Trash2, GitBranchPlus, MapPinCheckInside, CalendarCheck, CirclePlay, ExternalLink } from "lucide-react"
import { updateAppointment } from "@/api/appointments"
import { showToast } from "../../../dashboard/hooks/utils"

export const ActionButtons = ({
  appointment,
  isLoading,
  onCancel,
  onDelete,
  onEdit,
  onPatientArrived,
  onPatientConfirmed,
  onUpdate,
}: any) => {

  const isInProgress = appointment.status === "IN_PROGRESS"

  const handleStartConsultation = async () => {
    if (!appointment?.id) return

    try {
      let updatedAppointment = appointment
      if (!isInProgress) {
        const { data: updated } = await updateAppointment(appointment.id, { status: "IN_PROGRESS" })
        updatedAppointment = updated
        if (onUpdate) onUpdate(updated)
        showToast('success', 'Succès', 'Rendez-vous démarré avec succès.');
      }
      window.open(`/appointment/flow/${appointment.id}`, "_blank")
    } catch (error) {
      console.error("Failed to start consultation:", error)
      showToast('error', 'Erreur', 'Erreur lors du démarrage du rendez-vous.');
    }
  }

  if (appointment.status === "COMPLETED") {
    return (
      <Button
        variant="primary"
        onClick={() => window.open(`/flow/${appointment.id}/details`, "_blank")}
        className="text-sm flex flex-row items-center gap-2 w-full"
      >
        <ExternalLink width={18} /> Voir les détails du rendez-vous
      </Button>
    )
  }

  return (
    <div className="flex justify-between items-center overflow-x-auto space-x-2">
      {appointment.status === "CANCELLED" ? (
        <Button variant="destructive" onClick={onDelete} className="text-sm flex flex-row items-center gap-2">
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
        <GitBranchPlus width={18} />
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
         {(isInProgress ? <ExternalLink width={18} /> : <CirclePlay width={18} />)}  {isLoading.starting ? "Démarrage..." : (isInProgress ? "Ouvrir le flux RDV" : "Début Consultation")}
      </Button>
    </div>
  )
}