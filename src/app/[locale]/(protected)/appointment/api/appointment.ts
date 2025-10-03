import axios from "@/lib/axios";

const API_URL = "https://inayabridge.com/api/appointments";

export interface AppointmentPhase1 {
  patientId: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  status: "pending" | "confirmed" | "cancelled" | string;
  consultationType: "local" | "video" | "in-person";
  motif: string;
}

export interface AppointmentPhase2 extends AppointmentPhase1 {
  endTime?: string; // HH:MM
  timeSpentInWaitingRoom?: {
    enterTime: string; // HH:MM:SS
    endTime: string; // HH:MM:SS
  };
  timeOfExitFromConsultation?: string; // HH:MM:SS
}

/* ==================== Get ==================== */
export const getAppointments = () => axios.get(API_URL);

/* ==================== POST ==================== */
export const createAppointment = (payload: AppointmentPhase1) =>
  axios.post(API_URL, payload);

/* ==================== PUT ==================== */
export const updateAppointment = (
  id: number | string,
  payload: AppointmentPhase2,
) => axios.put(`${API_URL}/${id}`, payload);

/* ==================== DELETE ==================== */
export const deleteAppointment = (id: number | string) =>
  axios.delete(`${API_URL}/${id}`);
