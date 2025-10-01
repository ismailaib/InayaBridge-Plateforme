'use client';
import { Card } from '@/components/Card';
import { useCallback, useEffect, useState } from 'react';
import InviteMembers from './Invitations/InviteMembers';
import Workspace from './workspace/Workspace';
import Pricing from './pricing/Pricing';
import { onboardingStatus } from '@/api/tenant';
import useTranslations from '@/lib/i18n/useTranslations';

type StepKey = 'tenantProfile' | 'invitationsSchedule' | 'accountActivation';

type Step = {
  step: number;
  title: string;
  description: string;
  buttonText: React.ReactNode;
  key: StepKey;
  completed: boolean;
  disabled: boolean;
};

export default function DoctorOnboarding() {
  const t = useTranslations('dashboard.onboarding');
  const [steps, setSteps] = useState<Step[]>([]);
  const [_, setStatus] = useState<Record<StepKey, boolean>>({
    tenantProfile: false,
    invitationsSchedule: false,
    accountActivation: false,
  });
  const [loading, setLoading] = useState(true);

  const completedSteps = steps.filter((step) => step.completed).length;
  const totalSteps = steps.length;

  const fetchOnboardingStatus = useCallback(async () => {
    try {
      setLoading(true);

      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(storedUser);
      const res = await onboardingStatus(parsed.id);

      const statusData = res.data;

      const statusMapping: Record<StepKey, boolean> = {
        tenantProfile: Boolean(statusData.tenantProfileCompleted),
        invitationsSchedule: Boolean(statusData.invitationsScheduleCompleted),
        accountActivation: Boolean(statusData.accountActivationCompleted),
      };

      setStatus(statusMapping);

      const processedSteps: Step[] = [
        {
          step: 1,
          key: 'tenantProfile',
          title: t('steps.tenantProfile.title'),
          description: t('steps.tenantProfile.description'),
          buttonText: <Workspace onSuccess={() => fetchOnboardingStatus()} />,
          completed: statusMapping.tenantProfile,
          disabled: false,
        },
        {
          step: 2,
          key: 'invitationsSchedule',
          title: t('steps.invitationsSchedule.title'),
          description: t('steps.invitationsSchedule.description'),
          buttonText: <InviteMembers onSuccess={() => fetchOnboardingStatus()} />,
          completed: statusMapping.invitationsSchedule,
          disabled: !statusMapping.tenantProfile,
        },
        {
          step: 3,
          key: 'accountActivation',
          title: t('steps.accountActivation.title'),
          description: t('steps.accountActivation.description'),
          buttonText: <Pricing />,
          completed: statusMapping.accountActivation,
          disabled: !statusMapping.tenantProfile,
        },
      ];

      setSteps(processedSteps);
    } catch (err) {
      console.error('Error fetching onboarding status:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchOnboardingStatus();
  }, [fetchOnboardingStatus]);

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-8"></div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-l-2 border-gray-200 pl-4 py-4">
                <div className="h-6 bg-gray-200 rounded w-20 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
        {t('title')}
      </h3>
      <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
        {t('description')}
      </p>
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {steps.map((item) => (
          <div
            key={item.title}
            className={`flex flex-col justify-between border-l-2 py-1 pl-4 transition-colors ${
              item.completed
                ? 'border-emerald-500'
                : 'border-emerald-100 dark:border-[#33ccad]/20'
            }`}
          >
            <div>
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-[#33ccad] dark:bg-[#33ccad]/20 dark:text-[#33ccad]">
                {item.completed && '✓'} {t('step')} {item.step}
              </span>
              <h4 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-50">
                {item.title}
              </h4>
              <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
                {item.description}
              </p>
            </div>
            <div
              className={`transition-opacity ${
                item.disabled ? 'opacity-50 pointer-events-none' : 'opacity-100'
              }`}
            >
              {item.completed ? (
                <div className="flex items-center justify-center py-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                  {t('completedStep')}
                </div>
              ) : (
                item.buttonText
              )}
            </div>
          </div>
        ))}
      </div>

      {completedSteps === totalSteps && (
        <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                {t('allDone.title')}
              </p>
              <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                {t('allDone.subtitle')}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
