import { getDoctorProfile, updateDoctorProfile } from "@/api/profile";
import { workspaceCreation, workspaceStatus } from "@/api/tenant";
import { toast } from "@/lib/useToast";

import { useEffect, useState } from "react";

import type { StatusItem, TenantFormData } from "../types/tenant";

export const useTenantManagement = (onSuccess?: () => void) => {
  const [status, setStatus] = useState<StatusItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getUserFromStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      throw new Error("No user found in localStorage");
    }
    return JSON.parse(storedUser);
  };

  const fetchTenantTypes = async () => {
    try {
      const response = await workspaceStatus();
      const data = Array.isArray(response.data) ? response.data : [];
      setStatus(data);
    } catch (error) {
      console.error("Error fetching tenant types:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les types d'établissement.",
        variant: "error",
        duration: 3000,
      });
    }
  };

  const createTenant = async (formData: TenantFormData) => {
    setIsLoading(true);

    try {
      const user = getUserFromStorage();

      const payload = {
        name: formData.name,
        description: formData.description,
        ownerId: user.id,
        tenantTypeId: formData.tenantTypeId,
        isPrivate: formData.isPrivate,
      };

      const tenantResponse = await workspaceCreation(payload);
      const doctorProfile = await getDoctorProfile(user.id);

      const userPayload = {
        userId: user.id,
        tenantId: tenantResponse.data.id,
      };

      await updateDoctorProfile(userPayload, String(doctorProfile.data.id));

      toast({
        title: "Succès",
        description: "Établissement créé avec succès !",
        variant: "success",
        duration: 3000,
      });

      setIsDialogOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating tenant:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la création de l'établissement.",
        variant: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantTypes();
  }, []);

  return {
    status,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    createTenant,
  };
};
