"use client"

import { deleteAppointment, getAppointmentById } from "@/api/appointments"
import { Employee } from "@/api/employees"
import { getPatientById, TenantPatient } from "@/api/patients"
import { Service } from "@/api/services"
import { Dialog, DialogContent } from "@/components/Dialog"
import { Divider } from "@/components/Divider"
import { useEffect, useState } from "react"
import {
  cancelAppointment,
  confirmPatientAppointment,
  markPatientArrived,
  startConsultation,
} from "./helpers/appointmentActions"
import { CalendarAppointment } from "./helpers/types"

import { ActionButtons } from "./details/ActionButtons"
import { AppointmentHeader } from "./details/AppointmentHeader"
import { DateTimeSection } from "./details/DateTimeSection"
import { LocationRecurringSection } from "./details/LocationRecurringSection"
import { MotifNotesSection } from "./details/MotifNotesSection"
import { PatientInfoSection } from "./details/PatientInfoSection"
import { ServiceDoctorSection } from "./details/ServiceDoctorSection"

type AppointmentDetailsProps = {
  appointment: CalendarAppointment | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (appointmentId: string) => void
  onAppointmentUpdated?: (updated: CalendarAppointment | null) => void
  services: Service[]
  employees: Employee[]
}


const usePatientData = (patientProfileId: string | undefined, isOpen: boolean) => {
  const [patientData, setPatientData] = useState<TenantPatient | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen || !patientProfileId) return
    const fetchPatient = async () => {
      setLoading(true)
      try {
        const { data } = await getPatientById(patientProfileId)
        setPatientData(data)
      } catch {
        setPatientData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchPatient()
  }, [patientProfileId, isOpen])

  return { patientData, loading }
}


export const AppointmentDetails = ({
  appointment,
  isOpen,
  onClose,
  onEdit,
  onAppointmentUpdated,
  services,
  employees,
}: AppointmentDetailsProps) => {
  const [currentAppointment, setCurrentAppointment] = useState<CalendarAppointment | null>(appointment)
  const [isLoading, setIsLoading] = useState({
    cancelling: false,
    markingArrived: false,
    confirming: false,
    starting: false,
  })

  const { patientData, loading: loadingPatient } = usePatientData(currentAppointment?.patientProfileId, isOpen)

  useEffect(() => {
    if (appointment) {
      setCurrentAppointment(appointment)
    }
  }, [appointment])

  if (!currentAppointment) return null

  const refreshAppointmentData = async (id: string) => {
    try {
      const { data } = await getAppointmentById(id)
      setCurrentAppointment(data)
      onAppointmentUpdated?.(data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleUpdate = (updated: CalendarAppointment | null) => {
    setCurrentAppointment(updated)
    onAppointmentUpdated?.(updated)
  }

  const createActionHandler = (
    actionName: keyof typeof isLoading,
    action: (id: string, ...args: any[]) => Promise<any>
  ) => {
    return async () => {
      if (!currentAppointment.id) return
      setIsLoading((prev) => ({ ...prev, [actionName]: true }))
      try {
        await action(currentAppointment.id)
        await refreshAppointmentData(currentAppointment.id)
      } finally {
        setIsLoading((prev) => ({ ...prev, [actionName]: false }))
      }
    }
  }

  const handleDelete = async () => {
    if (!currentAppointment.id) return
    try {
      await deleteAppointment(currentAppointment.id)
      onAppointmentUpdated?.(null)
      onClose()
    } catch (e) {
      console.error(e)
    }
  }

  const handleEdit = () => {
    if (currentAppointment.id && onEdit) onEdit(currentAppointment.id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <AppointmentHeader appointment={currentAppointment} onClose={onClose} onUpdate={handleUpdate}  />
        <Divider />

        <div className="space-y-4">
          <DateTimeSection appointment={currentAppointment} onUpdate={handleUpdate} />
          <Divider />

          <ServiceDoctorSection
            appointment={currentAppointment}
            services={services}
            //@ts-ignore
            employees={employees}
            onUpdate={handleUpdate}
          />
          <LocationRecurringSection appointment={currentAppointment} onUpdate={handleUpdate} />
          <MotifNotesSection appointment={currentAppointment} onUpdate={handleUpdate} />
          <Divider />

          <div className="space-y-3 pt-2">
            <PatientInfoSection patientData={patientData} loading={loadingPatient} />
          </div>

          <Divider />

          <ActionButtons
            appointment={currentAppointment}
            isLoading={isLoading}
            onCancel={createActionHandler("cancelling", cancelAppointment)}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onPatientArrived={createActionHandler("markingArrived", markPatientArrived)}
            onPatientConfirmed={createActionHandler("confirming", confirmPatientAppointment)}
            onStartConsultation={createActionHandler("starting", startConsultation)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}