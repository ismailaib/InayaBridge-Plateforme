import { sendInvitation, SendInvitation } from '@/api/invitations';
import { Button } from '@/components/Button';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/Dialog';
import { Input } from '@/components/Input';
import { UserRoundPlus } from 'lucide-react';
import React, { useCallback, useState, useEffect } from 'react';
import { TOAST_MESSAGES } from '../../../../hooks/constants';
import { showToast, validateEmail } from '../../../../hooks/utils';

interface InviteFormProps {
    tenantId: string;
    onSuccess: () => void;
    onInviteSent: () => void;
}

export const InviteForm: React.FC<InviteFormProps> = ({ tenantId, onSuccess, onInviteSent }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');

    const storedUser = localStorage.getItem("user")

    const parsed = JSON.parse(storedUser ?? "")

    // Debug logging to understand what's happening
    useEffect(() => {
        console.log("InviteForm - User from store:", parsed);
        console.log("InviteForm - User email:", parsed?.email);
        console.log("InviteForm - TenantId:", tenantId);
    }, [parsed, tenantId]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        // Debug current state
        console.log("Submit - Current user:", parsed);
        console.log("Submit - Input email:", email.trim());

        // Check if user exists
        if (!parsed) {
            console.warn("No user found in store");
            showToast('error', "Erreur", "Utilisateur non connecté. Veuillez vous reconnecter.");
            return;
        }

        // Check if user has email
        if (!parsed.email) {
            console.warn("User exists but has no email:", parsed);
            showToast('error', "Erreur", "Informations utilisateur incomplètes. Veuillez vous reconnecter.");
            return;
        }

        // Self-invitation check
        if (parsed.email === email.trim()) {
            showToast('error', "Erreur", "Il n'est pas possible de s'inviter soi-même :)");
            return;
        }

        if (!tenantId) {
            showToast('error', "Erreur", TOAST_MESSAGES.TENANT_ERROR);
            return;
        }

        const emailError = validateEmail(email);
        if (emailError) {
            showToast('error', "Erreur", emailError);
            return;
        }

        setIsLoading(true);
        try {
            await sendInvitation(tenantId, { email: email.trim() } as SendInvitation);
            showToast('success', "Invitation envoyée", TOAST_MESSAGES.INVITATION_SUCCESS(email));
            setEmail('');
            onSuccess();
            onInviteSent();
        } catch (error) {
            console.error("Error sending invitation:", error);
            showToast('error', "Erreur", TOAST_MESSAGES.INVITATION_ERROR);
        } finally {
            setIsLoading(false);
        }
    }, [parsed, tenantId, email, onSuccess, onInviteSent]);

    if (parsed === null) {
        return (
            <div>
                <DialogHeader>
                    <DialogTitle className="text-base flex items-center">
                        <UserRoundPlus className="w-5 h-5 mr-2 text-emerald-500" />
                        Inviter des membres
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-sm/6">
                        Chargement des informations utilisateur...
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-6 flex w-full items-center space-x-2">
                    <Input
                        className="flex-1"
                        placeholder="Chargement..."
                        type="email"
                        disabled={true}
                    />
                    <Button type="button" disabled={true} className="shrink-0">
                        Chargement...
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div>
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
                <Input
                    className="flex-1"
                    placeholder="Saisir l'adresse e-mail..."
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || !tenantId}
                    required
                />
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="shrink-0"
                >
                    {isLoading ? 'Envoi...' : 'Inviter'}
                </Button>
            </div>

            {!tenantId && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    Impossible de récupérer les informations de l&apos;établissement
                </p>
            )}
        </div>
    );
};