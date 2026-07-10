'use client';

import { useState } from 'react';
import { RiCloseLine, RiFolderFill, RiAlertFill } from '@remixicon/react';
import { Button } from '@/components/Button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/Dialog';
import { Trash2 } from 'lucide-react';
import { deleteCategory } from '@/api/pharmacie/categories';
import { Card } from '@/components/Card';

interface DeleteCategoryDialogProps {
    category: {
        id: string;
        name: string;
    };
    tenantId: string;
    onCategoryDeleted: () => void;
}

export default function DeleteCategoryDialog({
    category,
    tenantId,
    onCategoryDeleted,
}: DeleteCategoryDialogProps) {
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenChange = async (isOpen: boolean) => {
        if (isOpen) {
            setPassword('');
        }
        setOpen(isOpen);
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await deleteCategory(category.id);
            setOpen(false);
            onCategoryDeleted();
        } catch (error: any) {
            console.error('Delete failed:', error);
            alert('Échec de la suppression. Vérifiez votre mot de passe.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogClose asChild>
                    <Button
                        variant="ghost"
                        className="absolute right-3 top-3 !text-gray-400 hover:!text-gray-600"
                    >
                        <RiCloseLine className="h-5 w-5" />
                    </Button>
                </DialogClose>

                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                            <RiAlertFill className="h-6 w-6 text-red-600 dark:text-red-300" />
                        </div>
                        <DialogTitle>Supprimer la catégorie</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <DialogDescription className="text-base">
                        Vous êtes sur le point de <span className="font-semibold text-red-600">supprimer définitivement</span> la catégorie :
                    </DialogDescription>

                    <Card className="flex items-center gap-3 p-4">
                        <RiFolderFill className="h-8 w-8 text-gray-500" />
                        <div>
                            <p className="font-semibold text-lg">{category.name}</p>
                        </div>
                    </Card>
                   
                </div>

                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3">
                    <DialogClose asChild>
                        <Button variant="secondary" disabled={isLoading}>
                            Annuler
                        </Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        {isLoading ? 'Suppression en cours...' : 'Supprimer définitivement'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}