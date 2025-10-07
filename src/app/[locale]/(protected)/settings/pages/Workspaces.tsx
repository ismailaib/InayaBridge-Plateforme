'use client';

import {
  getTenant,
  uploadTenantLogo,
  getTenantPreferences,
  updateTenantPreferences,
} from '@/api/tenant';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Checkbox } from '@/components/Checkbox';
import { Divider } from '@/components/Divider';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { useTranslationsContext } from '@/lib/i18n/TranslationsProvider';
import { getDirection } from '@/lib/i18n/i18n';
import useTranslations from '@/lib/i18n/useTranslations';
import api from '@/lib/api';
import { ImagePlus, RefreshCcw, Save } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { showToast } from '../../dashboard/hooks/utils';
import { Switch } from '@/components/Switch';
import Workspace from '../../dashboard/components/onboarding/workspace/Workspace';
import ReturnToDashboard from '@/components/ReturnToDashboard';

export default function Workspaces() {
  const t = useTranslations('settings.workspace');
  const { locale } = useTranslationsContext();
  const dir = getDirection(locale);

  const [tenant, setTenant] = useState<any>(null);
  const [originalTenant, setOriginalTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------- Fetch Tenant + Preferences ---------------- */
  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const tenantId = user?.doctorProfile?.tenantId;
        if (!tenantId) return;

        const [tenantRes, prefsRes] = await Promise.all([
          getTenant(tenantId),
          getTenantPreferences(tenantId),
        ]);

        setTenant(tenantRes.data);
        setOriginalTenant(tenantRes.data);
        setLogoUrl(tenantRes.data.logoUrl || null);
        setPreferences(prefsRes.data);
      } catch (err) {
        console.error('Error fetching tenant data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTenantData();
  }, []);

  /* ---------------- Logo Upload ---------------- */
  const handleTriggerUpload = () => fileInputRef.current?.click();

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !tenant?.id) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      showToast('error', t('invalidefile.errorTitle'), t('invalidefile.errorDescription'));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('error', t('fileTooLarge.errorTitle'), t('fileTooLarge.errorDescription'));
      return;
    }

    setUploading(true);

    try {
      const response = await uploadTenantLogo(tenant.id, file);
      const newLogoUrl = response.data.logoUrl;
      setLogoUrl(newLogoUrl);
      setTenant({ ...tenant, logoUrl: newLogoUrl });
    } catch (err) {
      showToast('error', t('logoupload.errorTitle'), t('logoupload.errorDescription'));
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- Reset & Save Tenant ---------------- */
  const handleReset = () => {
    if (originalTenant) {
      setTenant(originalTenant);
      setLogoUrl(originalTenant.logoUrl || null);
    }
  };

  const handleSave = async () => {
    if (!tenant?.id) return;

    setSaving(true);
    try {
      await api.put(`/tenants/${tenant.id}`, {
        name: tenant.name,
        description: tenant.description,
        isPrivate: tenant.isPrivate,
        tenantTypeId: tenant.tenantTypeId,
        ownerId: tenant.ownerId,
      });
      setOriginalTenant(tenant);
      showToast('success', t('tenant.successTitle'), t('tenant.successDescription'));
    } catch (err) {
      showToast('error', t('tenant.errorTitle'), t('tenant.errorDescription'));
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- Save Preferences ---------------- */
  const handleSavePreferences = async () => {
    if (!tenant?.id || !preferences) return;
    setSavingPrefs(true);
    try {
      await updateTenantPreferences(tenant.id, preferences);
      showToast('success', 'Preferences updated', 'Tenant preferences saved successfully');
    } catch (err) {
      showToast('error', 'Update failed', 'Unable to save tenant preferences');
    } finally {
      setSavingPrefs(false);
    }
  };

  if (loading) return <div></div>;

  if (!loading && !tenant) return <ReturnToDashboard />;

  const hasChanges =
    tenant.name !== originalTenant.name ||
    tenant.description !== originalTenant.description ||
    tenant.isPrivate !== originalTenant.isPrivate ||
    tenant.logoUrl !== originalTenant.logoUrl;

  // Feature configurations with descriptions
  const features = [
    {
      key: 'enableTeleconsultation',
      label: 'Teleconsultation',
      description: 'Enable video consultations and remote appointments with patients',
    },
    {
      key: 'enableLabIntegration',
      label: 'Lab Integration',
      description: 'Connect with laboratory systems for test orders and results',
    },
    {
      key: 'enableBilling',
      label: 'Billing',
      description: 'Manage invoices, payments, and financial transactions',
    },
    {
      key: 'enforce2FA',
      label: 'Two-Factor Auth',
      description: 'Require two-factor authentication for enhanced security',
    },
    {
      key: 'enableAuditLogs',
      label: 'Audit Logs',
      description: 'Track and record all system activities for compliance',
    },
  ];

  return (
    <div dir={dir} className="pt-2 space-y-6 mx-auto">
      {/* ---------------- Header ---------------- */}
      <div className="pt-6">
        <h2 className="font-semibold text-gray-900 dark:text-gray-50">{t('title')}</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">{t('description')}</p>
      </div>

      {/* ---------------- Workspace Logo ---------------- */}
      <Card className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <div className="flex items-center justify-center w-32 h-32 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-hidden">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt="Workspace Logo"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-4xl font-semibold text-gray-400 dark:text-gray-600">
                  {tenant?.name?.[0]?.toUpperCase() || 'W'}
                </span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              {tenant?.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tenant?.description}</p>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
            {t('logoImage.description') ||
              'Recommended max. size 10 MB – Accepted: JPG, PNG'}
          </p>
          <Button
            onClick={handleTriggerUpload}
            variant="secondary"
            className="mt-2 flex items-center flex-row gap-2"
            disabled={uploading}
          >
            <ImagePlus width={18} />
            {uploading
              ? t('logoImage.uploading') || 'Uploading...'
              : t('logoImage.button') || 'Change Logo'}
          </Button>
        </div>

        <Divider className="my-6" />

        {/* ---------------- Workspace Details ---------------- */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label className="font-medium">{t('tenantName')}</Label>
              <Input
                type="text"
                value={tenant.name || ''}
                onChange={(e) => setTenant({ ...tenant, name: e.target.value })}
                className="mt-2 w-full"
              />
            </div>
            <div>
              <Label className="font-medium">{t('tenantDescription')}</Label>
              <Input
                type="text"
                value={tenant.description || ''}
                onChange={(e) => setTenant({ ...tenant, description: e.target.value })}
                className="mt-2 w-full"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Label
              htmlFor="isPrivate"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('public')}
            </Label>

            <Switch id="a" checked={tenant.isPrivate} onCheckedChange={(checked) =>
              setTenant({ ...tenant, isPrivate: checked })
            } />

            <Label
              htmlFor="isPrivate"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('private')}
            </Label>
          </div>




          {/* Actions */}
          <Divider className="my-6" />
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-3">
            <Button
              variant="secondary"
              onClick={handleReset}
              disabled={!hasChanges || saving}
              className="px-5 flex flex-row items-center gap-2 w-full sm:w-auto"
            >
              <RefreshCcw width={18} /> {t('resetbutton') || 'Reset'}
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="px-6 flex flex-row items-center gap-2 w-full sm:w-auto"
            >
              <Save width={18} /> {saving ? t('saving') || 'Saving...' : t('savebutton') || 'Save'}
            </Button>
          </div>
        </div>
                  {/* Preferences Section */}
          <div>
            {/* Feature Toggles */}
            <Divider className="my-6" />
            <div>
              <Label className="font-medium">{t('preferences.features') || 'Enabled Features'}</Label>
              
              {/* First 4 features in 2x2 grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {features.slice(0, 4).map((feature) => (
                  <Card key={feature.key} className="flex space-x-3 rtl:space-x-reverse items-center">
                    <Switch
                      id={feature.key}
                      checked={preferences?.[feature.key] || false}
                      onCheckedChange={(v) => setPreferences({ ...preferences, [feature.key]: v })}
                    />
                    <div className="flex-1">
                      <Label htmlFor={feature.key} className="text-sm font-medium cursor-pointer">
                        {feature.label}
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="mt-4 flex space-x-3 rtl:space-x-reverse items-center">
                <Switch
                  id={features[4].key}
                  checked={preferences?.[features[4].key] || false}
                  onCheckedChange={(v) => setPreferences({ ...preferences, [features[4].key]: v })}
                />
                <div className="flex-1">
                  <Label htmlFor={features[4].key} className="text-sm font-medium cursor-pointer">
                    {features[4].label}
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {features[4].description}
                  </p>
                </div>
              </Card>
            </div>

            {/* Save Preferences Button */}
            <div className="flex justify-end mt-8">
              <Button
                onClick={handleSavePreferences}
                variant="primary"
                disabled={savingPrefs}
                className="px-6 flex items-center gap-2"
              >
                <Save width={18} />
                {savingPrefs ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </div>
      </Card>
    </div>
  );
}