import React from 'react';
import { Label } from '@/components/Label';
import { Switch } from '@/components/Switch';
import useTranslations from '@/lib/i18n/useTranslations';

interface TenantPrivacySettingsProps {
    isPrivate: boolean;
    isLoading: boolean;
    onChange: (checked: boolean) => void;
}

export const TenantPrivacySettings: React.FC<TenantPrivacySettingsProps> = ({
    isPrivate,
    isLoading,
    onChange,
}) => {

    const t = useTranslations("dashboard.tenantForm")

    return (
        <div className="-mx-6 -mb-6 mt-8 border-t bg-gray-50 py-4 dark:border-gray-900 dark:bg-gray-900">
            <div className="flex items-start space-x-3 px-6">
                <Switch
                    id="enable-private-tenant"
                    name="enable-private-tenant"
                    className="mt-1 ml-2"
                    checked={isPrivate}
                    onCheckedChange={onChange}
                    disabled={isLoading}
                />
                <div className="space-y-1">
                    <Label htmlFor="enable-private-tenant" className="font-medium">
                        {t('privacySettings.title')}
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        {t('privacySettings.description')}                    </p>
                </div>
            </div>
        </div>
    );
};
