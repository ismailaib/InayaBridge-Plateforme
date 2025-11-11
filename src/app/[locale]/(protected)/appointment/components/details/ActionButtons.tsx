"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/Button"
import { CircleOff, Trash2, GitBranchPlus, MapPinCheckInside, CalendarCheck, CirclePlay } from "lucide-react"

export const ActionButtons = ({
  appointment,
  isLoading,
  onCancel,
  onDelete,
  onEdit,
  onPatientArrived,
  onPatientConfirmed,
}: any) => {
  const router = useRouter()

  const handleStartConsultation = () => {
    if (!appointment?.id) return
    router.push(`/appointment/flow/${appointment.id}`)
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
          disabled={isLoading.cancelling}
          className="text-sm flex flex-row items-center gap-2"
        >
          <CircleOff width={18} />
        </Button>
      )}

      <Button variant="secondary" onClick={onEdit} className="text-sm flex flex-row items-center gap-2">
        <GitBranchPlus width={18} />
      </Button>

      <Button
        variant="secondary"
        onClick={onPatientArrived}
        disabled={isLoading.markingArrived}
        className="text-sm flex flex-row items-center gap-2"
      >
        <MapPinCheckInside width={18} /> {isLoading.markingArrived ? "Traitement..." : "Patient Arrivé"}
      </Button>

      <Button
        variant="success"
        onClick={onPatientConfirmed}
        disabled={isLoading.confirming}
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
        <CirclePlay width={18} /> {isLoading.starting ? "Démarrage..." : "Début Consultation"}
      </Button>
    </div>
  )
}
