import api from "@/lib/api";

// =========================
// Types
// =========================
export interface Prescription {
  id: string;
  patientId: string;
  tenantId: string;
  doctorId: string;
  medicamentIds: string[];
  notes?: string;
  status: string; // ACTIVE / COMPLETED / CANCELLED
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionCreateDTO {
  patientId: string;
  tenantId: string;
  doctorId: string;
  medicamentIds: string[];
  notes?: string;
  status?: string;
}

export interface PrescriptionUpdateDTO {
  medicamentIds?: string[];
  notes?: string;
  status?: string;
}

// =========================
// API Helpers
// =========================

export const getPrescriptionsByTenant = async (tenantId: string) => {
  return api.get<Prescription[]>(`/pharmacy/prescriptions/tenant/${tenantId}`);
};

export const getPrescriptionsByPatient = async (patientId: string) => {
  return api.get<Prescription[]>(`/pharmacy/prescriptions/patient/${patientId}`);
};

export const getPrescriptionById = async (id: string) => {
  return api.get<Prescription>(`/pharmacy/prescriptions/${id}`);
};

export const createPrescription = async (data: PrescriptionCreateDTO) => {
  return api.post<Prescription>(`/pharmacy/prescriptions`, data);
};

export const updatePrescription = async (id: string, data: PrescriptionUpdateDTO) => {
  return api.put<Prescription>(`/pharmacy/prescriptions/${id}`, data);
};

export const deletePrescription = async (id: string) => {
  return api.delete(`/pharmacy/prescriptions/${id}`);
};

export const updatePrescriptionStatus = async (id: string, status: string) => {
  return api.patch<Prescription>(`/pharmacy/prescriptions/${id}/status?status=${status}`);
};
