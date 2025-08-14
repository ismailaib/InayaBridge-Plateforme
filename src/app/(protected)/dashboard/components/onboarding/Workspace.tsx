import { RiCloseLine } from '@remixicon/react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/Dialog';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { RadioCardGroup, RadioCardItem } from '@/components/RadioCardGroup';
import { Switch } from '@/components/Switch';
import { cx } from '@/lib/utils';
import { workspaceCreation, workspaceStatus } from '@/api/tenant';
import { getDoctorProfile, updateDoctorProfile } from '@/api/register';
import { toast } from '@/lib/useToast';
import { Hospital } from 'lucide-react';

type StatusItem = {
    id: string;
    type: string;
    value: string;
    label: string;
};

interface TenantManagementProps {
    onSuccess?: () => void; // Callback to refresh parent component
}

export default function TenantManagement({ onSuccess }: TenantManagementProps) {
    const [status, setStatus] = useState<StatusItem[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [tenantName, setTenantName] = useState('');
    const [tenantDescription, setTenantDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
        throw new Error("No user found in localStorage");
    }
    const parsed = JSON.parse(storedUser);

    useEffect(() => {
        async function fetchTenantTypes() {
            try {
                const res = await workspaceStatus();
                setStatus(Array.isArray(res.data) ? res.data : []);
                if (res.data?.length > 0) setSelectedStatus(res.data[0].id);
            } catch (error) {
                console.error("Erreur lors de la récupération des types d'établissement :", error);
            }
        }
        fetchTenantTypes();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tenantName || !selectedStatus) {
            toast({
                title: "Erreur",
                description: "Veuillez remplir tous les champs obligatoires !",
                variant: "error",
                duration: 3000,
            });
            return;
        }

        setIsLoading(true);

        const payload: workspaceCreation = {
            name: tenantName,
            description: tenantDescription,
            ownerId: parsed.id,
            tenantTypeId: selectedStatus,
            isPrivate: isPrivate ? true : false,
        };

        try {
            const res = await workspaceCreation(payload);
            const doctor = await getDoctorProfile(parsed.id);

            const userpayload = {
                userId: parsed.id,
                tenantId: res.data.id,
            };

            await updateDoctorProfile(userpayload, String(doctor.data.id));

            toast({
                title: "Succès",
                description: "Établissement créé avec succès !",
                variant: "success",
                duration: 3000,
            });

            // Reset form
            setTenantName('');
            setTenantDescription('');
            setIsPrivate(false);
            
            // Close modal
            setIsOpen(false);
            
            // Trigger parent refresh
            onSuccess?.();
            
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la création de l'établissement.",
                variant: "error",
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-end justify-center pt-8">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="primary" className="w-full"><Hospital className="w-4 h-4 mr-2 text-white" /> Créer un établissement</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogClose asChild>
                        <Button
                            className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
                            variant="ghost"
                        >
                            <RiCloseLine className="size-5 shrink-0" />
                        </Button>
                    </DialogClose>

                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Configurer votre établissement</DialogTitle>
                            <DialogDescription className="mt-1 text-sm/6">
                                Un établissement regroupe les informations professionnelles et les membres qui y travaillent.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-6">
                            <Label htmlFor="tenant-name" className="font-medium">
                                Nom de l&apos;établissement <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                id="tenant-name"
                                name="tenant-name"
                                placeholder="Ex : Clinique du Centre"
                                className="mt-2"
                                value={tenantName}
                                onChange={(e) => setTenantName(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="mt-3">
                            <Label htmlFor="tenant-description" className="font-medium">
                                Description
                            </Label>
                            <Input
                                type="text"
                                id="tenant-description"
                                name="tenant-description"
                                placeholder="Ex : Centre médical pluridisciplinaire"
                                className="mt-2"
                                value={tenantDescription}
                                onChange={(e) => setTenantDescription(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="mt-3">
                            <Label className="font-medium">
                                Type d&apos;établissement <span className="text-red-500">*</span>
                            </Label>
                            <RadioCardGroup
                                value={selectedStatus}
                                onValueChange={setSelectedStatus}
                                className="flex flex-wrap gap-3 mt-2"
                                disabled={isLoading}
                            >
                                {status.map((item) => (
                                    <RadioCardItem
                                        value={item.id}
                                        key={item.id}
                                        className={cx(
                                            'w-fit px-2.5 py-2 text-sm text-gray-900 dark:text-gray-50',
                                            'data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white data-[state=checked]:dark:bg-emerald-500 data-[state=checked]:dark:text-white',
                                        )}
                                    >
                                        {item.label || item.type}
                                    </RadioCardItem>
                                ))}
                            </RadioCardGroup>
                        </div>

                        <Button 
                            type="submit" 
                            className="mt-4 w-full" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Enregistrement...' : 'Enregistrer l\'établissement'}
                        </Button>

                        <div className="-mx-6 -mb-6 mt-8 border-t bg-gray-50 py-4 dark:border-gray-900 dark:bg-gray-900">
                            <div className="flex items-start space-x-3 px-6">
                                <Switch
                                    id="enable-private-tenant"
                                    name="enable-private-tenant"
                                    className="mt-1"
                                    checked={isPrivate}
                                    onCheckedChange={(checked) => setIsPrivate(checked)}
                                    disabled={isLoading}
                                />
                                <div>
                                    <Label htmlFor="enable-private-tenant" className="font-medium">
                                        Rendre l&apos;établissement privé
                                    </Label>
                                    <p className="text-sm text-gray-500 dark:text-gray-500">
                                        Les patients ne pourront pas trouver cet établissement dans la liste publique.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}