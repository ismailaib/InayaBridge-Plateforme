import api from "@/lib/api";

// =========================
// Types
// =========================
export interface Immunization {
  id: string;
  patientProfileId: string;
  vaccine: string;
  date: string;
  dose?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImmunizationCreateDTO {
  patientProfileId: string;
  vaccine: string;
  date: string;
  dose?: string;
  notes?: string;
}

export interface ImmunizationUpdateDTO {
  vaccine?: string;
  date?: string;
  dose?: string;
  notes?: string;
}

// =========================
// API Helpers
// =========================

export const getImmunizationsByPatient = async (patientId: string) => {
  return api.get<Immunization[]>(`/medical/immunizations/patient/${patientId}`);
};

export const getImmunizationById = async (id: string) => {
  return api.get<Immunization>(`/medical/immunizations/${id}`);
};

export const createImmunization = async (data: ImmunizationCreateDTO) => {
  return api.post<Immunization>(`/medical/immunizations`, data);
};

export const updateImmunization = async (
  id: string,
  data: ImmunizationUpdateDTO,
) => {
  return api.put<Immunization>(`/medical/immunizations/${id}`, data);
};

export const deleteImmunization = async (id: string) => {
  return api.delete(`/medical/immunizations/${id}`);
};
