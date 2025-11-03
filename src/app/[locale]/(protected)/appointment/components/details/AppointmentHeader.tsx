"use client"

import { Button } from "@/components/Button"
import { DialogHeader, DialogTitle } from "@/components/Dialog"
import { Badge } from "@/components/Badge"
import { ShieldAlert, X } from "lucide-react"

export const AppointmentHeader = ({ appointment, onClose }: any) => (
  <DialogHeader className="flex flex-row items-center justify-between">
    <div className="flex items-center gap-2">
      <DialogTitle className="text-xl">Détails du rendez-vous</DialogTitle>
      {appointment.urgent && (
        <Badge variant="error" className="m-0">
          <ShieldAlert width={18} />
          Urgent
        </Badge>
      )}
    </div>
    <Button variant="light" onClick={onClose}>
      <X width={18} />
    </Button>
  </DialogHeader>
)
