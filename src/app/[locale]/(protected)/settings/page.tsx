'use client';


import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs';
import { getDirection } from '@/lib/i18n/i18n';
import { useTranslationsContext } from '@/lib/i18n/TranslationsProvider';
import useTranslations from '@/lib/i18n/useTranslations';
import Account from './components/Account';
import Workspaces from './components/Workspaces';
import Disponibility from './components/Disponibility';
import Pereferences from './components/Pereferences';
import Billing from './components/Billing';


export default function Settings() {
    const t = useTranslations('settings.settings');
    const { locale } = useTranslationsContext();
    const dir = getDirection(locale);

    return (
        <div dir={dir} className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-50">
                {t('title')}
            </h1>
            <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
                {t('description')}
            </p>

            <Tabs defaultValue="tab1" className="mt-8 [html[lang=ar]_&]:text-right">
                <TabsList variant="line" style={{ direction: dir === 'rtl' ? 'rtl' : 'ltr' }}>
                    <TabsTrigger value="tab1" className="inline-flex gap-2">
                        {t('tabs.account')}
                    </TabsTrigger>
                    <TabsTrigger value="tab2" className="inline-flex gap-2">
                        {t('tabs.workspaces')}
                    </TabsTrigger>
                    <TabsTrigger value="tab3" className="inline-flex gap-2">
                        {t('tabs.disponibility')}
                    </TabsTrigger>
                    <TabsTrigger value="tab4" className="inline-flex gap-2">
                        {t('tabs.pereferences')}
                    </TabsTrigger>
                    <TabsTrigger value="tab5" className="inline-flex gap-2">
                        {t('tabs.billing')}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">
                    <Account />
                </TabsContent>
                <TabsContent value="tab2">
                    <Workspaces />
                </TabsContent>
                <TabsContent value="tab3">
                    <Disponibility />
                </TabsContent>
                <TabsContent value="tab4">
                    <Pereferences />
                </TabsContent>
                <TabsContent value="tab5">
                    <Billing />
                </TabsContent>
            </Tabs>
        </div>
    );
}
