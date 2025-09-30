import React from 'react';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { RadioCardGroup, RadioCardItem } from '@/components/RadioCardGroup';
import { cx } from '@/lib/utils';
import { StatusItem, TenantFormData } from '../types/tenant';

interface TenantFormFieldsProps {
    formData: TenantFormData;
    status: StatusItem[];
    isLoading: boolean;
    onFieldChange: (field: keyof TenantFormData, value: string | boolean) => void;
}

export const TenantFormFields: React.FC<TenantFormFieldsProps> = ({
    formData,
    status,
    isLoading,
    onFieldChange,
}) => {
    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="tenant-name" className="font-medium">
                    Nom de l&apos;établissement <span className="text-red-500">*</span>
                </Label>
                <Input
                    type="text"
                    id="tenant-name"
                    name="tenant-name"
                    placeholder="Ex : Clinique du Centre"
                    value={formData.name}
                    onChange={(e) => onFieldChange('name', e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="tenant-description" className="font-medium">
                    Description
                </Label>
                <Input
                    type="text"
                    id="tenant-description"
                    name="tenant-description"
                    placeholder="Ex : Centre médical pluridisciplinaire"
                    value={formData.description}
                    onChange={(e) => onFieldChange('description', e.target.value)}
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <Label className="font-medium">
                    Type d&apos;établissement <span className="text-red-500">*</span>
                </Label>
                <RadioCardGroup
                    value={formData.tenantTypeId}
                    onValueChange={(value) => onFieldChange('tenantTypeId', value)}
                    className="flex flex-wrap gap-3"
                    disabled={isLoading}
                >
                    {status.map((item) => (
                        <RadioCardItem
                            value={item.id}
                            key={item.id}
                            className={cx(
                                'w-fit px-2.5 py-2 text-sm text-gray-900 dark:text-gray-50',
                                'data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white',
                                'data-[state=checked]:dark:bg-emerald-500 data-[state=checked]:dark:text-white',
                            )}
                        >
                            {item.label || item.type}
                        </RadioCardItem>
                    ))}
                </RadioCardGroup>
            </div>
        </>
    );
};