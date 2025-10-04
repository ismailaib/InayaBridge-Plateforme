'use client';

import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { getDirection } from '@/lib/i18n/i18n';
import { useTranslationsContext } from '@/lib/i18n/TranslationsProvider';
import { useTranslations } from '@/lib/i18n/useTranslations';
import React from 'react'

const Account = () => {

    const t = useTranslations('settings.settings');
    const { locale } = useTranslationsContext();
    const dir = getDirection(locale);

    return (
        <div className="mt-8 space-y-8 flex flex-col [html[lang=ar]_&]:items-right">
            {/* Email Section */}
            <form action="#" method="POST" style={{ direction: dir === 'rtl' ? 'rtl' : 'ltr' }}>
                <h2 className="font-semibold text-gray-900 dark:text-gray-50">
                    {t('emailSection.title')}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                    {t('emailSection.description')}
                </p>

                <div className="mt-6 w-full">
                    <Label htmlFor="email" className="font-medium">
                        {t('emailSection.label')}
                    </Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder={t('emailSection.placeholder')}
                        className="mt-2 w-full sm:max-w-lg"
                    />
                </div>

                <Button type="submit" className="mt-6">
                    {t('emailSection.button')}
                </Button>
            </form>

            <Divider />

            {/* Password Section */}
            <form action="#" method="POST" style={{ direction: dir === 'rtl' ? 'rtl' : 'ltr' }}>
                <h2 className="font-semibold text-gray-900 dark:text-gray-50">
                    {t('passwordSection.title')}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                    {t('passwordSection.description')}
                </p>

                <div className="mt-6">
                    <Label htmlFor="current-password" className="font-medium">
                        {t('passwordSection.currentLabel')}
                    </Label>
                    <Input
                        type="password"
                        id="current-password"
                        name="current-password"
                        placeholder={t('passwordSection.placeholder')}
                        className="mt-2 w-full sm:max-w-lg"
                    />
                </div>

                <div className="mt-4">
                    <Label htmlFor="new-password" className="font-medium">
                        {t('passwordSection.newLabel')}
                    </Label>
                    <Input
                        type="password"
                        id="new-password"
                        name="new-password"
                        placeholder={t('passwordSection.placeholder')}
                        className="mt-2 w-full sm:max-w-lg"
                    />
                </div>

                <Button className="mt-6">
                    {t('passwordSection.button')}
                </Button>
            </form>
        </div>
    )
}

export default Account