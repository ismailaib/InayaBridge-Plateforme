import api from "@/lib/api";

// =========================
// Types
// =========================
export interface Folder {
  id: string;
  title: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FolderCreateDTO {
  tenantId: string;
  title: string;
  parentId?: string;
}

export interface FolderUpdateDTO {
  title?: string;
  parentId?: string;
}

export interface PatientDocument {
  id: string;
  patientProfileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  storageProvider: string;
  folderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientDocumentCreateDTO {
  patientProfileId: string;
  fileName: string;
  folderId?: string;
}

export interface PatientDocumentUpdateDTO {
  fileName?: string;
  folderId?: string;
}

// =========================
// Folder API Helpers
// =========================
export const getAllFolders = async (id:string) => {
  return api.get<Folder[]>(`/folders?tenantId=${id}`).then(res => res.data);
};

export const getFolderById = async (id: string) => {
  return api.get<Folder>(`/folders/${id}`).then(res => res.data);
};

export const createFolder = async (data: FolderCreateDTO) => {
  return api.post<Folder>(`/folders`, data).then(res => res.data);
};

export const updateFolder = async (id: string, data: FolderUpdateDTO) => {
  return api.put<Folder>(`/folders/${id}`, data).then(res => res.data);
};

export const deleteFolder = async (id: string) => {
  return api.delete(`/folders/${id}`).then(res => res.data);
};

// =========================
// Document API Helpers
// =========================

/**
 * Get all documents for a patient
 */
export const getDocumentsByPatient = async (patientId: string) => {
  return api.get<PatientDocument[]>(`/documents/patient/${patientId}`).then(res => res.data);
};

/**
 * Get a single document by ID
 */
export const getDocumentById = async (id: string) => {
  return api.get<PatientDocument>(`/documents/${id}`).then(res => res.data);
};

/**
 * Create a new document (multipart/form-data for file upload)
 */
export const createDocument = async (data: PatientDocumentCreateDTO, file: File) => {
  const formData = new FormData();
  formData.append("patientProfileId", data.patientProfileId);
  formData.append("fileName", data.fileName);
  if (data.folderId) formData.append("folderId", data.folderId);
  formData.append("file", file);

  return api.post<PatientDocument>(`/documents`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then(res => res.data);
};

/**
 * Update an existing document (optional file upload)
 */
export const updateDocument = async (id: string, data: PatientDocumentUpdateDTO, file?: File) => {
  const formData = new FormData();
  if (data.fileName) formData.append("fileName", data.fileName);
  if (data.folderId) formData.append("folderId", data.folderId);
  if (file) formData.append("file", file);

  return api.put<PatientDocument>(`/documents/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then(res => res.data);
};

/**
 * Delete a document by ID
 */
export const deleteDocument = async (id: string) => {
  return api.delete(`/documents/${id}`).then(res => res.data);
};
