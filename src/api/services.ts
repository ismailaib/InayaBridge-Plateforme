import api from "@/lib/api";

// =========================
// Types
// =========================
export interface Service {
  id: string;
  code: string;
  name: string;
  description?: string;
  price?: number;
  departmentId: string;
departmentName?:string;
  tenantId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCreateDTO {
  code?: string;
  name: string;
  description?: string;
  price?: number;
  departmentId: string;
  tenantId: string;
  status?: string;
}

export interface ServiceUpdateDTO {
  code?: string;
  name?: string;
  departmentId?: string;
  description?: string;
  price?: number;
  status?: string;
}

// =========================
// API Helpers
// =========================

/**
 * Get all services by tenant
 */
export const getServicesByTenant = async (tenantId: string) => {
  return api.get<Service[]>(`/services/tenant/${tenantId}`);
};

/**
 * Get all services by department
 */
export const getServicesByDepartment = async (departmentId: string) => {
  return api.get<Service[]>(`/services/department/${departmentId}`);
};

/**
 * Get a single service by ID
 */
export const getServiceById = async (id: string) => {
  return api.get<Service>(`/services/${id}`);
};

/**
 * Create a new service
 */
export const createService = async (data: ServiceCreateDTO) => {
  return api.post<Service>(`/services`, data);
};

/**
 * Update an existing service
 */
export const updateService = async (id: string, data: ServiceUpdateDTO) => {
  return api.put<Service>(`/services/${id}`, data);
};

/**
 * Update service status only
 */
export const updateServiceStatus = async (id: string, status: string) => {
  return api.patch<Service>(`/services/${id}/status`, null, {
    params: { status },
  });
};

/**
 * Delete a service
 */
export const deleteService = async (id: string) => {
  return api.delete(`/services/${id}`);
};
