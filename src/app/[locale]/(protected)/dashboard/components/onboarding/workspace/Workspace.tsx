import React from 'react';
import { RiCloseLine } from '@remixicon/react';
import { Hospital } from 'lucide-react';
import { Button } from '@/components/Button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from '@/components/Dialog';
import { TenantManagementProps } from './types/tenant';
import { useTenantManagement } from './hooks/useTenantManagement';
import { TenantForm } from './components/TenantForm';


export const TenantManagement: React.FC<TenantManagementProps> = ({ onSuccess }) => {
    const {
        status,
        isLoading,
        isDialogOpen,
        setIsDialogOpen,
        createTenant,
    } = useTenantManagement(onSuccess);

    return (
        <div className="flex items-end justify-center pt-8">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="primary" className="w-full">
                        <Hospital className="mr-2 h-4 w-4 text-white" />
                        Créer un établissement
                    </Button>
                </DialogTrigger>
                
                <DialogContent className="max-w-md">
                    <DialogClose asChild>
                        <Button
                            className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
                            variant="ghost"
                        >
                            <RiCloseLine className="h-5 w-5 shrink-0" />
                        </Button>
                    </DialogClose>

                    <TenantForm
                        status={status}
                        isLoading={isLoading}
                        onSubmit={createTenant}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TenantManagement;