import api from "@/lib/api"

// =========================
// Types
// =========================
export interface Permission {
  id: string        // e.g., "employees.create"
  name: string      // e.g., "Créer un employé"
  description: string
}

// =========================
// API Helpers
// =========================

/**
 * Get all permissions (global catalog)
 */
export const getAllPermissions = async () => {
  return api.get<Permission[]>(`/permissions`)
}

/**
 * Get permissions for a specific module (e.g., employees, billing, roles)
 */
export const getPermissionsByModule = async (module: string) => {
  return api.get<Permission[]>(`/permissions/${module}`)
}
