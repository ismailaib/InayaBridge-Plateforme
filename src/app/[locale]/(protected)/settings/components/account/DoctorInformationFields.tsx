import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { DoctorInformationFieldsProps } from "@/types/settings";
import { BriefcaseMedical } from "lucide-react";

export const DoctorInformationFields = ({
    t,
    formData,
    errors,
    onInputChange,
    onInputBlur,
}: DoctorInformationFieldsProps) => (
    <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-4 flex flex-row gap-2 items-center"><BriefcaseMedical /> Professional Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div>
                <Label htmlFor="specialty">{t('personalInfo.speciality')}</Label>
                <Input
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={onInputChange}
                    onBlur={onInputBlur}
                    className="mt-2"
                    maxLength={80}
                    aria-invalid={!!errors.specialty}
                    aria-describedby={errors.specialty ? 'specialty-error' : undefined}
                />
                {errors.specialty && (
                    <p id="specialty-error" className="mt-1 text-xs text-red-600">
                        {errors.specialty}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={onInputChange}
                    onBlur={onInputBlur}
                    className="mt-2"
                    maxLength={20}
                    aria-invalid={!!errors.licenseNumber}
                    aria-describedby={errors.licenseNumber ? 'licenseNumber-error' : undefined}
                />
                {errors.licenseNumber && (
                    <p id="licenseNumber-error" className="mt-1 text-xs text-red-600">
                        {errors.licenseNumber}
                    </p>
                )}
            </div>
        </div>
    </div>
);