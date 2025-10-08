import { toast } from "@/lib/useToast";

import { EMAIL_REGEX } from "./constants";

export const validateEmail = (email: string) => {
  if (!email.trim()) return "validation.emailRequired";
  if (!EMAIL_REGEX.test(email)) return "validation.emailInvalid";
  return null;
};

export const formatDate = (
  dateString: string,
  locale?: string,
  fallback?: string,
) => {
  try {
    return new Date(dateString).toLocaleDateString(locale);
  } catch {
    return fallback ?? "";
  }
};

export const showToast = (
  type: "success" | "error",
  title: string,
  description: string,
) => {
  toast({ title, description, variant: type, duration: 2000 });
};
