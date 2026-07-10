import api from "@/lib/api";

// =========================
// Types
// =========================
export interface Surgery {
  id: string;
  patientProfileId: string;
  name: string;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SurgeryCreateDTO {
  patientProfileId: string;
  name: string;
  date: string;
  notes?: string;
}

export interface SurgeryUpdateDTO {
  name?: string;
  date?: string;
  notes?: string;
}

// =========================
// API Helpers
// =========================
export const getSurgeriesByPatient = async (patientId: string) => {
  return api.get<Surgery[]>(`/medical/surgeries/patient/${patientId}`);
};

export const getSurgeryById = async (id: string) => {
  return api.get<Surgery>(`/medical/surgeries/${id}`);
};

export const createSurgery = async (data: SurgeryCreateDTO) => {
  return api.post<Surgery>(`/medical/surgeries`, data);
};

export const updateSurgery = async (id: string, data: SurgeryUpdateDTO) => {
  return api.put<Surgery>(`/medical/surgeries/${id}`, data);
};

export const deleteSurgery = async (id: string) => {
  return api.delete(`/medical/surgeries/${id}`);
};
