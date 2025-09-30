'use client';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function LocaleSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: string) => {
        // Remove the current locale from the pathname
        const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newPathname);
    };

    return (
        <div className="flex gap-4">
            <button
                onClick={() => switchLocale('en')}
                className={locale === 'en' ? 'font-bold' : ''}
            >
                English
            </button>
            <button
                onClick={() => switchLocale('fr')}
                className={locale === 'fr' ? 'font-bold' : ''}
            >
                Français
            </button>
        </div>
    );
}
