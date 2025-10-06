import { SectionIntroProps } from "@/types/settings";

export const SectionIntro = ({ t }: SectionIntroProps) => (
    <div>
        <h2 className="font-semibold text-gray-900 dark:text-gray-50">{t('Account.title')}</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">{t('Account.description')}</p>
    </div>
);
