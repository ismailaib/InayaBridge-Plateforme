import api from "@/lib/api"

// =========================
// Types
// =========================

export type AppointmentStatus = "PENDING" | "COMPLETED" | "CANCELLED"
export type ConsultationType = "IN_PERSON" | "VIDEO"

export interface Appointment {
  id: string
  doctorProfileId: string
  patientProfileId: string
  date: string
  startTime: string
  endTime: string
  status: AppointmentStatus
  consultationType: ConsultationType
  notes?: string
  location?: string
  recurring: boolean
  patientFullName: string
  createdAt: string
  updatedAt: string
}

export interface AppointmentCreateDTO {
  doctorProfileId: string
  patientProfileId: string
  date: string
  startTime: string
  endTime: string
  status?: AppointmentStatus
  consultationType?: ConsultationType
  notes?: string
  location?: string
  recurring?: boolean
}

export interface AppointmentUpdateDTO {
  date?: string
  startTime?: string
  endTime?: string
  status?: AppointmentStatus
  consultationType?: ConsultationType
  notes?: string
  location?: string
  recurring?: boolean
}

// =========================
// API Helpers
// =========================

export const getAllAppointments = async () => {
  return api.get<Appointment[]>("/appointments")
}

export const getAppointmentById = async (id: string) => {
  return api.get<Appointment>(`/appointments/${id}`)
}

export const getAppointmentsByDoctor = async (doctorProfileId: string) => {
  return api.get<Appointment[]>(`/appointments/doctor/${doctorProfileId}`)
}

export const getAppointmentsByPatient = async (patientProfileId: string) => {
  return api.get<Appointment[]>(`/appointments/patient/${patientProfileId}`)
}

export const createAppointment = async (data: AppointmentCreateDTO) => {
  return api.post<Appointment>("/appointments", data)
}

export const updateAppointment = async (id: string, data: AppointmentUpdateDTO) => {
  return api.put<Appointment>(`/appointments/${id}`, data)
}

export const deleteAppointment = async (id: string) => {
  return api.delete(`/appointments/${id}`)
}
