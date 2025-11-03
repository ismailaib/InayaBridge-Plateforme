"use client"

import { Dialog, DialogContent } from "@/components/Dialog"
import { Divider } from "@/components/Divider"
import { useState, useEffect } from "react"
import { getAppointmentById, deleteAppointment } from "@/api/appointments"
import { getPatientById, TenantPatient } from "@/api/patients"
import { getEmployees, Employee } from "@/api/employees"
import { getServicesByTenant, Service } from "@/api/services"
import {
  markPatientArrived,
  confirmPatientAppointment,
  startConsultation,
  cancelAppointment,
} from "./helpers/appointmentActions"
import { showToast } from "../../dashboard/hooks/utils"
import { CalendarAppointment } from "./helpers/types"

import { AppointmentHeader } from "./details/AppointmentHeader"
import { DateTimeSection } from "./details/DateTimeSection"
import { ServiceDoctorSection } from "./details/ServiceDoctorSection"
import { MotifNotesSection } from "./details/MotifNotesSection"
import { PatientInfoSection } from "./details/PatientInfoSection"
import { LocationRecurringSection } from "./details/LocationRecurringSection"
import { ActionButtons } from "./details/ActionButtons"

type AppointmentDetailsProps = {
  appointment: CalendarAppointment | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (appointmentId: string) => void
  onAppointmentUpdated?: (updated: CalendarAppointment | null) => void
}

const useUser = () => {
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user")
      if (stored) setUser(JSON.parse(stored))
    } catch (e) {
      console.error(e)
      showToast("error", "Erreur", "Échec du chargement des données utilisateur.")
    }
  }, [])
  return user
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

const useTenantResources = (tenantId: string | undefined, isOpen: boolean) => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    if (!isOpen || !tenantId) return
    const fetchResources = async () => {
      try {
        const [employeesRes, servicesRes] = await Promise.all([
          getEmployees(tenantId),
          getServicesByTenant(tenantId),
        ])
        setEmployees(employeesRes.data)
        setServices(servicesRes.data)
      } catch (error) {
        console.error("Error fetching employees and services:", error)
      }
    }
    fetchResources()
  }, [tenantId, isOpen])

  return { employees, services }
}

export const AppointmentDetails = ({
  appointment,
  isOpen,
  onClose,
  onEdit,
  onAppointmentUpdated,
}: AppointmentDetailsProps) => {
  const [currentAppointment, setCurrentAppointment] = useState<CalendarAppointment | null>(appointment)
  const [isLoading, setIsLoading] = useState({
    cancelling: false,
    markingArrived: false,
    confirming: false,
    starting: false,
  })

  const user = useUser()
  const tenantId = user?.doctorProfile?.tenantId
  const { patientData, loading: loadingPatient } = usePatientData(currentAppointment?.patientProfileId, isOpen)
  const { employees, services } = useTenantResources(tenantId, isOpen)

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

  const handleUpdate = (updated: CalendarAppointment) => {
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
        <AppointmentHeader appointment={currentAppointment} onClose={onClose} />
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