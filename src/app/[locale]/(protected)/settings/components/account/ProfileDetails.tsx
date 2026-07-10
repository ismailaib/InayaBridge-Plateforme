import { Divider } from "@/components/Divider";
import { ProfileDetailsProps } from "@/types/settings";
import { DoctorInformationFields } from "./DoctorInformationFields";
import { PersonalInformationFields } from "./PersonalInformationFields";

export const ProfileDetails = ({
    t,
    formData,
    errors,
    isDoctor,
    onInputChange,
    onInputBlur,
    onSelectChange,
}: ProfileDetailsProps) => (
    <div className="space-y-6">
        <PersonalInformationFields
            t={t}
            formData={formData}
            errors={errors}
            onInputChange={onInputChange}
            onInputBlur={onInputBlur}
            onSelectChange={onSelectChange}
        />

        {isDoctor && (
            <>
                <Divider />
                <DoctorInformationFields
                    t={t}
                    formData={formData}
                    errors={errors}
                    onInputChange={onInputChange}
                    onInputBlur={onInputBlur}
                />
            </>
        )}
    </div>
);