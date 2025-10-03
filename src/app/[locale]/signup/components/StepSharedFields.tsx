"use client";

import {
  registerDoctor,
  registerDoctorProfile,
  registerPatient,
} from "@/api/profile";
import { Conditions } from "@/app/Conditions";
import { Politique } from "@/app/Politique";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { useAuth } from "@/lib/auth-context";
import { useTranslationsContext } from "@/lib/i18n/TranslationsProvider";
import useTranslations from "@/lib/i18n/useTranslations";
import { toast } from "@/lib/useToast";
import confetti from "canvas-confetti";

import { useMemo, useState } from "react";

import Link from "next/link";

interface ValidationErrors {
  [key: string]: string;
}

export default function StepSharedFields({
  accountType,
  speciality,
  additionalFields,
  onSuccess,
}: {
  accountType: "doctor" | "patient";
  speciality?: string;
  additionalFields?: React.ReactNode;
  onSuccess?: () => void;
}) {
  const { login } = useAuth();
  const t = useTranslations("signup.shared");
  const { locale } = useTranslationsContext();
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [gender, setGender] = useState<string>("");

  const validationMessages = useMemo(
    () => t.raw<Record<string, string>>("validation") ?? {},
    [t],
  );
  const backendMessages = useMemo(
    () => t.raw<Record<string, string>>("backendErrors") ?? {},
    [t],
  );
  const apiMessages = useMemo(
    () => t.raw<Record<string, string>>("apiErrors") ?? {},
    [t],
  );
  const genderOptions = useMemo(() => {
    const raw = t.raw<Record<string, string>>("fields.gender.options") ?? {};
    return Object.entries(raw).map(([value, label]) => ({ value, label }));
  }, [t]);

  /* --------------------- Frontend Validation --------------------- */
  const validateForm = (formData: FormData): ValidationErrors => {
    const errors: ValidationErrors = {};
    const data = Object.fromEntries(formData);

    if (!data.firstName || (data.firstName as string).trim().length < 2) {
      errors.firstName = validationMessages.firstName ?? "";
    }

    if (!data.lastName || (data.lastName as string).trim().length < 2) {
      errors.lastName = validationMessages.lastName ?? "";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email as string)) {
      errors.email = validationMessages.email ?? "";
    }

    const phoneRegex = /^(?:\+212|0)[0-9]{9}$/;
    if (!data.phone || !phoneRegex.test(data.phone as string)) {
      errors.phone = validationMessages.phone ?? "";
    }

    if (!data.adress || (data.adress as string).trim().length < 5) {
      errors.adress = validationMessages.address ?? "";
    }

    if (!data.password || (data.password as string).length < 8) {
      errors.password = validationMessages.password ?? "";
    }

    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = validationMessages.confirmPassword ?? "";
    }

    if (accountType === "patient") {
      if (!data.gender) {
        errors.gender = validationMessages.gender ?? "";
      }

      const cinRegex = /^[A-Z]{1,2}[0-9]{6}$/;
      if (!data.cin || !cinRegex.test(data.cin as string)) {
        errors.cin = validationMessages.cin ?? "";
      }
    }

    return errors;
  };

  /* --------------------- Error Message Handling --------------------- */
  const getErrorMessage = (error: any): string => {
    if (error?.details) {
      const firstField = Object.keys(error.details)[0];
      const translated = backendMessages[firstField];
      if (translated) return translated;
      const firstError = error.details[firstField];
      if (typeof firstError === "string") return firstError;
      return apiMessages.default ?? "";
    }

    if (error?.message) {
      const apiErrorMap: Record<string, string> = {
        "Email already exists": "emailExists",
        "Phone number already exists": "phoneExists",
        "CIN already exists": "cinExists",
        "Invalid phone number": "invalidPhone",
        "Validation Failed": "validationFailed",
      };

      const translationKey = apiErrorMap[error.message];
      if (translationKey && apiMessages[translationKey]) {
        return apiMessages[translationKey];
      }

      return error.message;
    }

    return apiMessages.default ?? "";
  };

  /* --------------------- submit --------------------- */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setValidationErrors({});

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      const firstError = Object.values(errors).find(Boolean);
      if (firstError) {
        toast({
          title: t("toast.validationTitle"),
          description: firstError,
          variant: "error",
          duration: 4000,
        });
      }
      return;
    }

    const fd = Object.fromEntries(formData);

    try {
      setLoading(true);

      if (accountType === "doctor") {
        const payload = {
          firstName: fd.firstName as string,
          lastName: fd.lastName as string,
          phoneNumber: fd.phone as string,
          adress: fd.adress as string,
          email: fd.email as string,
          password: fd.password as string,
          dateOfBirth: fd.dateOfBirth as string,
          speciality: speciality ?? "General",
          status: "PENDING_VERIFICATION" as string,
        };

        const { data } = await registerDoctor(payload);

        const profile = {
          tenantId: "",
          userId: data.user.id,
          licenseNumber: "",
          specialty: speciality ?? "General",
        };

        await registerDoctorProfile(profile);
        login({ token: data.token, user: data.user });
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        onSuccess?.();
      } else {
        const payload = {
          firstName: fd.firstName as string,
          lastName: fd.lastName as string,
          phoneNumber: fd.phone as string,
          adress: fd.adress as string,
          email: fd.email as string,
          password: fd.password as string,
          dateOfBirth: fd.dateOfBirth as string,
          gender: fd.gender as "male" | "female",
          cin: fd.cin as string,
        };

        const { data } = await registerPatient(payload);
        login({ token: data.token, user: data.user });
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        onSuccess?.();
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err?.response?.data || err);

      toast({
        title: t("toast.registrationErrorTitle"),
        description: errorMessage,
        variant: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExternalSubmit = () => {
    const form = document.querySelector("form");
    if (form) {
      form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }),
      );
    }
  };

  /* ----------------------- UI ----------------------- */
  return (
    <div className="grid grid-rows-[1fr_auto] h-full min-h-0">
      <div className="overflow-y-auto pr-2 -mr-2">
        <form onSubmit={handleSubmit} className="grid gap-4 pb-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("fields.firstName.label")}</Label>
              <Input
                id="firstName"
                name="firstName"
                required
                autoComplete="given-name"
                placeholder={t("fields.firstName.placeholder")}
                className={validationErrors.firstName ? "border-red-500" : ""}
              />
              {validationErrors.firstName && (
                <p className="text-xs text-red-500">
                  {validationErrors.firstName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t("fields.lastName.label")}</Label>
              <Input
                id="lastName"
                name="lastName"
                required
                autoComplete="family-name"
                placeholder={t("fields.lastName.placeholder")}
                className={validationErrors.lastName ? "border-red-500" : ""}
              />
              {validationErrors.lastName && (
                <p className="text-xs text-red-500">
                  {validationErrors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("fields.email.label")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={t("fields.email.placeholder")}
                className={validationErrors.email ? "border-red-500" : ""}
              />
              {validationErrors.email && (
                <p className="text-xs text-red-500">{validationErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("fields.phone.label")}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                pattern="^(?:\+212|0)[0-9]{9}$"
                autoComplete="tel"
                placeholder={t("fields.phone.placeholder")}
                className={validationErrors.phone ? "border-red-500" : ""}
              />
              {validationErrors.phone && (
                <p className="text-xs text-red-500">{validationErrors.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adress">{t("fields.address.label")}</Label>
            <Input
              id="adress"
              name="adress"
              required
              autoComplete="street-address"
              placeholder={t("fields.address.placeholder")}
              className={validationErrors.adress ? "border-red-500" : ""}
            />
            {validationErrors.adress && (
              <p className="text-xs text-red-500">{validationErrors.adress}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {accountType === "patient" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="gender">{t("fields.gender.label")}</Label>
                  <Select
                    value={gender}
                    onValueChange={setGender}
                    name="gender"
                  >
                    <SelectTrigger
                      className={`mx-auto h-10 ${validationErrors.gender ? "border-red-500" : ""}`}
                    >
                      <SelectValue
                        placeholder={t("fields.gender.placeholder")}
                        aria-label={gender}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          <span className="flex items-center gap-x-2">
                            {item.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.gender && (
                    <p className="text-xs text-red-500">
                      {validationErrors.gender}
                    </p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="cin">{t("fields.cin.label")}</Label>
                  <Input
                    id="cin"
                    name="cin"
                    required
                    placeholder={t("fields.cin.placeholder")}
                    pattern="^[A-Z]{1,2}[0-9]{6}$"
                    className={validationErrors.cin ? "border-red-500" : ""}
                  />
                  {validationErrors.cin && (
                    <p className="text-xs text-red-500">
                      {validationErrors.cin}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {t("fields.cin.helper")}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">{t("fields.password.label")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={8}
                required
                placeholder={t("fields.password.placeholder")}
                className={validationErrors.password ? "border-red-500" : ""}
              />
              {validationErrors.password && (
                <p className="text-xs text-red-500">
                  {validationErrors.password}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t("fields.confirmPassword.label")}
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                minLength={8}
                required
                placeholder={t("fields.confirmPassword.placeholder")}
                className={
                  validationErrors.confirmPassword ? "border-red-500" : ""
                }
              />
              {validationErrors.confirmPassword && (
                <p className="text-xs text-red-500">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {additionalFields && (
            <div className="space-y-4">{additionalFields}</div>
          )}

          <div className="pt-2">
            <p className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
              {t("terms.intro")}
              <Conditions />
              {t("terms.and")}
              <Politique />.
            </p>
          </div>
        </form>
      </div>

      <div className="flex justify-between gap-4 pt-4 bg-white dark:bg-gray-950">
        <Link href={`/${locale}/signup`}>
          <Button variant="secondary" type="button">
            {t("buttons.back")}
          </Button>
        </Link>

        <Button
          variant="primary"
          type="submit"
          className="w-full"
          isLoading={loading}
          loadingText={t("buttons.submitLoading")}
          onClick={handleExternalSubmit}
        >
          {t("buttons.submit")}
        </Button>
      </div>
    </div>
  );
}
