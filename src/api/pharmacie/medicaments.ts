import api from "@/lib/api";

// =========================
// Types
// =========================
export interface Medicament {
  id: string;
  name: string;
  description?: string;
  dosage?: string;
  form?: string;
  manufacturer?: string;
  categoryId: string;
  price: number;
  stockQuantity: number;
  minimumStock: number;
  tenantId: string;
  status: string; // ACTIVE / INACTIVE
  createdAt: string;
  updatedAt: string;
}

export interface MedicamentCreateDTO {
  name: string;
  description?: string;
  dosage?: string;
  form?: string;
  manufacturer?: string;
  categoryId: string;
  price: number;
  stockQuantity: number;
  minimumStock: number;
  tenantId: string;
  status?: string;
}

export interface MedicamentUpdateDTO {
  name?: string;
  description?: string;
  dosage?: string;
  form?: string;
  manufacturer?: string;
  categoryId?: string;
  price?: number;
  stockQuantity?: number;
  minimumStock?: number;
  status?: string;
}

// =========================
// API Helpers
// =========================

export const getMedicamentsByTenant = async (tenantId: string) => {
  return api.get<Medicament[]>(`/pharmacy/medicaments/tenant/${tenantId}`);
};

export const getMedicamentById = async (id: string) => {
  return api.get<Medicament>(`/pharmacy/medicaments/${id}`);
};

export const createMedicament = async (data: MedicamentCreateDTO) => {
  return api.post<Medicament>(`/pharmacy/medicaments`, data);
};

export const updateMedicament = async (
  id: string,
  data: MedicamentUpdateDTO,
) => {
  return api.put<Medicament>(`/pharmacy/medicaments/${id}`, data);
};

export const deleteMedicament = async (id: string) => {
  return api.delete(`/pharmacy/medicaments/${id}`);
};

export const updateMedicamentStatus = async (id: string, status: string) => {
  return api.patch<Medicament>(
    `/pharmacy/medicaments/${id}/status?status=${status}`,
  );
};
