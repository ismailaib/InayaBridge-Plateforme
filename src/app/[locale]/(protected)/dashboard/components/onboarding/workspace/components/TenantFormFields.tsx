"use client"

import React from "react"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { RadioCardGroup, RadioCardItem } from "@/components/RadioCardGroup"
import { cx } from "@/lib/utils"
import { StatusItem, TenantFormData } from "../types/tenant"
import useTranslations from "@/lib/i18n/useTranslations"

interface TenantFormFieldsProps {
  formData: TenantFormData
  status: StatusItem[]
  isLoading: boolean
  onFieldChange: (
    field: keyof TenantFormData,
    value: string | boolean,
  ) => void
}

export const TenantFormFields: React.FC<TenantFormFieldsProps> = ({
  formData,
  status,
  isLoading,
  onFieldChange,
}) => {
  const t = useTranslations("dashboard.tenantForm")

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="tenant-name" className="font-medium">
          {t("name")} <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          id="tenant-name"
          name="tenant-name"
          placeholder={t("namePlaceholder")}
          value={formData.name}
          onChange={(e) => onFieldChange("name", e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tenant-description" className="font-medium">
          {t("descriptionLabel")}
        </Label>
        <Input
          type="text"
          id="tenant-description"
          name="tenant-description"
          placeholder={t("descriptionPlaceholder")}
          value={formData.description}
          onChange={(e) => onFieldChange("description", e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label className="font-medium">
          {t("type")} <span className="text-red-500">*</span>
        </Label>
        <RadioCardGroup
          value={formData.tenantTypeId}
          onValueChange={(value) => onFieldChange("tenantTypeId", value)}
          className="flex flex-wrap gap-3 [html[lang=ar]_&]:justify-end"
          disabled={isLoading}
        >
          {status.map((item) => (
            <RadioCardItem
              value={item.id}
              key={item.id}
              className={cx(
                "w-fit px-2.5 py-2 text-sm text-gray-900 dark:text-gray-50",
                "data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white",
                "data-[state=checked]:dark:bg-emerald-500 data-[state=checked]:dark:text-white",
              )}
            >
              {item.label || item.type}
            </RadioCardItem>
          ))}
        </RadioCardGroup>
      </div>
    </>
  )
}
