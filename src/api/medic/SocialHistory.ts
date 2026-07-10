import api from "@/lib/api";

// =========================
// Types
// =========================
export interface SocialHistory {
  patientProfileId: string;
  smoking: boolean;
  alcohol: boolean;
  drugs: boolean;
  diet?: string;
  exercise?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialHistoryDTO {
  smoking: boolean;
  alcohol: boolean;
  drugs: boolean;
  diet?: string;
  exercise?: string;
}

// =========================
// API Helpers
// =========================
export const getSocialHistoryByPatient = async (patientId: string) => {
  return api.get<SocialHistory>(`/medical/social-history/${patientId}`);
};

export const saveSocialHistory = async (patientId: string, data: SocialHistoryDTO) => {
  return api.post<SocialHistory>(`/medical/social-history/${patientId}`, data);
};
