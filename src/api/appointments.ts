import api from "@/lib/api";

// =========================
// Types
// =========================

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "IN_PROGRESS"
  | "ARRIVED";
export type ConsultationType = "LOCAL" | "IN_PERSON" | "VIDEO";

export interface Appointment {
  id: string;
  doctorProfileId: string;
  patientProfileId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  consultationType: ConsultationType;
  notes?: string;
  isUrgent: boolean;
  location?: string;
  motif?: string;
  serviceId?: string;
  doctorId?: string;
  recurring: boolean;
  patientFullName: string;
  createdAt: string;
  updatedAt: string;
  price?: number;
}

export interface AppointmentCreateDTO {
  doctorProfileId: string;
  patientProfileId: string;
  date: string;
  startTime: string;
  endTime: string;
  status?: AppointmentStatus;
  consultationType?: ConsultationType;
  notes?: string;
  isUrgent: boolean;
  serviceId?: string;
  motif?: string;
  doctorId?: string;
  location?: string;
  recurring?: boolean;
  price?: number;
}

export interface AppointmentUpdateDTO {
  date?: string; // "yyyy-MM-dd"
  startTime?: string; // "HH:mm"
  endTime?: string;
  status?: AppointmentStatus;
  consultationType?: ConsultationType;
  doctorProfileId?: string;
  motif?: string;
  notes?: string;
  isUrgent?: boolean;
  location?: string;
  recurring?: boolean;
  price?: number;
}

export interface AppointmentResponse {
  id: string;
  doctorProfileId: string;
  patientProfileId: string;
  date: string; // "yyyy-MM-dd"
  startTime: string; // "HH:mm"
  endTime?: string;
  status: AppointmentStatus; // e.g., "PENDING", "CONFIRMED", "ARRIVED", etc.
  consultationType: ConsultationType; // e.g., "LOCAL", "VIDEO"
  motif?: string;
  notes?: string;
  location?: string;
  recurring?: boolean;
  isUrgent: boolean;
  serviceId?: string;
  patientFullName: string;
  price?: number;
}

// =========================
// API Helpers
// =========================

export const getAllAppointments = async () => {
  return api.get<Appointment[]>("/appointments");
};

export const getAppointmentById = async (id: string) => {
  return api.get<Appointment>(`/appointments/${id}`);
};

export const getAppointmentsByDoctor = async (doctorProfileId: string) => {
  return api.get<Appointment[]>(`/appointments/doctor/${doctorProfileId}`);
};

export const getAppointmentsByPatient = async (patientProfileId: string) => {
  return api.get<Appointment[]>(`/appointments/patient/${patientProfileId}`);
};

export const createAppointment = async (data: AppointmentCreateDTO) => {
  return api.post<Appointment>("/appointments", data);
};

export const updateAppointment = async (
  id: string,
  data: AppointmentUpdateDTO,
) => {
  return api.put<Appointment>(`/appointments/${id}`, data);
};

export const deleteAppointment = async (id: string) => {
  return api.delete(`/appointments/${id}`);
};
