import api from "@/lib/api";

// =========================
// Types
// =========================
export interface Category {
  id: string;
  name: string;
  tenantId: string;
  status: string; // ACTIVE / INACTIVE
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreateDTO {
  name: string;
  tenantId: string;
  status?: string;
}

export interface CategoryUpdateDTO {
  name?: string;
  status?: string;
}

// =========================
// API Helpers
// =========================

export const getCategoriesByTenant = async (tenantId: string) => {
  return api.get<Category[]>(`/pharmacy/categories/tenant/${tenantId}`);
};

export const getCategoryById = async (id: string) => {
  return api.get<Category>(`/pharmacy/categories/${id}`);
};

export const createCategory = async (data: CategoryCreateDTO) => {
  return api.post<Category>(`/pharmacy/categories`, data);
};

export const updateCategory = async (id: string, data: CategoryUpdateDTO) => {
  return api.put<Category>(`/pharmacy/categories/${id}`, data);
};

export const deleteCategory = async (id: string) => {
  return api.delete(`/pharmacy/categories/${id}`);
};

export const updateCategoryStatus = async (id: string, status: string) => {
  return api.patch<Category>(`/pharmacy/categories/${id}/status?status=${status}`);
};
