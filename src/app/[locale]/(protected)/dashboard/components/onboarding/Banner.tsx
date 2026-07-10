"use client";

import { onboardingStatus } from "@/api/tenant";
import { Card } from "@/components/Card";
import useTranslations from "@/lib/i18n/useTranslations";

import { useCallback, useEffect, useState } from "react";

import Pricing from "./pricing/Pricing";
import Workspace from "./workspace/Workspace";
import Verification from "./verification/page";

type StepKey = "tenantProfile" | "profileVerification" | "accountActivation";

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
  const t = useTranslations("dashboard.onboarding");
  const [steps, setSteps] = useState<Step[]>([]);
  const [_, setStatus] = useState<Record<StepKey, boolean>>({
    tenantProfile: false,
    profileVerification: false,
    accountActivation: false,
  });
  const [loading, setLoading] = useState(true);

  const completedSteps = steps.filter((step) => step.completed).length;
  const totalSteps = steps.length;

  const fetchOnboardingStatus = useCallback(async () => {
    try {
      setLoading(true);

      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(storedUser);
      const res = await onboardingStatus(parsed.id);

      const statusData = res.data;

      const statusMapping: Record<StepKey, boolean> = {
        profileVerification: Boolean(statusData.profileVerificationCompleted),
        tenantProfile: Boolean(statusData.tenantProfileCompleted),
        accountActivation: Boolean(statusData.tenantSubscriptionCompleted),
      };

      setStatus(statusMapping);

      const processedSteps: Step[] = [
        {
          step: 1,
          key: "profileVerification",
          title: t("steps.profileVerification.title"),
          description: t("steps.profileVerification.description"),
          buttonText: <Verification onSuccess={() => fetchOnboardingStatus()} />,
          completed: statusMapping.profileVerification,
          disabled: false,
        },
        {
          step: 2,
          key: "tenantProfile",
          title: t("steps.tenantProfile.title"),
          description: t("steps.tenantProfile.description"),
          buttonText: <Workspace onSuccess={() => fetchOnboardingStatus()} />,
          completed: statusMapping.tenantProfile,
          disabled: false,
        },
        {
          step: 3,
          key: "accountActivation",
          title: t("steps.accountActivation.title"),
          description: t("steps.accountActivation.description"),
          buttonText: <Pricing />,
          completed: statusMapping.accountActivation,
          disabled: !statusMapping.tenantProfile,
        },
      ];

      setSteps(processedSteps);
    } catch (err) {
      console.error("Error fetching onboarding status:", err);
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
        {t("title")}
      </h3>
      <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
        {t("description")}
      </p>
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {steps.map((item) => (
          <div
            key={item.title}
            className={`flex flex-col justify-between border-l-2 py-1 pl-4 transition-colors ${
              item.completed
                ? "border-blue-500"
                : "border-blue-100 dark:border-[#3b82f6]/20"
            }`}
          >
            <div>
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-[#3b82f6] dark:bg-[#3b82f6]/20 dark:text-[#3b82f6]">
                {item.completed && "✓"} {t("step")} {item.step}
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
                item.disabled ? "opacity-50 pointer-events-none" : "opacity-100"
              }`}
            >
              {item.completed ? (
                <div className="flex items-center justify-center py-2 text-blue-600 dark:text-blue-400 font-medium text-sm">
                  {t("completedStep")}
                </div>
              ) : (
                item.buttonText
              )}
            </div>
          </div>
        ))}
      </div>

      {completedSteps === totalSteps && (
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
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
            <div className="mx-3">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                {t("allDone.title")}
              </p>
              <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                {t("allDone.subtitle")}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
