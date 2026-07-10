export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const TOAST_MESSAGE_KEYS = {
  TENANT_ERROR: "toasts.tenantError",
  EMAIL_REQUIRED: "validation.emailRequired",
  EMAIL_INVALID: "validation.emailInvalid",
  INVITATION_SUCCESS: "toasts.invitationSuccess",
  INVITATION_ERROR: "toasts.invitationError",
} as const;

export const STATUS_CONFIG = {
  DECLINED: {
    bg: "bg-red-700 dark:bg-red-400/10",
    text: "text-white dark:text-red-700",
    labelKey: "status.declined",
  },
  ACCEPTED: {
    bg: "bg-blue-700 dark:bg-blue-400/10",
    text: "text-white dark:text-blue-700",
    labelKey: "status.accepted",
  },
  PENDING: {
    bg: "bg-yellow-500 dark:bg-yellow-400/10",
    text: "text-white dark:text-yellow-700",
    labelKey: "status.pending",
  },
  EXPIRED: {
    bg: "bg-gray-500 dark:bg-gray-400/10",
    text: "text-white dark:text-gray-500",
    labelKey: "status.expired",
  },
  DEFAULT: {
    bg: "bg-gray-400/10",
    text: "text-gray-400 dark:text-gray-400",
    labelKey: "status.unknown",
  },
} as const;
