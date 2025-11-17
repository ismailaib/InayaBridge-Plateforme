import api from "@/lib/api";

// =========================
// Types
// =========================
export interface Medication {
  id: string;
  patientProfileId: string;
  name: string;
  dosage?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationCreateDTO {
  patientProfileId: string;
  name: string;
  dosage?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface MedicationUpdateDTO {
  name?: string;
  dosage?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

// =========================
// API Helpers
// =========================

export const getMedicationsByPatient = async (patientId: string) => {
  return api.get<Medication[]>(`/medical/medications/patient/${patientId}`);
};

export const getMedicationById = async (id: string) => {
  return api.get<Medication>(`/medical/medications/${id}`);
};

export const createMedication = async (data: MedicationCreateDTO) => {
  return api.post<Medication>(`/medical/medications`, data);
};

export const updateMedication = async (id: string, data: MedicationUpdateDTO) => {
  return api.put<Medication>(`/medical/medications/${id}`, data);
};

export const deleteMedication = async (id: string) => {
  return api.delete(`/medical/medications/${id}`);
};
