import api from "@/lib/api"

// =========================
// Types
// =========================
export interface Role {
  id: string
  code: string
  name: string
  description?: string
  tenantId: string
  permissions: string[]
  status: string
  createdAt: string
  updatedAt: string
}

export interface RoleCreateDTO {
  code?: string
  name: string
  description?: string
  tenantId: string
  permissions: string[]
  status?: string
}

export interface RoleUpdateDTO {
  name?: string
  description?: string
  permissions?: string[]
  status?: string
}

// =========================
// API Helpers
// =========================

/**
 * Get all roles by tenant
 */
export const getRolesByTenant = async (tenant: string) => {
  return api.get<Role[]>(`/roles/tenant/${tenant}`)
}

/**
 * Get a single role by ID
 */
export const getRoleById = async (id: string) => {
  return api.get<Role>(`/roles/${id}`)
}

/**
 * Create a new role
 */
export const createRole = async (data: RoleCreateDTO) => {
  return api.post<Role>(`/roles`, data)
}

/**
 * Update an existing role
 */
export const updateRole = async (id: string, data: RoleUpdateDTO) => {
  return api.put<Role>(`/roles/${id}`, data)
}

/**
 * Delete a role
 */
export const deleteRole = async (id: string) => {
  return api.delete(`/roles/${id}`)
}

/**
 * Update a role status
 */
export const updateRoleStatus = async (id: string, status: string) => {
  return api.patch<Role>(`/roles/${id}/status?status=${status}`)
}
