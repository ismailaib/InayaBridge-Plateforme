import { Button } from "@/components/Button";
import { ProfileActionsProps } from "@/types/settings";
import { RefreshCcw, Save } from "lucide-react";

export const ProfileActions = ({ t, hasChanges, onUpdateProfile, onResetProfile }: ProfileActionsProps) => (
    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button onClick={onUpdateProfile} className="sm:order-2" disabled={!hasChanges}>
            <Save width={18} className="mx-2" /> {t('personalInfo.button')}
        </Button>
        <Button onClick={onResetProfile} variant="secondary" className="sm:order-1" disabled={!hasChanges}>
           <RefreshCcw width={18} className="mx-2" /> {t('personalInfo.resetbutton')}
        </Button>
    </div>
);
