export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const TOAST_MESSAGES = {
    TENANT_ERROR: "Impossible de récupérer les informations de l'établissement.",
    EMAIL_REQUIRED: "Veuillez saisir une adresse e-mail valide !",
    EMAIL_INVALID: "Veuillez saisir une adresse e-mail valide !",
    INVITATION_SUCCESS: (email: string) => `Une invitation a été envoyée à ${email} !`,
    INVITATION_ERROR: "Une erreur est survenue lors de l'envoi de l'invitation.",
    FETCH_ERROR: "Impossible de récupérer la liste des membres.",
} as const;

export const STATUS_CONFIG = {
    DECLINED: { bg: 'bg-red-700 dark:bg-red-400/10', text: 'text-white dark:text-red-700', label: 'Réfusé' },
    ACCEPTED: { bg: 'bg-green-700 dark:bg-green-400/10', text: 'text-white dark:text-green-700', label: 'Accepté' },
    PENDING: { bg: 'bg-yellow-500 dark:bg-yellow-400/10', text: 'text-white dark:text-yellow-700', label: 'En attente' },
    EXPIRED: { bg: 'bg-gray-500 dark:bg-gray-400/10', text: 'text-white dark:text-gray-500', label: 'Expiré' },
    DEFAULT: { bg: 'bg-gray-400/10', text: 'text-gray-400 dark:text-gray-400', label: 'Inconnu' },
} as const;