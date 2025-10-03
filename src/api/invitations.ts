import api from "@/lib/api";

export interface workspaceCreation {
  name: string;
  description: string;
  ownerId: string;
  tenantTypeId: string;
  isPrivate: boolean;
}

export interface RegisterDoctor {
  tenantId: string;
  userId: string;
  specialty: string;
  licenseNumber: string;
}

export interface SendInvitation {
  email: string;
}

export interface AcceptInvitation {
  firstName: string;
  lastName: string;
  password: string;
}

/* ========== API helpers ========== */
export const sendInvitation = (tenantId: string, payload: SendInvitation) =>
  api.post(`/invitations/send?tenantId=${tenantId}`, payload);

export const getInvitations = (id: string) =>
  api.get(`/invitations?tenantId=${id}`);

export const getInvitation = (id: string) => api.get(`/invitations/${id}`);

export const acceptInvitations = (payload: AcceptInvitation, token: string) =>
  api.post(`/invitations/accept/${token}`, payload);

export const cancelInvitation = (invitationId: string, tenantId: string) =>
  api.delete(
    `/invitations/${invitationId}?tenantId=${tenantId}&invitationId=${invitationId}`,
  );

export const recentInvitation = (invitationId: string, tenantId: string) =>
  api.post(
    `/invitations/resend/${invitationId}?tenantId=${tenantId}&invitationId=${invitationId}`,
  );
