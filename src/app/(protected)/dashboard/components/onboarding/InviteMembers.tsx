import React, { useState } from 'react';
import { RiCloseLine } from '@remixicon/react';
import { UserPlus, Mail, UserRoundX, UserRoundPlus } from 'lucide-react';

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
import { toast } from '@/lib/useToast';


interface InviteMembersProps {
    onSuccess?: () => void; // Callback to refresh parent component
}

export default function InviteMembers({ onSuccess }: InviteMembersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast({
                title: "Erreur",
                description: "Veuillez saisir une adresse e-mail valide !",
                variant: "error",
                duration: 3000,
            });
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast({
                title: "Erreur",
                description: "Veuillez saisir une adresse e-mail valide !",
                variant: "error",
                duration: 3000,
            });
            return;
        }

        setIsLoading(true);

        try {
            // TODO: Replace with actual API call
            // await inviteMember({ email });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast({
                title: "Invitation envoyée",
                description: `Une invitation a été envoyée à ${email} !`,
                variant: "success",
                duration: 3000,
            });

            // Reset form
            setEmail('');
            
            // Close modal
            setIsOpen(false);
            
            // Trigger parent refresh
            onSuccess?.();
            
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de l'envoi de l'invitation.",
                variant: "error",
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center pt-6">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="primary" className="w-full">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Inviter des collègues
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
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
                            <DialogTitle className="text-base flex items-center">
                                <UserRoundPlus className="w-5 h-5 mr-2 text-emerald-500" />
                                Inviter des membres
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-sm/6">
                                Ajoutez de nouveaux membres à votre établissement. Veuillez respecter 
                                les politiques de votre organisation lors de l&apos;ajout de personnes externes.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="mt-6 flex w-full items-center space-x-2">
                            <div className="relative flex-1">
                                <Input
                                    id="inviteEmail"
                                    placeholder="Saisir l'adresse e-mail..."
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                className="shrink-0"
                            >
                                {isLoading ? 'Envoi...' : 'Inviter'}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50 flex items-center mb-3">
                            Membres actuels de l&apos;établissement
                        </h4>
                        
                       
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <UserRoundX className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                                <p className="text-sm">Aucun membre dans cet établissement</p>
                                <p className="text-xs mt-1">Commencez par inviter vos collègues !</p>
                            </div>
                        
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="flex items-start space-x-2">
                            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                    Invitation par e-mail
                                </p>
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                    Les personnes invitées recevront un e-mail avec un lien pour rejoindre votre établissement.
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}