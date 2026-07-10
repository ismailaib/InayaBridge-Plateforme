'use client';

import { getUserPreferences, updateUserPreferences } from '@/api/preferences';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Divider } from '@/components/Divider';
import { Label } from '@/components/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { Switch } from '@/components/Switch';
import { useTranslationsContext } from '@/lib/i18n/TranslationsProvider';
import { getDirection } from '@/lib/i18n/i18n';
import useTranslations from '@/lib/i18n/useTranslations';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { showToast } from '../../dashboard/hooks/utils';

export default function Preferences() {
  const t = useTranslations('settings.preferences');
  const { locale } = useTranslationsContext();
  const dir = getDirection(locale);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?.id) return;
        const res = await getUserPreferences(user.id);
        setPreferences(res.data);
      } catch (e) {
        console.error('Failed to load preferences:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  const handleSave = async () => {
    if (!preferences) return;
    setSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await updateUserPreferences(user.id, preferences);
      showToast('success', t('save.successTitle'), t('save.successDescription'));
    } catch {
      showToast('error', t('save.errorTitle'), t('save.errorDescription'));
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setPreferences({ ...preferences, language: lang });
    const newPath = pathname.replace(`/${locale}/`, `/${lang}/`);
    router.push(newPath);
  };

  const handleThemeChange = (selectedTheme: string) => {
    setPreferences({ ...preferences, theme: selectedTheme });
    setTheme(selectedTheme); // ✅ handled by next-themes provider
  };

  if (loading || !preferences) return <div />;

  return (
    <div dir={dir} className="pt-8 space-y-6">
      <div>
        <h2 className="font-semibold text-gray-900 dark:text-gray-50">{t('title')}</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">{t('description')}</p>
      </div>

      {/* Language & Theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Label className="font-medium">{t('language.title')}</Label>
          <p className="text-sm text-gray-500">{t('language.description')}</p>
          <Select value={preferences.language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <Card>
          <Label className="font-medium">{t('theme.title')}</Label>
          <p className="text-sm text-gray-500">{t('theme.description')}</p>
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">{t('theme.light')}</SelectItem>
              <SelectItem value="dark">{t('theme.dark')}</SelectItem>
              <SelectItem value="system">{t('theme.system')}</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <Card>
          <Label className="font-medium">{t('timezone.title')}</Label>
          <p className="text-sm text-gray-500">{t('timezone.description')}</p>
          <Select
            value={preferences.timezone}
            onValueChange={(v) => setPreferences({ ...preferences, timezone: v })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC-5">UTC-5 (New York)</SelectItem>
              <SelectItem value="UTC+0">UTC+0 (London)</SelectItem>
              <SelectItem value="UTC+1">UTC+1 (Rabat / Paris)</SelectItem>
              <SelectItem value="UTC+3">UTC+3 (Riyadh)</SelectItem>
            </SelectContent>
          </Select>
        </Card>
      </div>

      {/* Notifications & Privacy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <Label className="font-medium">{t('notifications.title')}</Label>
          <p className="text-sm text-gray-500">{t('notifications.description')}</p>
          <div className="mt-4 space-y-3">
            {Object.entries(preferences.notificationChannels || {}).map(([key, val]) => (
              <div key={key}>
                <div className="flex items-center justify-between">
                  <span>{key}</span>
                  <Switch
                    checked={val as boolean}
                    onCheckedChange={(v) =>
                      setPreferences({
                        ...preferences,
                        notificationChannels: {
                          ...preferences.notificationChannels,
                          [key]: v,
                        },
                      })
                    }
                  />
                </div>
                <Divider />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <Label className="font-medium">{t('privacy.title')}</Label>
          <p className="text-sm text-gray-500">{t('privacy.description')}</p>
          <div className="mt-4 flex items-center justify-between">
            <span>{t('privacy.publicProfile')}</span>
            <Switch
              checked={preferences.publicProfile}
              onCheckedChange={(v) => setPreferences({ ...preferences, publicProfile: v })}
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span>{t('privacy.onlineStatus')}</span>
            <Switch
              checked={preferences.showOnlineStatus}
              onCheckedChange={(v) => setPreferences({ ...preferences, showOnlineStatus: v })}
            />
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} variant="primary" disabled={saving} className="px-6">
          {saving ? t('save.saving') : t('save.label')}
        </Button>
      </div>
    </div>
  );
}
