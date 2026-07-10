import api from "@/lib/api";

/* ===================== Interfaces ===================== */

export interface WorkspaceCreation {
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

/* ---------- Tenant Preferences ---------- */
export interface TenantPreferences {
  theme: "light" | "dark" | "system";
  brandColor: string;
  dashboardLayout: string;
  dashboardModules: Record<string, boolean>;
  useCustomLogo: boolean;
  enableTeleconsultation: boolean;
  enableLabIntegration: boolean;
  enableBilling: boolean;
  enforce2FA: boolean;
  enableAuditLogs: boolean;
  timezone: string;
}

/* ===================== API Helpers ===================== */

// 🟢 Get onboarding status
export const onboardingStatus = (id: string) =>
  api.get(`/onboarding/${id}/status`);

// 🟢 Get available tenant types
export const workspaceStatus = () => api.get(`/tenant-types`);

// 🟢 Create workspace (tenant)
export const workspaceCreation = (payload: WorkspaceCreation) =>
  api.post(`/tenants`, {
    name: payload.name,
    description: payload.description,
    ownerId: payload.ownerId,
    tenantTypeId: payload.tenantTypeId,
    isPrivate: payload.isPrivate,
  });

// 🟢 Get tenant by ID
export const getTenant = (id: string) => api.get(`/tenants/${id}`);

// 🟢 Update tenant subscription plan
export const updateTenantPlan = (payload: UpdateTenantPlanPayload) =>
  api.put(`/tenants/${payload.tenantId}/subscription`, {
    subscriptionPlan: payload.subscriptionPlan,
  });

// 🟢 Upload tenant logo (Cloudinary-backed endpoint)
export const uploadTenantLogo = async (tenantId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/tenants/${tenantId}/logo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ===================== Tenant Preferences ===================== */

// 🟢 Get tenant preferences
export const getTenantPreferences = (tenantId: string) =>
  api.get(`/tenants/${tenantId}/preferences`);

// 🟢 Update tenant preferences
export const updateTenantPreferences = (
  tenantId: string,
  payload: TenantPreferences
) => api.put(`/tenants/${tenantId}/preferences`, payload);

// 🟢 Create default tenant preferences (if needed)
export const createDefaultTenantPreferences = (tenantId: string) =>
  api.post(`/tenants/${tenantId}/preferences/default`);
