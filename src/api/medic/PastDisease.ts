import api from "@/lib/api";

// =========================
// Types
// =========================
export interface PastDisease {
  id: string;
  patientProfileId: string;
  name: string;
  severity?: string; // mild, moderate, severe
  diagnosisDate: string;
  status?: string; // active, resolved
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PastDiseaseCreateDTO {
  patientProfileId: string;
  name: string;
  severity?: string;
  diagnosisDate: string;
  status?: string;
  notes?: string;
}

export interface PastDiseaseUpdateDTO {
  name?: string;
  severity?: string;
  diagnosisDate?: string;
  status?: string;
  notes?: string;
}

// =========================
// API Helpers
// =========================
export const getPastDiseasesByPatient = async (patientId: string) => {
  return api.get<PastDisease[]>(`/medical/past-diseases/patient/${patientId}`);
};

export const getPastDiseaseById = async (id: string) => {
  return api.get<PastDisease>(`/medical/past-diseases/${id}`);
};

export const createPastDisease = async (data: PastDiseaseCreateDTO) => {
  return api.post<PastDisease>(`/medical/past-diseases`, data);
};

export const updatePastDisease = async (
  id: string,
  data: PastDiseaseUpdateDTO,
) => {
  return api.put<PastDisease>(`/medical/past-diseases/${id}`, data);
};

export const deletePastDisease = async (id: string) => {
  return api.delete(`/medical/past-diseases/${id}`);
};
