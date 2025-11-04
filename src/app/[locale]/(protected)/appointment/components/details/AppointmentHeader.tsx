"use client"

import type { Appointment } from "@/api/appointments"
import { updateAppointment } from "@/api/appointments"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { DialogHeader, DialogTitle } from "@/components/Dialog"
import { Check, ShieldAlert, X } from "lucide-react"
import { useState } from "react"

export const AppointmentHeader = ({ appointment, onClose, onUpdate }: { appointment: Appointment; onClose: () => void; onUpdate?: (updated: Appointment) => void }) => {
  const [localAppointment, setLocalAppointment] = useState(appointment)
  const [loading, setLoading] = useState(false)

  const handleToggleisUrgent = async () => {
    if (loading) return
    const newisUrgent = !localAppointment.isUrgent
    setLoading(true)
    try {
      const updateData = { isUrgent: newisUrgent }
      const res = await updateAppointment(localAppointment.id, updateData)
      setLocalAppointment(res.data)
      onUpdate?.(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogHeader className="flex flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        <DialogTitle className="text-xl">Détails du rendez-vous</DialogTitle>
        <Badge
          variant={localAppointment.isUrgent ? "error" : "neutral"}
          className="m-0 flex items-center gap-1 cursor-pointer"
          onClick={handleToggleisUrgent}
        >
          {localAppointment.isUrgent ? <ShieldAlert width={18} /> : <Check width={18} />}
          {localAppointment.isUrgent ? "Urgent" : "Normale"}
        </Badge>
      </div>
      <Button variant="light" onClick={onClose}>
        <X width={18} />
      </Button>
    </DialogHeader>
  )
}