import api from '@/lib/api'

/* ============================================================
   🧠 Types
   ============================================================ */

export interface Employee {
  id: string
  tenantId: string
  email: string | null
  firstName: string | null
  lastName: string | null
  roleId: string | null
  roleName: string | null
  status: 'ACTIVE' | 'PENDING' | 'DECLINED' | string
  type: 'EMPLOYEE' | 'INVITATION'
  joinedAt: string
}

/* ============================================================
   🚀 API Functions
   ============================================================ */

/**
 * Get all employees and invitations for a given tenant.
 * Merged from DoctorProfiles + Invitations (backend aggregation)
 */
export const getEmployees = (tenantId: string) =>
  api.get<Employee[]>(`/employees?tenantId=${tenantId}`)

/**
 * Delete an invitation (if still pending)
 */
export const deleteEmployee = (employeeId: string, tenantId: string) =>
  api.delete(`/invitations/${employeeId}?tenantId=${tenantId}`)

/**
 * Resend an invitation email
 */
export const resendEmployeeInvite = (employeeId: string, tenantId: string) =>
  api.post(`/invitations/resend/${employeeId}?tenantId=${tenantId}`)

/**
 * Send a new employee invitation
 */
export const sendEmployeeInvite = (
  tenantId: string,
  payload: { email: string; roleId: string },
) => api.post(`/invitations/send?tenantId=${tenantId}`, payload)
