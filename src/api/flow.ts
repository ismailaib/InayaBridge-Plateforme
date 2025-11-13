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
  groupId: string;
  id: string;
  doctorProfileId: string;
  name: string;
  schema: string;
  version: number;
  active: boolean;
  createdAt: string;
}

export interface FlowInstanceDto {
  id: string;
  templateId: string;
  appointmentId: string;
  data: string;
  createdAt?: string;
  startTime?: string;
}

// =========================
// API Helpers (Flow Templates & Instances)
// =========================

// Create new flow template
export const createFlowTemplate = (data: FlowTemplateCreateDTO) => {
  return api.post<FlowTemplateDto>("/flows/template", data);
};

// Restore a flow to latest (creates new version)
export const restoreFlowTemplate = (templateId: string) => {
  return api.post<FlowTemplateDto>(`/flows/template/${templateId}/restore`);
};

// Get all templates for a doctor
export const getTemplatesByDoctor = (doctorId: string) => {
  return api.get<FlowTemplateDto[]>(`/flows/template/doctor/${doctorId}`);
};

// Get single template by ID
export const getTemplateById = (templateId: string) => {
  return api.get<FlowTemplateDto>(`/flows/template/${templateId}`);
};

// Update flow name
export const updateFlowName = (groupId: string, newName: string) => {
  return api.patch<FlowTemplateDto>(`/flows/template/${groupId}/name`, null, {
    params: { newName },
  });
};

// Delete template (and all its versions)
export const deleteFlowTemplate = (templateId: string) => {
  return api.delete(`/flows/template/${templateId}`);
};

// Create flow instance from a template
export interface CreateFlowInstanceDto {
  templateId: string;
  appointmentId: string;
}

export const createFlowInstance = (data: CreateFlowInstanceDto) => {
  return api.post<string>("/flows/instance", data);
};

// Get flow instance by appointment
export const getFlowInstanceByAppointment = (appointmentId: string) => {
  return api.get<FlowInstanceDto>(
    `/flows/instance/appointment/${appointmentId}`,
  );
};

export const updateFlowInstance = (
  instanceId: string,
  data: { data?: string; startTime?: string },
) => {
  return api.patch<FlowInstanceDto>(`/flows/instance/${instanceId}`, data);
};


// Delete flow instance
export const deleteFlowInstance = (instanceId: string) => {
  return api.delete(`/flows/instance/${instanceId}`);
};
