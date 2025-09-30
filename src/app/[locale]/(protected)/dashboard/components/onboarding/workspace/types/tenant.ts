export interface StatusItem {
    id: string;
    type: string;
    value: string;
    label: string;
}

export interface TenantFormData {
    name: string;
    description: string;
    tenantTypeId: string;
    isPrivate: boolean;
}

export interface TenantManagementProps {
    onSuccess?: () => void;
}