'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/Select';
import { getTenant, updateTenantPlan } from '@/api/tenant';
import useTranslations from '@/lib/i18n/useTranslations';
import { useTranslationsContext } from '@/lib/i18n/TranslationsProvider';
import { getDirection } from '@/lib/i18n/i18n';

export default function Workspaces() {
  const t = useTranslations('settings.workspace');
  const { locale } = useTranslationsContext();
  const dir = getDirection(locale);

  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const tenantId = user?.doctorProfile?.tenantId;
        if (!tenantId) return;

        const res = await getTenant(tenantId);
        setTenant(res.data);
        setSelectedPlan(res.data.subscriptionPlan || null);
      } catch (err) {
        console.error('Error fetching tenant:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();
  }, []);

  const handleSavePlan = async () => {
    if (!tenant?.id || !selectedPlan) return;
    setSaving(true);
    try {
      await updateTenantPlan({
        tenantId: tenant.id,
        subscriptionPlan: selectedPlan.toUpperCase() as
          | 'ESSENTIAL'
          | 'PLUS'
          | 'PRO',
      });
      setTenant({ ...tenant, subscriptionPlan: selectedPlan });
    } catch (err) {
      console.error('Error updating plan:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </Card>
    );
  }

  return (
    <div dir={dir} className="pt-4 space-y-8">
      <div className="pt-4">
        <h2 className="font-semibold text-gray-900 dark:text-gray-50">
          {t('title')}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
          {t('description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tenant Info */}
        <div>
          <Label className="font-medium">{t('tenantName')}</Label>
          <Input
            type="text"
            value={tenant.name}
            disabled
            className="mt-2 w-full"
          />
        </div>

        <div>
          <Label className="font-medium">{t('tenantDescription')}</Label>
          <Input
            type="text"
            value={tenant.description}
            disabled
            className="mt-2 w-full"
          />
        </div>

        <div>
          <Label className="font-medium">{t('tenantOwner')}</Label>
          <Input
            type="text"
            value={tenant.ownerEmail || tenant.owner?.email || '—'}
            disabled
            className="mt-2 w-full"
          />
        </div>

        <div>
          <Label className="font-medium">{t('privacy')}</Label>
          <Input
            type="text"
            value={tenant.isPrivate ? t('private') : t('public')}
            disabled
            className="mt-2 w-full"
          />
        </div>

        {/* Subscription Plan (Full width) */}
        <div className="md:col-span-2">
          <Label className="font-medium">{t('subscriptionPlan')}</Label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
            <Select
              value={selectedPlan || ''}
              onValueChange={setSelectedPlan}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectPlan')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ESSENTIAL">{t('plans.essential')}</SelectItem>
                <SelectItem value="PLUS">{t('plans.plus')}</SelectItem>
                <SelectItem value="PRO">{t('plans.pro')}</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="primary"
              disabled={saving || !selectedPlan}
              onClick={handleSavePlan}
            >
              {saving ? t('saving') : t('save')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
