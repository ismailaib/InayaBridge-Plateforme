'use client';

import { Button } from "@/components/Button";
import { AvatarUploaderProps } from "@/types/settings";
import Image from "next/image";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { useTranslationsContext } from "@/lib/i18n/TranslationsProvider";
import { getDirection } from "@/lib/i18n/i18n";
import { ImagePlus } from "lucide-react";

export const AvatarUploader = ({
  formData,
  avatarUrl,
  uploading,
  fileInputRef,
  onImageUpload,
  onTriggerUpload,
}: AvatarUploaderProps) => {
  const t = useTranslations("settings.settings");
  const { locale } = useTranslationsContext();
  const dir = getDirection(locale);

  return (
    <div
      dir={dir}
      className="flex flex-col items-center pb-6 border-b border-gray-200 dark:border-gray-800"
    >
      <div className="relative group">
        <div className="flex items-center justify-center w-32 h-32 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-hidden">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Profile"
              width={333}
              height={333}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-4xl font-semibold text-gray-400 dark:text-gray-600">
              {formData.firstName?.[0]?.toUpperCase()}
              {formData.lastName?.[0]?.toUpperCase()}
            </span>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={onImageUpload}
          className="hidden"
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mt-4">
        {formData.firstName} {formData.lastName}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {formData.email}
      </p>

      <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
        {t("profileImage.description") ||
          "Recommended max. size 10 MB – Accepted: jpg, png"}
      </p>
      <Button
        onClick={onTriggerUpload}
        variant="secondary"
        className="mt-3 flex flex-row items-center gap-2"
        disabled={uploading}
      >
        <ImagePlus width={18}/>
        {uploading ? "Uploading..." : t("profileImage.button") || "Change Photo"}
      </Button>
    </div>
  );
};
