import { toast } from '@/lib/useToast';
import { EMAIL_REGEX, TOAST_MESSAGES } from './constants';

export const validateEmail = (email: string) => {
    if (!email.trim()) return TOAST_MESSAGES.EMAIL_REQUIRED;
    if (!EMAIL_REGEX.test(email)) return TOAST_MESSAGES.EMAIL_INVALID;
    return null;
};

export const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString();
    } catch {
        return 'Date invalide';
    }
};

export const showToast = (type: 'success' | 'error', title: string, description: string) => {
    toast({ title, description, variant: type, duration: 3000 });
};
