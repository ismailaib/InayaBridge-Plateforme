import api from "@/lib/api";

// =========================
// Types
// =========================
export interface FlowTemplateCreateDTO {
  doctorProfileId: string;
  name: string;
  schema: string;
  active?: boolean;
}

export interface FlowTemplateDto {
  id: string;
  doctorProfileId: string;
  name: string;
  schema: string;
  version: number;
  active: boolean;
}

// =========================
// API Helpers
// =========================
export const createFlowTemplate = (data: FlowTemplateCreateDTO) => {
  return api.post<FlowTemplateDto>("/flows/templates", data);
};

export const getTemplatesByDoctor = (doctorId: string) => {
  return api.get<FlowTemplateDto[]>(`/flows/templates/doctor/${doctorId}`);
};
