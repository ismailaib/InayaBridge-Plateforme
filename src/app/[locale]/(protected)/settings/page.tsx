'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs';
import { getDirection } from '@/lib/i18n/i18n';
import { useTranslationsContext } from '@/lib/i18n/TranslationsProvider';
import useTranslations from '@/lib/i18n/useTranslations';
import Account from './pages/Account';
import Workspaces from './pages/Workspaces';
import Disponibility from './pages/Disponibility';
import Pereferences from './pages/Pereferences';
import Billing from './pages/Billing';
import { Building2, ClockFading, FileSliders, ScrollText, UserRoundCog } from 'lucide-react';

// Animation wrapper component
const TabContentWrapper = ({ children, tabKey }: { children: React.ReactNode; tabKey: string }) => (
    <motion.div
        key={tabKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
    >
        {children}
    </motion.div>
);

export default function Settings() {
    const t = useTranslations('settings.settings');
    const { locale } = useTranslationsContext();
    const dir = getDirection(locale);
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    // Get current tab from URL or default to 'account'
    const currentTab = searchParams.get('tab') || 'account';
    
    // Handle tab change
    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', value);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div dir={dir} className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-50">
                {t('title')}
            </h1>
            <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
                {t('description')}
            </p>

            <Tabs value={currentTab} onValueChange={handleTabChange} className="mt-8 [html[lang=ar]_&]:text-right">
                <TabsList variant="line" style={{ direction: dir === 'rtl' ? 'rtl' : 'ltr' }}>
                    <TabsTrigger value="account" className="inline-flex gap-2">
                        <UserRoundCog width={18} /> {t('tabs.account')}
                    </TabsTrigger>
                    <TabsTrigger value="workspaces" className="inline-flex gap-2">
                        <Building2 width={18} /> {t('tabs.workspaces')}
                    </TabsTrigger>
                    <TabsTrigger value="disponibility" className="inline-flex gap-2">
                        <ClockFading width={18} /> {t('tabs.disponibility')}
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="inline-flex gap-2">
                        <FileSliders width={18} /> {t('tabs.preferences')}
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="inline-flex gap-2">
                        <ScrollText width={18} /> {t('tabs.billing')}
                    </TabsTrigger>
                </TabsList>
                
                <AnimatePresence mode="wait">
                    {currentTab === 'account' && (
                        <TabsContent value="account">
                            <TabContentWrapper tabKey="account">
                                <Account />
                            </TabContentWrapper>
                        </TabsContent>
                    )}
                    {currentTab === 'workspaces' && (
                        <TabsContent value="workspaces">
                            <TabContentWrapper tabKey="workspaces">
                                <Workspaces />
                            </TabContentWrapper>
                        </TabsContent>
                    )}
                    {currentTab === 'disponibility' && (
                        <TabsContent value="disponibility">
                            <TabContentWrapper tabKey="disponibility">
                                <Disponibility />
                            </TabContentWrapper>
                        </TabsContent>
                    )}
                    {currentTab === 'preferences' && (
                        <TabsContent value="preferences">
                            <TabContentWrapper tabKey="preferences">
                                <Pereferences />
                            </TabContentWrapper>
                        </TabsContent>
                    )}
                    {currentTab === 'billing' && (
                        <TabsContent value="billing">
                            <TabContentWrapper tabKey="billing">
                                <Billing />
                            </TabContentWrapper>
                        </TabsContent>
                    )}
                </AnimatePresence>
            </Tabs>
        </div>
    );
}