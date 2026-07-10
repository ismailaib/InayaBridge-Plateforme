'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ArrowLeft } from 'lucide-react';
import useTranslations from '@/lib/i18n/useTranslations';
import { useTranslationsContext } from '@/lib/i18n/TranslationsProvider';
import { getDirection } from '@/lib/i18n/i18n';

export default function ReturnToDashboard() {
  const t = useTranslations('dashboard.onboarding.return');
  const { locale } = useTranslationsContext();
  const dir = getDirection(locale);
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div dir={dir} className="flex items-center justify-center min-h-[60vh] px-4">
      <Card className="p-8 text-center max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
          {t('title') || 'Setup Almost Done'}
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {t('description') ||
            'Return to the dashboard to complete the remaining steps and finish creating your workspace.'}
        </p>

        <Button
          variant="primary"
          className="mt-6 flex items-center justify-center mx-auto gap-2"
          onClick={handleGoToDashboard}
        >
          <ArrowLeft width={18} />
          {t('button') || 'Return to Dashboard'}
        </Button>
      </Card>
    </div>
  );
}
