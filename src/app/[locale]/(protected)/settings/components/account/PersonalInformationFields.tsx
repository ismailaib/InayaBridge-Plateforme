import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/Select";
import { getDirection } from "@/lib/i18n/i18n";
import { useTranslationsContext } from "@/lib/i18n/TranslationsProvider";
import { PersonalInformationFieldsProps } from "@/types/settings";
import { FileUser } from "lucide-react";

export function PersonalInformationFields({
    t,
    formData,
    errors,
    onInputChange,
    onInputBlur,
    onSelectChange,
}: PersonalInformationFieldsProps) {

    const { locale } = useTranslationsContext();
    const dir = getDirection(locale);

    return (
        <div>
            <h4 className="flex flex-row gap-2 items-center text-sm font-semibold text-gray-900 dark:text-gray-50 mb-4">
               <FileUser /> Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* First Name */}
                <div>
                    <Label htmlFor="firstName">{t("personalInfo.firstName")}</Label>
                    <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={onInputChange}
                        onBlur={onInputBlur}
                        className="mt-2"
                        required
                        minLength={2}
                        maxLength={50}
                        pattern="^[A-Za-z\s'-]+$"
                        aria-invalid={!!errors.firstName}
                        aria-describedby={errors.firstName ? "firstName-error" : undefined}
                    />
                    {errors.firstName && (
                        <p id="firstName-error" className="mt-1 text-xs text-red-600">
                            {errors.firstName}
                        </p>
                    )}
                </div>

                {/* Last Name */}
                <div>
                    <Label htmlFor="lastName">{t("personalInfo.lastName")}</Label>
                    <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={onInputChange}
                        onBlur={onInputBlur}
                        className="mt-2"
                        required
                        minLength={2}
                        maxLength={50}
                        pattern="^[A-Za-z\s'-]+$"
                        aria-invalid={!!errors.lastName}
                        aria-describedby={errors.lastName ? "lastName-error" : undefined}
                    />
                    {errors.lastName && (
                        <p id="lastName-error" className="mt-1 text-xs text-red-600">
                            {errors.lastName}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={onInputChange}
                        onBlur={onInputBlur}
                        className="mt-2"
                        required
                        maxLength={120}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        disabled
                    />
                    {errors.email && (
                        <p id="email-error" className="mt-1 text-xs text-red-600">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <Label htmlFor="phoneNumber">{t("personalInfo.phone")}</Label>
                    <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={onInputChange}
                        onBlur={onInputBlur}
                        className="mt-2"
                        required
                        pattern="^\+212\d{9}$"
                        minLength={13}
                        maxLength={13}
                        title="+212 followed by 9 digits"
                        aria-invalid={!!errors.phoneNumber}
                        aria-describedby={
                            errors.phoneNumber ? "phoneNumber-error" : undefined
                        }
                    />
                    {errors.phoneNumber && (
                        <p id="phoneNumber-error" className="mt-1 text-xs text-red-600">
                            {errors.phoneNumber}
                        </p>
                    )}
                </div>

                {/* Gender */}
                <div>
                    <Label htmlFor="gender">{t("personalInfo.gender")}</Label>
                    <Select value={formData.gender} onValueChange={onSelectChange} >
                        <SelectTrigger
                            id="gender"
                            className="mt-2"
                            aria-invalid={!!errors.gender}
                            aria-describedby={errors.gender ? "gender-error" : undefined}
                            aria-required="true"
                            style={{ direction: dir === "rtl" ? "rtl" : "ltr" }}
                        >
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">{t("personalInfo.male")}</SelectItem>
                            <SelectItem value="female">{t("personalInfo.female")}</SelectItem>
                            <SelectItem value="other">{t("personalInfo.other")}</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.gender && (
                        <p id="gender-error" className="mt-1 text-xs text-red-600">
                            {errors.gender}
                        </p>
                    )}
                </div>

                {/* Address */}
                <div>
                    <Label htmlFor="address">{t("personalInfo.address")}</Label>
                    <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={onInputChange}
                        onBlur={onInputBlur}
                        className="mt-2"
                        maxLength={120}
                        aria-invalid={!!errors.address}
                        aria-describedby={errors.address ? "address-error" : undefined}
                    />
                    {errors.address && (
                        <p id="address-error" className="mt-1 text-xs text-red-600">
                            {errors.address}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
