'use client';
import { Card } from '@/components/Card';
import { useCallback, useEffect, useState } from 'react';
import InviteMembers from './Invitations/InviteMembers';
import Workspace from './workspace/Workspace';
import Pricing from './pricing/Pricing';
import { onboardingStatus } from '@/api/tenant';

type StepKey = 'tenantProfile' | 'invitationsSchedule' | 'accountActivation';

const stepDefinitions: Omit<Step, 'completed' | 'disabled'>[] = [
  {
    step: 1,
    title: 'Configurer votre établissement',
    description: 'Créez ou rejoignez un établissement.',
    buttonText: null,
    key: 'tenantProfile',
  },
  {
    step: 2,
    title: 'Inviter vos collègues',
    description:
      'Ajoutez d autres médecins ou collaborateurs de votre établissement',
    buttonText: null,
    key: 'invitationsSchedule',
  },
  {
    step: 3,
    title: 'Activer votre compte',
    description:
      'Une fois la configuration terminée, vous pouvez activer votre compte et accéder à votre tableau de bord.',
    buttonText: 'Activer mon compte',
    key: 'accountActivation',
  },
];

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

      const processedSteps: Step[] = stepDefinitions.map((step, index) => {
        const completed = statusMapping[step.key];
        
        // logic: if first step is completed, enable both second and third steps
        let disabled = false;
        if (index === 0) {
          // First step is never disabled
          disabled = false;
        } else {
          // Steps 2 and 3 are enabled if step 1 is completed
          disabled = !statusMapping.tenantProfile;
        }

        let buttonText: React.ReactNode;
        if (step.key === 'tenantProfile') {
          buttonText = <Workspace onSuccess={() => fetchOnboardingStatus()} />;
        } else if (step.key === 'invitationsSchedule') {
          buttonText = <InviteMembers onSuccess={() => fetchOnboardingStatus()} />;
        } else {
          buttonText = <Pricing />;
        }

        return {
          ...step,
          buttonText,
          completed,
          disabled,
        };
      });

      setSteps(processedSteps);
    } catch (err) {
      console.error('Error fetching onboarding status:', err);
    } finally {
      setLoading(false);
    }
  }, []);

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
        Finalisez votre inscription
      </h3>
      <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
        Pour accéder pleinement au tableau de bord, veuillez compléter les étapes suivantes.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {steps.map((item) => (
          <div
            key={item.title}
            className={`flex flex-col justify-between border-l-2 py-1 pl-4 transition-colors ${item.completed
              ? 'border-emerald-500'
              : 'border-emerald-100 dark:border-[#33ccad]/20'
              }`}
          >
            <div>
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-[#33ccad] dark:bg-[#33ccad]/20 dark:text-[#33ccad]">
                {item.completed && '✓'} Étape {item.step}
              </span>
              <h4 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-50">
                {item.title}
              </h4>
              <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
                {item.description}
              </p>
            </div>
            <div
              className={`transition-opacity ${item.disabled
                ? 'opacity-50 pointer-events-none'
                : 'opacity-100'
                }`}
            >
              {item.completed ? (
                <div className="flex items-center justify-center py-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                  ✓ Étape terminée
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
                Félicitations ! Toutes les étapes sont terminées.
              </p>
              <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                Vous pouvez maintenant accéder pleinement à votre tableau de bord.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}