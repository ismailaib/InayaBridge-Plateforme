import { ProfileSectionProps } from "@/types/settings";
import { AvatarUploader } from "./AvatarUploader";
import { ProfileActions } from "./ProfileActions";
import { ProfileDetails } from "./ProfileDetails";

export const ProfileSection = ({
    t,
    formData,
    errors,
    isDoctor,
    fileInputRef,
    avatarUrl,
    uploading,
    hasChanges,
    onInputChange,
    onInputBlur,
    onSelectChange,
    onImageUpload,
    onUpdateProfile,
    onResetProfile,
    onTriggerUpload,
}: ProfileSectionProps) => (
    <div className="space-y-8">
        <AvatarUploader
            formData={formData}
            avatarUrl={avatarUrl}
            uploading={uploading}
            fileInputRef={fileInputRef}
            onImageUpload={onImageUpload}
            onTriggerUpload={onTriggerUpload}
        />

        <ProfileDetails
            t={t}
            formData={formData}
            errors={errors}
            isDoctor={isDoctor}
            onInputChange={onInputChange}
            onInputBlur={onInputBlur}
            onSelectChange={onSelectChange}
        />

        <ProfileActions
            t={t}
            hasChanges={hasChanges}
            onUpdateProfile={onUpdateProfile}
            onResetProfile={onResetProfile}
        />
    </div>
);