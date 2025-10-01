import { Button } from "@/components/Button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/Dialog";
import { RiCloseLine } from "@remixicon/react";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { InviteMembersProps } from "../../../hooks/types";
import { useMembers } from "../../../hooks/useMembers";
import { useUserTenant } from "../../../hooks/useUserTenant";
import { InvitationInfo } from "./components/InvitationInfo";
import { InviteForm } from "./components/InviteForm";
import { MembersList } from "./components/MembersList";
import useTranslations from "@/lib/i18n/useTranslations";

export default function InviteMembers({ onSuccess }: InviteMembersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const tenantId = useUserTenant();
    const { members, refreshMembers } = useMembers(tenantId);
    const t = useTranslations("dashboard.invitations");

    const handleSuccess = () => {
        setIsOpen(false);
        onSuccess?.();
    };

    return (
        <div className="flex items-center justify-center pt-6">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="primary" className="w-full">
                        <UserPlus className="w-4 h-4 mx-2" />
                        {t("openDialog")}
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-2xl ">
                    <DialogClose asChild>
                        <Button
                            className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
                            variant="ghost"
                        >
                            <RiCloseLine className="size-5 shrink-0" />
                        </Button>
                    </DialogClose>
                    <div className="[html[lang=ar]_&]:pt-8">
                        <InviteForm tenantId={tenantId} onSuccess={handleSuccess} onInviteSent={refreshMembers} />

                        <div className="mt-6">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50 flex items-center mb-3">
                                {t("currentMembers")}
                            </h4>
                            <MembersList members={members} tenantId={tenantId} onSuccess={handleSuccess} />
                        </div>
                    </div>


                    <InvitationInfo />
                </DialogContent>
            </Dialog>
        </div>
    );
}
