import api from "@/lib/api";

// =========================
// Types
// =========================

export interface TenantPatient {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  cin: string;
  phone?: string;
  email?: string;
  gender: string;
  dateOfBirth?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantPatientCreateDTO {
  tenantId: string;
  firstName: string;
  lastName: string;
  cin: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  address?: string;
}

export interface TenantPatientUpdateDTO {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  address?: string;
}

// =========================
// API Helpers
// =========================

/**
 * Get all patients by tenant (clinic)
 */
export const getPatientsByTenant = async (tenantId: string) => {
  return api.get<TenantPatient[]>(`/tenant-patients/${tenantId}`);
};

/**
 * Get a patient by ID
 */
export const getPatientById = async (id: string) => {
  return api.get<TenantPatient>(`/tenant-patients/id/${id}`);
};

/**
 * Get a patient by CIN
 */
export const getPatientByCin = async (cin: string) => {
  return api.get<TenantPatient>(`/tenant-patients/cin/${cin}`);
};

/**
 * Create a new patient
 */
export const createPatient = async (data: TenantPatientCreateDTO) => {
  return api.post<TenantPatient>(`/tenant-patients`, data);
};

/**
 * Update an existing patient
 */
export const updatePatient = async (id: string, data: TenantPatientUpdateDTO) => {
  return api.put<TenantPatient>(`/tenant-patients/${id}`, data);
};

/**
 * Delete a patient
 */
export const deletePatient = async (id: string) => {
  return api.delete(`/tenant-patients/${id}`);
};
