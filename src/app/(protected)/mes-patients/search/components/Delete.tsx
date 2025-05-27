"use client";

import React from 'react';
import { RiCloseLine } from '@remixicon/react';
import { UserRoundMinus } from 'lucide-react';

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
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';

export default function DeletePatientModal() {
    return (
        <div className="flex items-center justify-center">
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant='secondary'
                        className="text-red-600 hover:underline dark:text-red-400 text-sm"
                    >
                        <UserRoundMinus width={18} />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogClose asChild>
                        <Button
                            className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
                            variant="ghost"
                        >
                            <RiCloseLine className="size-5 shrink-0" />
                        </Button>
                    </DialogClose>
                    <form action="#" method="POST">
                        <DialogHeader>
                            <DialogTitle className="text-base">
                                Supprimer le patient
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-sm/6">
                                Cette action supprimera définitivement les données du patient. Veuillez confirmer votre mot de passe pour continuer.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-6">
                            <Label htmlFor="confirm-password" className="font-medium">
                                Mot de passe de confirmation
                            </Label>
                            <Input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                className="mt-2"
                                placeholder="Mot de passe"
                            />
                        </div>
                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    className="w-full"
                                >
                                    Supprimer définitivement
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
