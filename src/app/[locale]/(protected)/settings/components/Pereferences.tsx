'use client';

import { useState } from 'react';
import { Card } from '@/components/Card';
import { Label } from '@/components/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { Switch } from '@/components/Switch';
import { Button } from '@/components/Button';
import useTranslations from '@/lib/i18n/useTranslations';
import { useTranslationsContext } from '@/lib/i18n/TranslationsProvider';
import { getDirection } from '@/lib/i18n/i18n';

const Pereferences = () => {
  const t = useTranslations('settings.preferences');
  const { locale } = useTranslationsContext();
  const dir = getDirection(locale);

  const [language, setLanguage] = useState(locale || 'en');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notifications, setNotifications] = useState({
    appointments: true,
    messages: true,
    system: false,
    billing: true,
  });
  const [timezone, setTimezone] = useState('UTC+1');
  const [publicProfile, setPublicProfile] = useState(true);

  const handleSave = () => {
    const preferences = { language, theme, notifications, timezone, publicProfile };
    console.log('Saved preferences:', preferences);
    alert('Preferences updated successfully!');
  };

  return (
    <div dir={dir} className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-lg font-bold text-gray-900 dark:text-gray-50">{t('title') || 'Preferences'}</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {t('description') || 'Manage how the app looks, notifies you, and displays information.'}
      </p>

      <Card className="mt-8 space-y-8">
        {/* Language & Locale */}
        <section>
          <Label className="font-medium">{t('language.title') || 'Language'}</Label>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('language.description') || 'Select your preferred language for the interface.'}</p>
          <div className="mt-3 w-full sm:max-w-xs">
            <Select value={language}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Theme */}
        <section>
          <Label className="font-medium">{t('theme.title') || 'Theme'}</Label>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('theme.description') || 'Choose your preferred appearance.'}
          </p>
          <div className="mt-3 w-full sm:max-w-xs">
            <Select value={theme} onValueChange={(v) => setTheme(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t('theme.light') || 'Light'}</SelectItem>
                <SelectItem value="dark">{t('theme.dark') || 'Dark'}</SelectItem>
                <SelectItem value="system">{t('theme.system') || 'System Default'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <Label className="font-medium">{t('notifications.title') || 'Notifications'}</Label>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('notifications.description') || 'Choose when you want to receive alerts.'}
          </p>
          <div className="mt-4 space-y-3">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="capitalize text-gray-800 dark:text-gray-100">{key}</span>
                <Switch
                  checked={value}
                  onCheckedChange={(v) =>
                    setNotifications((prev) => ({ ...prev, [key]: v }))
                  }
                />
              </div>
            ))}
          </div>
        </section>

        {/* Privacy */}
        <section>
          <Label className="font-medium">{t('privacy.title') || 'Privacy'}</Label>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('privacy.description') || 'Control who can see your profile and workspace info.'}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span>{t('privacy.publicProfile') || 'Public profile'}</span>
            <Switch checked={publicProfile} onCheckedChange={setPublicProfile} />
          </div>
        </section>

        {/* Timezone */}
        <section>
          <Label className="font-medium">{t('timezone.title') || 'Timezone'}</Label>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('timezone.description') || 'Set your preferred timezone for appointments.'}
          </p>
          <div className="mt-3 w-full sm:max-w-xs">
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC-5">UTC-5 (New York)</SelectItem>
                <SelectItem value="UTC+0">UTC+0 (London)</SelectItem>
                <SelectItem value="UTC+1">UTC+1 (Rabat / Paris)</SelectItem>
                <SelectItem value="UTC+3">UTC+3 (Riyadh)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <div className="flex justify-end">
          <Button variant="primary" className="px-6" onClick={handleSave}>
            {t('save') || 'Save Preferences'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Pereferences;
