import api from "@/lib/api";

// =========================
// Types
// =========================
export interface Department {
  id: string;
  code: string;
  name: string;
  phone?: string;
  description?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentCreateDTO {
  code?: string;
  name: string;
  phone?: string;
  description?: string;
  tenantId: string;
  status?: string;
}

export interface DepartmentUpdateDTO {
  name?: string;
  phone?: string;
  description?: string;
  status?:string;
}

// =========================
// API Helpers
// =========================

/**
 * Get all departments by cabinet (tenant)
 */
export const getDepartmentsByCabinet = async (tenantId: string) => {
  return api.get<Department[]>(`/departments/tenant/${tenantId}`);
};

/**
 * Get a single department by ID
 */
export const getDepartmentById = async (id: string) => {
  return api.get<Department>(`/departments/${id}`);
};

/**
 * Create a new department
 */
export const createDepartment = async (data: DepartmentCreateDTO) => {
  return api.post<Department>(`/departments`, data);
};

/**
 * Update an existing department
 */
export const updateDepartment = async (id: string, data: DepartmentUpdateDTO) => {
  return api.put<Department>(`/departments/${id}`, data);
};

/**
 * Delete a department
 */
export const deleteDepartment = async (id: string) => {
  return api.delete(`/departments/${id}`);
};
