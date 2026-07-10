import useTranslations from "@/lib/i18n/useTranslations";
import { ChangeEvent, FormEvent, MutableRefObject } from "react";
import type { FocusEvent } from 'react';




export const NAME_REGEX = /^[A-Za-z\s'-]+$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^\+212\d{9}$/;
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;


export type TranslationFn = ReturnType<typeof useTranslations>;


export interface AccountFormData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    gender: 'male' | 'female' | 'other' | undefined;
    email: string;
    specialty?: string;
    licenseNumber?: string;
    profileImageUrl?: string | null;
}

export interface PasswordData {
    currentPassword: string;
    newPassword: string;
}

export type ProfileField =
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'phoneNumber'
    | 'address'
    | 'gender'
    | 'specialty'
    | 'licenseNumber';
export type PasswordField = keyof PasswordData;


export type FieldKey = ProfileField | PasswordField;

export interface ProfileSectionProps {
    t: TranslationFn;
    formData: AccountFormData;
    errors: Partial<Record<FieldKey, string>>;
    isDoctor: boolean;
    fileInputRef: MutableRefObject<HTMLInputElement | null>;
    avatarUrl: string | null;
    uploading: boolean;
    hasChanges: boolean;
    onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onInputBlur: (event: FocusEvent<HTMLInputElement>) => void;
    onSelectChange: (value: string) => void;
    onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
    onUpdateProfile: () => void;
    onResetProfile: () => void;
    onTriggerUpload: () => void;
}

export interface AvatarUploaderProps {
    formData: AccountFormData;
    avatarUrl: string | null;
    uploading: boolean;
    fileInputRef: MutableRefObject<HTMLInputElement | null>;
    onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
    onTriggerUpload: () => void;
}

export interface ProfileDetailsProps {
    t: TranslationFn;
    formData: AccountFormData;
    errors: Partial<Record<FieldKey, string>>;
    isDoctor: boolean;
    onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onInputBlur: (event: FocusEvent<HTMLInputElement>) => void;
    onSelectChange: (value: string) => void;
}

export interface PersonalInformationFieldsProps {
    t: TranslationFn;
    formData: AccountFormData;
    errors: Partial<Record<FieldKey, string>>;
    onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onInputBlur: (event: FocusEvent<HTMLInputElement>) => void;
    onSelectChange: (value: string) => void;
}

export interface DoctorInformationFieldsProps {
    t: TranslationFn;
    formData: AccountFormData;
    errors: Partial<Record<FieldKey, string>>;
    onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onInputBlur: (event: FocusEvent<HTMLInputElement>) => void;
}

export interface ProfileActionsProps {
    t: TranslationFn;
    hasChanges: boolean;
    onUpdateProfile: () => void;
    onResetProfile: () => void;
}

export interface PasswordSectionProps {
    t: TranslationFn;
    passwordData: PasswordData;
    errors: Partial<Record<FieldKey, string>>;
    onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onInputBlur: (event: FocusEvent<HTMLInputElement>) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export interface SectionIntroProps {
    t: TranslationFn;
}