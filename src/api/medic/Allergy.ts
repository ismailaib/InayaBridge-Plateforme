import api from "@/lib/api";

// =========================
// Types
// =========================
export interface Allergy {
  id: string;
  patientProfileId: string;
  allergen: string;
  reaction?: string;
  severity?: string; // mild, moderate, severe
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AllergyCreateDTO {
  patientProfileId: string;
  allergen: string;
  reaction?: string;
  severity?: string;
  notes?: string;
}

export interface AllergyUpdateDTO {
  patientProfileId?: string;
  allergen?: string;
  reaction?: string;
  severity?: string;
  notes?: string;
}

// =========================
// API Helpers
// =========================

/**
 * Get all allergies for a specific patient
 */
export const getAllergiesByPatient = async (patientId: string) => {
  return api.get<Allergy[]>(`/medical/allergies/patient/${patientId}`);
};

/**
 * Get a single allergy by ID
 */
export const getAllergyById = async (id: string) => {
  return api.get<Allergy>(`/medical/allergies/${id}`);
};

/**
 * Create a new allergy
 */
export const createAllergy = async (data: AllergyCreateDTO) => {
  return api.post<Allergy>(`/medical/allergies`, data);
};

/**
 * Update an existing allergy
 */
export const updateAllergy = async (id: string, data: AllergyUpdateDTO) => {
  return api.put<Allergy>(`/medical/allergies/${id}`, data);
};

/**
 * Delete an allergy
 */
export const deleteAllergy = async (id: string) => {
  return api.delete(`/medical/allergies/${id}`);
};
