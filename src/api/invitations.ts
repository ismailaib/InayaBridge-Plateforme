import api from "@/lib/api"

/* ========== Types ========== */

export interface SendInvitation {
  email: string
  roleId: string // tenant-specific role ID
}

export interface AcceptInvitation {
  firstName: string
  lastName: string
  password: string
}

/* ========== API Helpers ========== */

/**
 * Send an invitation to a user (doctor/assistant/etc.)
 * Includes tenantId as query param and payload with email + roleId
 */
export const sendInvitation = (tenantId: string, payload: SendInvitation) =>
  api.post(`/invitations/send?tenantId=${tenantId}`, payload)

/**
 * Fetch all invitations of a tenant
 */
export const getInvitations = (tenantId: string) =>
  api.get(`/invitations?tenantId=${tenantId}`)

/**
 * Fetch one invitation by id or token
 */
export const getInvitation = (idOrToken: string) =>
  api.get(`/invitations/${idOrToken}`)

/**
 * Accept an invitation by token (used by invited users)
 */
export const acceptInvitation = (payload: AcceptInvitation, token: string) =>
  api.post(`/invitations/accept/${token}`, payload)

/**
 * Delete (cancel) an invitation
 */
export const cancelInvitation = (invitationId: string, tenantId: string) =>
  api.delete(`/invitations/${invitationId}?tenantId=${tenantId}`)

/**
 * Resend an existing pending invitation
 */
export const resendInvitation = (invitationId: string, tenantId: string) =>
  api.post(`/invitations/resend/${invitationId}?tenantId=${tenantId}`)
