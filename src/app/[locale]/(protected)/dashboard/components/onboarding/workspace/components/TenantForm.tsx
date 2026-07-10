"use client";

import { getUserProfile } from "@/api/profile";
import { Button } from "@/components/Button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";
import useTranslations from "@/lib/i18n/useTranslations";
import { useUserStore } from "@/store/useAuthStore";

import React, { useState } from "react";

import { StatusItem, TenantFormData } from "../types/tenant";
import { TenantFormFields } from "./TenantFormFields";
import { TenantPrivacySettings } from "./TenantPrivacySettings";

interface TenantFormProps {
  status: StatusItem[];
  isLoading: boolean;
  onSubmit: (formData: TenantFormData) => Promise<void>;
}

const initialFormData: TenantFormData = {
  name: "",
  description: "",
  tenantTypeId: "",
  isPrivate: false,
};

export const TenantForm: React.FC<TenantFormProps> = ({
  status,
  isLoading,
  onSubmit,
}) => {
  const t = useTranslations("dashboard.tenantForm");

  const [formData, setFormData] = useState<TenantFormData>(() => ({
    ...initialFormData,
    tenantTypeId: status.length > 0 ? status[0].id : "",
  }));

  const setUser = useUserStore((state) => state.setUser);

  const handleFieldChange = (
    field: keyof TenantFormData,
    value: string | boolean,
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.tenantTypeId) {
      return;
    }

    await onSubmit(formData);

    const storedUser = localStorage.getItem("user");
    const parsed = JSON.parse(storedUser ?? "");

    if (!storedUser) {
      console.error("No userId found in local storage");
      return;
    }

    const { data: fullUserInfo } = await getUserProfile(parsed.id);
    setUser(fullUserInfo);
    localStorage.setItem("user", JSON.stringify(fullUserInfo));

    setFormData({
      ...initialFormData,
      tenantTypeId: status.length > 0 ? status[0].id : "",
    });
  };

  const isFormValid = formData.name.trim() && formData.tenantTypeId;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 ">
      <DialogHeader className="[html[lang=ar]_&]:pt-8 [html[lang=ar]_&]:text-right">
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogDescription className="text-sm leading-6">
          {t("description")}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 [html[lang=ar]_&]:text-right">
        <TenantFormFields
          formData={formData}
          status={status}
          isLoading={isLoading}
          onFieldChange={handleFieldChange}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !isFormValid}
      >
        {isLoading ? t("submitting") : t("submit")}
      </Button>

      <TenantPrivacySettings
        isPrivate={formData.isPrivate}
        isLoading={isLoading}
        onChange={(checked) => handleFieldChange("isPrivate", checked)}
      />
    </form>
  );
};
