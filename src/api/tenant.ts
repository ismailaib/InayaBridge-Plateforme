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

export interface UpdateTenantPlanPayload {
  tenantId: string;
  subscriptionPlan: "ESSENTIAL" | "PLUS" | "PRO";
}


/* ========== API helpers ========== */
export const onboardingStatus = (id: string) =>
  api.get(`/onboarding/${id}/status`);

export const workspaceStatus = () => api.get(`/tenant-types`);

export const workspaceCreation = (payload: workspaceCreation) =>
  api.post(`/tenants`, {
    name: payload.name,
    description: payload.description,
    ownerId: payload.ownerId,
    tenantTypeId: payload.tenantTypeId,
    isPrivate: payload.isPrivate,
  });

export const getTenant = (id: string) => api.get(`/tenants/${id}`);

export const updateTenantPlan = (payload: UpdateTenantPlanPayload) =>
  api.put(`/tenants/${payload.tenantId}/subscription`, {
    subscriptionPlan: payload.subscriptionPlan,
  });