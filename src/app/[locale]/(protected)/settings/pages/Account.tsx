'use client';

import {
    changeUserPassword,
    getDoctorProfile,
    getUserProfile,
    updateDoctorProfile,
    updateUserProfile,
    uploadUserProfileImage,
} from '@/api/profile';
import { getDirection } from '@/lib/i18n/i18n';
import { useTranslationsContext } from '@/lib/i18n/TranslationsProvider';
import { useTranslations } from '@/lib/i18n/useTranslations';
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX, PHONE_REGEX } from '@/types/settings';
import type { AccountFormData, FieldKey, PasswordData, PasswordField, ProfileField } from '@/types/settings';
import type { ChangeEvent, FocusEvent, FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { showToast } from '../../dashboard/hooks/utils';
import { PasswordIntro } from '../components/account/PasswordIntro';
import { Card } from '@/components/Card';
import { PasswordSection } from '../components/account/PasswordSection';
import { ProfileSection } from '../components/account/ProfileSection';
import { SectionIntro } from '../components/account/SectionIntro';

const Account = () => {
    const t = useTranslations('settings.settings');
    const { locale } = useTranslationsContext();
    const dir = getDirection(locale);

    const [formData, setFormData] = useState<AccountFormData | null>(null);
    const [originalFormData, setOriginalFormData] = useState<AccountFormData | null>(null);
    const [passwordData, setPasswordData] = useState<PasswordData>({ currentPassword: '', newPassword: '' });
    const [userId, setUserId] = useState<string | null>(null);
    const [doctorId, setDoctorId] = useState<string | null>(null);
    const [isDoctor, setIsDoctor] = useState(false);
    const [loading, setLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const stored = localStorage.getItem('user');
                if (!stored) return;
                const parsed = JSON.parse(stored);
                const fetchedUserId = parsed?.id;
                if (!fetchedUserId) return;

                setUserId(fetchedUserId);

                const [userRes, doctorRes] = await Promise.all([
                    getUserProfile(fetchedUserId),
                    getDoctorProfile(fetchedUserId),
                ]);

                const user = userRes.data;
                const doctor = doctorRes.data;

                const profileData: AccountFormData = {
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    phoneNumber: user.phoneNumber || '',
                    address: user.address || '',
                    gender: user.gender || '',
                    email: user.email || '',
                    specialty: doctor?.specialty || '',
                    licenseNumber: doctor?.licenseNumber || '',
                    profileImageUrl: user.profileImageUrl || null,
                };

                setFormData(profileData);
                setOriginalFormData(profileData);
                setAvatarUrl(profileData.profileImageUrl || null);
                setDoctorId(doctor?.id || null);
                setIsDoctor(!!doctor);
            } catch (err) {
                console.error('Error loading profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => (prev ? { ...prev, gender: value as AccountFormData['gender'] } : null));
        validateField('gender', value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name) {
            validateField(name as FieldKey, value);
        }
    };

    function validateField(field: FieldKey, rawValue: string | undefined) {
        const value = rawValue ?? '';
        const trimmedValue = value.trim();
        let message = '';

        switch (field) {
            case 'firstName':
            case 'lastName': {
                if (!trimmedValue) {
                    message = field === 'firstName' ? t("cases.firstnameempty") : t("cases.lastnameempty");
                } else if (trimmedValue.length < 3 || trimmedValue.length > 50) {
                    message = t("cases.namelenght");
                } else if (!NAME_REGEX.test(trimmedValue)) {
                    message = t("cases.nameletter");
                }
                break;
            }
            case 'email': {
                if (!trimmedValue) {
                    message = t("cases.emailempty");
                } else if (!EMAIL_REGEX.test(trimmedValue)) {
                    message = t("cases.emailvalid");
                }
                break;
            }
            case 'phoneNumber': {
                if (!value) {
                    message =  t("cases.phoneempty");
                } else if (!PHONE_REGEX.test(value)) {
                    message = t("cases.phonevalid");
                }
                break;
            }
            case 'address': {
                if (trimmedValue && trimmedValue.length > 120) {
                    message = t("cases.addresslenght");
                }
                break;
            }
            case 'gender': {
                if (!value) {
                    message = t("cases.genderempty");
                }
                break;
            }
            case 'specialty': {
                if (trimmedValue && trimmedValue.length > 80) {
                    message =  t("cases.specialtlenght");
                }
                break;
            }
            case 'licenseNumber': {
                if (trimmedValue && trimmedValue.length > 20) {
                    message = t("cases.licenseNumberlenght");
                }
                break;
            }
            case 'currentPassword':
            case 'newPassword': {
                if (!value) {
                    message = field === 'currentPassword' ? t("cases.currentpasswordempty") :  t("cases.newpasswordempty") ;
                } else if (value.length < 8) {
                    message = t("cases.passwordlenght");
                } else if (!PASSWORD_REGEX.test(value)) {
                    message = t("cases.strongpassword");
                }
                break;
            }
            default:
                break;
        }

        setErrors((prev) => {
            const next = { ...prev };
            if (message) {
                if (next[field] === message) {
                    return prev;
                }
                next[field] = message;
                return next;
            }

            if (!(field in next)) {
                return prev;
            }

            delete next[field];
            return next;
        });

        return !message;
    }
    function validateProfileForm() {
        if (!formData) {
            return false;
        }

        let isValid = true;
        const fields: ProfileField[] = ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'gender'];

        if (isDoctor) {
            fields.push('specialty', 'licenseNumber');
        }

        fields.forEach((field) => {
            const value = field === 'gender' ? formData.gender : (formData[field] as string | undefined);
            if (!validateField(field, value)) {
                isValid = false;
            }
        });

        return isValid;
    }

    function validatePasswordForm() {
        let isValid = true;

        (['currentPassword', 'newPassword'] as PasswordField[]).forEach((field) => {
            if (!validateField(field, passwordData[field])) {
                isValid = false;
            }
        });

        return isValid;
    }

    function clearProfileErrors() {
        setErrors((prev) => {
            if (Object.keys(prev).length === 0) {
                return prev;
            }

            const next = { ...prev };
            (
                [
                    'firstName',
                    'lastName',
                    'email',
                    'phoneNumber',
                    'address',
                    'gender',
                    'specialty',
                    'licenseNumber',
                ] as FieldKey[]
            ).forEach((field) => {
                delete next[field];
            });

            return next;
        });
    }

    function clearPasswordErrors() {
        setErrors((prev) => {
            if (Object.keys(prev).length === 0) {
                return prev;
            }

            const next = { ...prev };
            (['currentPassword', 'newPassword'] as FieldKey[]).forEach((field) => {
                delete next[field];
            });

            return next;
        });
    }

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !userId) return;

        if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
            showToast('success', t('error'), t('imageinvalide'));
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            showToast('success', t('error'), t('imagebig'));
            return;
        }

        try {
            setUploading(true);
            const res = await uploadUserProfileImage(userId, file);
            const imageUrl = res.data;
            setAvatarUrl(imageUrl);
            setFormData((prev) => (prev ? { ...prev, profileImageUrl: imageUrl } : prev));
            showToast('success', t('profileImage.successTitle'), t('profileImage.successDescription'));
        } catch (err) {
            showToast('error', t('profile.errorTitle'), t('profileImage.errorDescription'));
        } finally {
            setUploading(false);
        }
    };

    const handleResetProfile = () => {
        setFormData(originalFormData);
        setAvatarUrl(originalFormData?.profileImageUrl || null);
        clearProfileErrors();
    };

    const handleUpdateProfile = async () => {
        if (!userId || !formData) return;
        if (!validateProfileForm()) {
            return;
        }

        try {
            const userPayload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                gender: formData.gender,
            };

            await updateUserProfile(userId, userPayload);
            showToast('success', t('personalInfo.successTitle'), t('personalInfo.successDescription'));

            if (doctorId && isDoctor) {
                const doctorPayload = {
                    userId,
                    specialty: formData.specialty,
                    licenseNumber: formData.licenseNumber,
                };

                await updateDoctorProfile(doctorPayload, doctorId);
            }

            setOriginalFormData(formData);
        } catch (err) {
            console.error('Error updating profile:', err);
            showToast('error', t('profile.errorTitle'), t('profile.errorDescription'));
        }
    };

    const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userId) return;
        if (!validatePasswordForm()) {
            return;
        }

        try {
            await changeUserPassword(userId, passwordData);
            showToast('success', t('passwordSection.successTitle'), t('passwordSection.successDescription'));
            setPasswordData({ currentPassword: '', newPassword: '' });
            clearPasswordErrors();
        } catch (err) {
            showToast('error', t('passwordSection.errorTitle'), t('passwordSection.errorDescription'));
        }
    };
    if (loading || !formData) {
        return (
            <Card>
                <div className="animate-pulse space-y-4">
                    <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
            </Card>
        );
    }

    const hasChanges =
        JSON.stringify(formData) !== JSON.stringify(originalFormData) ||
        avatarUrl !== originalFormData?.profileImageUrl;

    return (
        <div dir={dir} className="space-y-6 mt-8">
            <SectionIntro t={t} />

            <Card>
                <ProfileSection
                    t={t}
                    formData={formData}
                    errors={errors}
                    isDoctor={isDoctor}
                    fileInputRef={fileInputRef}
                    avatarUrl={avatarUrl}
                    uploading={uploading}
                    hasChanges={hasChanges}
                    onInputChange={handleInputChange}
                    onInputBlur={handleInputBlur}
                    onSelectChange={handleSelectChange}
                    onImageUpload={handleImageUpload}
                    onUpdateProfile={handleUpdateProfile}
                    onResetProfile={handleResetProfile}
                    onTriggerUpload={() => fileInputRef.current?.click()}
                />
            </Card>

            <PasswordIntro t={t} />

            <Card>
                <PasswordSection
                    t={t}
                    passwordData={passwordData}
                    errors={errors}
                    onPasswordChange={handlePasswordChange}
                    onInputBlur={handleInputBlur}
                    onSubmit={handleChangePassword}
                />
            </Card>
        </div>
    );
};




export default Account;
