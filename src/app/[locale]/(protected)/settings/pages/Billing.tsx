'use client';

import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { Label } from '@/components/Label';
import { useTranslationsContext } from '@/lib/i18n/TranslationsProvider';
import { getDirection } from '@/lib/i18n/i18n';
import useTranslations from '@/lib/i18n/useTranslations';
import Image from 'next/image'

export default function Billing() {
  const t = useTranslations('settings.billing');
  const { locale } = useTranslationsContext();
  const dir = getDirection(locale);

  return (
    <div dir={dir} className="pt-2 space-y-6">
      {/* ---------------- Header ---------------- */}
      <div className="pt-6">
        <h2 className="font-semibold text-gray-900 dark:text-gray-50">
          {t('title') || 'Billing & Subscription'}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">{t('description')}</p>
      </div>

      {/* ---------------- Current Plan ---------------- */}
      <Card className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium text-gray-900 dark:text-gray-100">
              {t('currentPlan.title') || 'Current Plan'}
            </Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('currentPlan.description') || 'You are currently on the Plus plan.'}
            </p>
          </div>
          <Button variant="primary">{t('upgradeButton') || 'Upgrade Plan'}</Button>
        </div>

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="font-medium">{t('billingPeriod') || 'Billing Period'}</Label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Monthly</p>
          </div>

          <div>
            <Label className="font-medium">{t('nextPayment') || 'Next Payment'}</Label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Nov 6, 2025 - $29.00</p>
          </div>
        </div>
      </Card>

      {/* ---------------- Payment Method ---------------- */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium text-gray-900 dark:text-gray-100">
              {t('paymentMethod.title') || 'Payment Method'}
            </Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('paymentMethod.description') || 'Your saved payment details for future renewals.'}
            </p>
          </div>
          <Button variant="secondary">{t('updateButton') || 'Update Card'}</Button>
        </div>

        <Divider />

        <div className="flex items-center space-x-4">
          <Image src="/images/visa.svg" alt="Visa" className="w-8 h-8" width={8} height={8} />
          <div>
            <p className="text-sm text-gray-900 dark:text-gray-100">Visa ending in 4242</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Expires 08/28</p>
          </div>
        </div>
      </Card>

      {/* ---------------- Invoices ---------------- */}
      <Card>
        <Label className="font-medium text-gray-900 dark:text-gray-100">
          {t('invoices.title') || 'Invoices'}
        </Label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {t('invoices.description') || 'Download past invoices for your records.'}
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600 dark:text-gray-300">
            <thead className="border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="py-3 font-semibold">{t('invoices.date') || 'Date'}</th>
                <th className="py-3 font-semibold">{t('invoices.amount') || 'Amount'}</th>
                <th className="py-3 font-semibold">{t('invoices.status') || 'Status'}</th>
                <th className="py-3 font-semibold text-right">{t('invoices.actions') || 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3">Oct 6, 2025</td>
                <td className="py-3">$29.00</td>
                <td className="py-3 text-green-600 dark:text-green-400">Paid</td>
                <td className="py-3 text-right">
                  <Button variant="secondary">{t('invoices.download') || 'Download'}</Button>
                </td>
              </tr>
              <tr>
                <td className="py-3">Sep 6, 2025</td>
                <td className="py-3">$29.00</td>
                <td className="py-3 text-green-600 dark:text-green-400">Paid</td>
                <td className="py-3 text-right">
                  <Button variant="secondary">{t('invoices.download') || 'Download'}</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
