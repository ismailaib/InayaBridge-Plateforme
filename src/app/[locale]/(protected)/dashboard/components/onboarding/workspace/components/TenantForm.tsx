import React, { useState } from 'react';
import { Button } from '@/components/Button';
import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog';
import { TenantFormFields } from './TenantFormFields';
import { TenantPrivacySettings } from './TenantPrivacySettings';
import { StatusItem, TenantFormData } from '../types/tenant';
import { getUserProfile } from '@/api/profile';
import { useUserStore } from '@/store/useAuthStore';

interface TenantFormProps {
    status: StatusItem[];
    isLoading: boolean;
    onSubmit: (formData: TenantFormData) => Promise<void>;
}

const initialFormData: TenantFormData = {
    name: '',
    description: '',
    tenantTypeId: '',
    isPrivate: false,
};

export const TenantForm: React.FC<TenantFormProps> = ({
    status,
    isLoading,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<TenantFormData>(() => ({
        ...initialFormData,
        tenantTypeId: status.length > 0 ? status[0].id : '',
    }));

    const setUser = useUserStore((state) => state.setUser);


    const handleFieldChange = (field: keyof TenantFormData, value: string | boolean) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.tenantTypeId) {
            return;
        }

        await onSubmit(formData);

        const storedUser = localStorage.getItem("user");
        const parsed = JSON.parse(storedUser ?? "")

        if (!storedUser) {
            console.error("No userId found in local storage");
            return;
        }

        const { data: fullUserInfo } = await getUserProfile(parsed.id);
        setUser(fullUserInfo);
        localStorage.setItem("user", JSON.stringify(fullUserInfo));

        // Reset form on success
        setFormData({
            ...initialFormData,
            tenantTypeId: status.length > 0 ? status[0].id : '',
        });
    };

    const isFormValid = formData.name.trim() && formData.tenantTypeId;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <DialogHeader>
                <DialogTitle>Configurer votre établissement</DialogTitle>
                <DialogDescription className="text-sm leading-6">
                    Un établissement regroupe les informations professionnelles et les membres qui y travaillent.
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
                <TenantFormFields
                    formData={formData}
                    status={status}
                    isLoading={isLoading}
                    onFieldChange={handleFieldChange}
                />
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !isFormValid}
            >
                {isLoading ? 'Enregistrement...' : 'Enregistrer l\'établissement'}
            </Button>

            <TenantPrivacySettings
                isPrivate={formData.isPrivate}
                isLoading={isLoading}
                onChange={(checked) => handleFieldChange('isPrivate', checked)}
            />
        </form>
    );
};