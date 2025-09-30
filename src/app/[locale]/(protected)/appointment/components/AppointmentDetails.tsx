import { Button } from "@/components/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog"
import { cx } from "@/lib/utils"
import { deleteAppointment, updateAppointment } from "../api/appointment"

import {
  format,
} from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar1, Clock, Phone, User, Edit2, Save, X } from "lucide-react"
import { useState } from "react"

export const AppointmentDetails = ({
  appointment,
  isOpen,
  onClose,
  onAppointmentUpdated,
  onAppointmentDeleted,
}: {
  appointment: {
    date_of_birth: string
    id: string
    patient: string
    phoneNumber: string
    type: string
    typeColor: string
    date: Date
    startTime: string
    endTime: string
    location: string
    notes: string
    confirmed: boolean
  } | null
  isOpen: boolean
  onClose: () => void
  onAppointmentUpdated?: (updatedAppointment: any) => void
  onAppointmentDeleted?: (appointmentId: string) => void
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [tempValues, setTempValues] = useState({
    date: appointment?.date ? format(new Date(appointment.date), "yyyy-MM-dd") : "",
    notes: appointment?.notes || "",
    confirmed: appointment?.confirmed || false,
    startTime: appointment?.startTime || "",
    endTime: appointment?.endTime || ""
  })

  if (!appointment) return null

  const handleDelete = async () => {
    if (!appointment.id) return
    
    setIsDeleting(true)
    try {
      await deleteAppointment(appointment.id)
      onAppointmentDeleted?.(appointment.id)
      onClose()
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      // You might want to show a toast notification here
    } finally {
      setIsDeleting(false)
    }
  }

  const formatTimeToHi = (time: string) => {
    // Convert time to H:i format (e.g., "14:30" or "9:15")
    if (!time) return time
    
    // Handle different input formats
    let cleanTime = time.trim()
    
    // If it's already in H:i or HH:MM format
    if (cleanTime.includes(':')) {
      const [hours, minutes] = cleanTime.split(':')
      const h = parseInt(hours, 10)
      const m = parseInt(minutes, 10)
      
      // Validate time values
      if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
        return time // Return original if invalid
      }
      
      return `${h}:${m.toString().padStart(2, '0')}`
    }
    
    return time
  }

  const convertToTimeInput = (time: string) => {
    // Convert H:i format to HH:MM for HTML time input
    if (!time || !time.includes(':')) return time
    
    const [hours, minutes] = time.split(':')
    const h = parseInt(hours, 10)
    const m = parseInt(minutes, 10)
    
    if (isNaN(h) || isNaN(m)) return time
    
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  }

  const handleStatusToggle = async () => {
    const newStatus = !appointment.confirmed
    setIsUpdating(true)
    
    try {
      const payload = {
        patientId: parseInt(appointment.id),
        date: format(new Date(appointment.date), "yyyy-MM-dd"),
        startTime: formatTimeToHi(appointment.startTime),
        status: newStatus ? "confirmed" : "pending",
        consultationType: appointment.type as "local" | "video" | "in-person",
        motif: appointment.notes || "",
        endTime: formatTimeToHi(appointment.endTime)
      }
      
      await updateAppointment(appointment.id, payload)
      
      const updatedAppointment = {
        ...appointment,
        confirmed: newStatus
      }
      
      onAppointmentUpdated?.(updatedAppointment)
      onClose()
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleFieldUpdate = async (field: string) => {
    setIsUpdating(true)
    
    try {
      let updatedData: any = { ...appointment }
      
      if (field === 'date') {
        updatedData.date = new Date(tempValues.date)
      } else if (field === 'notes') {
        updatedData.notes = tempValues.notes
      } else if (field === 'startTime') {
        updatedData.startTime = tempValues.startTime
      } else if (field === 'endTime') {
        updatedData.endTime = tempValues.endTime
      } else if (field === 'times') {
        updatedData.startTime = tempValues.startTime
        updatedData.endTime = tempValues.endTime
      }
      
      const payload = {
        patientId: parseInt(appointment.id),
        date: field === 'date' ? tempValues.date : format(new Date(appointment.date), "yyyy-MM-dd"),
        startTime: formatTimeToHi(field === 'startTime' || field === 'times' ? tempValues.startTime : appointment.startTime),
        status: appointment.confirmed ? "confirmed" : "pending",
        consultationType: appointment.type as "local" | "video" | "in-person",
        motif: field === 'notes' ? tempValues.notes : (appointment.notes || ""),
        endTime: formatTimeToHi(field === 'endTime' || field === 'times' ? tempValues.endTime : appointment.endTime)
      }
      
      await updateAppointment(appointment.id, payload)
      onAppointmentUpdated?.(updatedData)
      setEditingField(null)
      onClose()
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      // You might want to show error message to user
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelEdit = (field: string) => {
    setEditingField(null)
    // Reset temp values to original
    if (field === 'date') {
      setTempValues(prev => ({
        ...prev,
        date: appointment?.date ? format(new Date(appointment.date), "yyyy-MM-dd") : ""
      }))
    } else if (field === 'notes') {
      setTempValues(prev => ({
        ...prev,
        notes: appointment?.notes || ""
      }))
    } else if (field === 'startTime') {
      setTempValues(prev => ({
        ...prev,
        startTime: appointment?.startTime || ""
      }))
    } else if (field === 'endTime') {
      setTempValues(prev => ({
        ...prev,
        endTime: appointment?.endTime || ""
      }))
    } else if (field === 'times') {
      setTempValues(prev => ({
        ...prev,
        startTime: appointment?.startTime || "",
        endTime: appointment?.endTime || ""
      }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails du rendez-vous</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <div className="flex justify-between">
              <div
                className={cx(
                  "inline-flex items-center rounded px-2 py-1 text-xs font-medium",
                  appointment.typeColor,
                )}
              >
                {appointment.type === "local" && (
                  <span className="ml-2 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Cabinet principale
                  </span>
                )}

                {appointment.type === "in-person" && (
                  <span className="ml-2 inline-block rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    À domicile
                  </span>
                )}

                {appointment.type === "video" && (
                  <span className="ml-2 inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-900 dark:text-red-200">
                    Visio Conférence
                  </span>
                )}
              </div>
              
              <button
                onClick={handleStatusToggle}
                disabled={isUpdating}
                className={cx(
                  "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium transition-colors hover:opacity-80 disabled:opacity-50",
                  appointment.confirmed
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                )}
              >
                {isUpdating ? "..." : (appointment.confirmed ? "Confirmé" : "À confirmer")}
              </button>
            </div>

            <div className="mt-2 flex items-center gap-2">
              {editingField === 'date' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={tempValues.date}
                    onChange={(e) => setTempValues(prev => ({ ...prev, date: e.target.value }))}
                    className="rounded border px-2 py-1 text-sm bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                  />
                  <button
                    onClick={() => handleFieldUpdate('date')}
                    disabled={isUpdating}
                    className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleCancelEdit('date')}
                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                    {format(new Date(appointment.date), "EEEE d MMMM yyyy", {
                      locale: fr,
                    })}
                  </h3>
                  <button
                    onClick={() => setEditingField('date')}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 rounded-md bg-gray-50 p-3 dark:bg-gray-900">
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <h4 className="font-medium text-gray-900 dark:text-gray-50">
                {appointment.patient}
              </h4>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {appointment.phoneNumber}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 rounded-md bg-gray-50 p-3 dark:bg-gray-900">
            <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-50">
                  Horaires
                </h4>
                {editingField !== 'times' && (
                  <button
                    onClick={() => setEditingField('times')}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {editingField === 'times' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16">
                      Début:
                    </label>
                    <input
                      type="time"
                      value={convertToTimeInput(tempValues.startTime)}
                      onChange={(e) => setTempValues(prev => ({ ...prev, startTime: e.target.value }))}
                      className="rounded border px-2 py-1 text-sm bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16">
                      Fin:
                    </label>
                    <input
                      type="time"
                      value={convertToTimeInput(tempValues.endTime)}
                      onChange={(e) => setTempValues(prev => ({ ...prev, endTime: e.target.value }))}
                      className="rounded border px-2 py-1 text-sm bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFieldUpdate('times')}
                      disabled={isUpdating}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                    >
                      <Save className="h-3 w-3" />
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => handleCancelEdit('times')}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                    >
                      <X className="h-3 w-3" />
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {appointment.startTime} - {appointment.endTime}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-3 rounded-md bg-gray-50 p-3 dark:bg-gray-900">
            <Calendar1 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-50">
                Date de Naissance
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {appointment.date_of_birth
                  ? format(new Date(appointment.date_of_birth), "dd/MM/yyyy")
                  : "--"}
              </p>
            </div>
          </div>

          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-50">
                Notes
              </h4>
              {editingField !== 'notes' && (
                <button
                  onClick={() => setEditingField('notes')}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {editingField === 'notes' ? (
              <div className="space-y-2">
                <textarea
                  value={tempValues.notes}
                  onChange={(e) => setTempValues(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full rounded border px-2 py-1 text-sm min-h-[60px] bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                  placeholder="Ajouter des notes..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFieldUpdate('notes')}
                    disabled={isUpdating}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
                  >
                    <Save className="h-3 w-3" />
                    Sauvegarder
                  </button>
                  <button
                    onClick={() => handleCancelEdit('notes')}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                  >
                    <X className="h-3 w-3" />
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {appointment.notes || "Aucune note"}
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="secondary" onClick={onClose}>
              Fermer
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}