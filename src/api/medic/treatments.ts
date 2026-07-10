import api from "@/lib/api";

// =========================
// Types
// =========================

export interface PatientMedication {
  id: string;
  patientId: string;
  medicamentId: string;
  medicamentName: string; // Snapshot name from backend
  quantity: number;
  dosage: string;
  frequency: string;
  startDate: string;
  notes?: string;
  isFromStock: boolean;
  tenantId: string;
  createdAt: string;
}

export interface CreatePatientMedicationDTO {
  patientId: string;
  medicamentId: string;
  quantity: number; // Quantity to deduct from stock or just record
  dosage: string;
  frequency: string;
  startDate: string; // YYYY-MM-DD
  notes?: string;
  fromStock: boolean;
  tenantId: string;
}

// =========================
// API Functions
// =========================

export const getTreatmentsByPatient = async (patientId: string) => {
  return api.get<PatientMedication[]>(`/treatments/patient/${patientId}`);
};

export const addTreatmentToPatient = async (data: CreatePatientMedicationDTO) => {
  return api.post<PatientMedication>(`/treatments`, data);
};

export const deleteTreatment = async (id: string) => {
  return api.delete(`/treatments/${id}`);
};