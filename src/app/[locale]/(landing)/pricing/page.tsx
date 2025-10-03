"use client";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { Switch } from "@/components/Switch";
import { Tooltip } from "@/components/Tooltip";
import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import { Faqs } from "@/components/ui/Faqs";
import useTranslations from "@/lib/i18n/useTranslations";
import { cx } from "@/lib/utils";
import {
  RiCheckLine,
  RiCloudLine,
  RiInformationLine,
  RiSubtractLine,
  RiUserLine,
} from "@remixicon/react";

import React, { Fragment } from "react";

import Link from "next/link";

type FixedPrice = string;
interface VariablePrice {
  monthly: string;
  annually: string;
}
interface Plan {
  key: string;
  isStarter: boolean;
  isRecommended: boolean;
}
interface Feature {
  key: string;
  plans: Record<string, boolean | string>;
}
interface Section {
  key: string;
  features: Feature[];
}

const plans: Plan[] = [
  { key: "essentiel", isStarter: true, isRecommended: false },
  { key: "plus", isStarter: false, isRecommended: false },
  { key: "pro", isStarter: false, isRecommended: true },
];

const sections: Section[] = [
  {
    key: "base",
    features: [
      {
        key: "consultations_video_illimitees",
        plans: { essentiel: true, plus: true, pro: true },
      },
      {
        key: "gestion_patients_dossiers",
        plans: { essentiel: true, plus: true, pro: true },
      },
      {
        key: "messagerie_securisee",
        plans: { essentiel: true, plus: true, pro: true },
      },
      {
        key: "statistiques_rapports_patients",
        plans: { essentiel: true, plus: true, pro: true },
      },
      {
        key: "exports_dossiers_pdf",
        plans: { essentiel: true, plus: true, pro: true },
      },
    ],
  },
  {
    key: "advanced",
    features: [
      {
        key: "rappels_automatiques",
        plans: { essentiel: false, plus: true, pro: true },
      },
      {
        key: "acces_api_integrations",
        plans: { essentiel: false, plus: false, pro: true },
      },
    ],
  },
  {
    key: "support",
    features: [
      {
        key: "support_par_mail",
        plans: { essentiel: "48h", plus: "24h", pro: "Prioritaire" },
      },
      {
        key: "mise_en_avant_professionnelle",
        plans: { essentiel: false, plus: false, pro: true },
      },
    ],
  },
];

const isVariablePrice = (
  price: FixedPrice | VariablePrice,
): price is VariablePrice => (price as VariablePrice).monthly !== undefined;

export default function Pricing() {
  const [billingFrequency, setBillingFrequency] = React.useState<
    "monthly" | "annually"
  >("monthly");
  const t = useTranslations("pricing");

  return (
    <div className="px-3">
      {/* Header */}
      <section
        aria-labelledby="pricing-title"
        className="animate-slide-up-fade"
        style={{ animationDuration: "600ms", animationFillMode: "backwards" }}
      >
        <Badge>{t("badge")}</Badge>
        <h1 className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-700 dark:text-gray-400">
          {t("description")}
        </p>
      </section>

      {/* Billing Switch */}
      <section
        id="pricing-overview"
        className="mt-20 animate-slide-up-fade"
        aria-labelledby="pricing-overview"
        style={{
          animationDuration: "600ms",
          animationDelay: "200ms",
          animationFillMode: "backwards",
        }}
      >
        <div className="flex items-center justify-center gap-2">
          <Label
            htmlFor="switch"
            className="text-base font-medium sm:text-sm dark:text-gray-400"
          >
            {t("billing.monthly")}
          </Label>
          <Switch
            id="switch"
            checked={billingFrequency === "annually"}
            onCheckedChange={() =>
              setBillingFrequency(
                billingFrequency === "monthly" ? "annually" : "monthly",
              )
            }
          />
          <Label
            htmlFor="switch"
            className="text-base font-medium sm:text-sm dark:text-gray-400"
          >
            {t("billing.annually")}
          </Label>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 gap-x-14 gap-y-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const data = t.raw(`plans.${plan.key}`) as any;
            return (
              <div key={plan.key} className="mt-6">
                {plan.isRecommended ? (
                  <div className="flex h-4 items-center">
                    <div className="relative w-full">
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                      >
                        <div className="w-full border-t border-[#3b82f6] dark:border-[#3b82f6]" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-3 text-xs font-medium text-[#3b82f6] dark:bg-gray-950 dark:text-[#3b82f6]">
                          {t("sections.popular")}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-4 items-center">
                    <div className="h-px w-full bg-gray-200 dark:bg-gray-800" />
                  </div>
                )}
                <div className="mx-auto max-w-md">
                  <h2 className="mt-6 text-sm font-semibold text-gray-900 dark:text-gray-50">
                    {data.name}
                  </h2>
                  <div className="mt-3 flex items-center gap-x-3">
                    <span className="text-5xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">
                      {isVariablePrice(data.price)
                        ? billingFrequency === "monthly"
                          ? data.price.monthly
                          : data.price.annually
                        : data.price}
                    </span>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {t("perUser")}
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col justify-between">
                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                      {data.description}
                    </p>
                    <div className="mt-6">
                      {plan.isStarter ? (
                        <Button variant="secondary" asChild className="group">
                          <Link href={data.buttonLink}>
                            {data.buttonText}
                            <ArrowAnimated />
                          </Link>
                        </Button>
                      ) : (
                        <Button asChild className="group">
                          <Link href={data.buttonLink}>
                            {data.buttonText}
                            <ArrowAnimated />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                  <ul className="mt-8 text-sm text-gray-700 dark:text-gray-400">
                    {data.capacity.map((f: string, idx: number) => (
                      <li key={f} className="flex items-center gap-x-3 py-1.5">
                        {idx === 0 && (
                          <RiUserLine className="size-4 shrink-0 text-gray-500" />
                        )}
                        {idx === 1 && (
                          <RiCloudLine className="size-4 shrink-0 text-gray-500" />
                        )}
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-4 text-sm text-gray-700 dark:text-gray-400">
                    {data.features.map((f: string) => (
                      <li key={f} className="flex items-center gap-x-3 py-1.5">
                        <RiCheckLine className="size-4 shrink-0 text-[#3b82f6] dark:text-[#3b82f6]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Table for large screens */}
      <section className="mx-auto mt-20">
        <div className="mt-20 hidden sm:mt-28 lg:block">
          <table className="w-full table-fixed border-separate border-spacing-0 text-left">
            <thead className="sticky top-28">
              <tr>
                <th className="border-b border-gray-100 bg-white pb-8 dark:border-gray-800 dark:bg-gray-950">
                  <div className="font-semibold leading-7 text-gray-900 dark:text-gray-50">
                    {t("sections.compareTitle")}
                  </div>
                  <div className="text-sm font-normal text-gray-600 dark:text-gray-400">
                    {t("sections.compareSubtitle")}
                  </div>
                </th>
                {plans.map((plan) => {
                  const data = t.raw(`plans.${plan.key}`) as any;
                  return (
                    <th
                      key={plan.key}
                      className="border-b border-gray-100 bg-white px-6 pb-8 dark:border-gray-800 dark:bg-gray-950"
                    >
                      <div
                        className={cx(
                          plan.isStarter
                            ? "text-gray-900 dark:text-gray-50"
                            : "text-[#3b82f6] dark:text-[#3b82f6]",
                          "font-semibold leading-7",
                        )}
                      >
                        {data.name}
                      </div>
                      <div className="text-sm font-normal text-gray-600 dark:text-gray-400">
                        {isVariablePrice(data.price)
                          ? billingFrequency === "monthly"
                            ? data.price.monthly
                            : data.price.annually
                          : data.price}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sections.map((section, idx) => (
                <Fragment key={section.key}>
                  <tr>
                    <th
                      colSpan={4}
                      className={cx(
                        idx === 0 ? "pt-14" : "pt-10",
                        "border-b border-gray-100 pb-4 text-base font-semibold leading-6 text-gray-900 dark:border-gray-800 dark:text-gray-50",
                      )}
                    >
                      {t(`sections.${section.key}`)}
                    </th>
                  </tr>
                  {section.features.map((feature) => (
                    <tr
                      key={feature.key}
                      className="transition hover:bg-[#3b82f6]/30 dark:hover:bg-[#3b82f6]/5"
                    >
                      <th className="flex items-center gap-2 border-b border-gray-100 py-4 text-sm font-normal leading-6 text-gray-900 dark:border-gray-800 dark:text-gray-50">
                        <span>{t(`features.${feature.key}.label`)}</span>
                        {t(`features.${feature.key}.tooltip`) && (
                          <Tooltip
                            side="right"
                            content={t(`features.${feature.key}.tooltip`)}
                          >
                            <RiInformationLine className="size-4 shrink-0 text-gray-700 dark:text-gray-400" />
                          </Tooltip>
                        )}
                      </th>
                      {plans.map((plan) => (
                        <td
                          key={plan.key}
                          className="border-b border-gray-100 px-6 py-4 dark:border-gray-800"
                        >
                          {typeof feature.plans[plan.key] === "string" ? (
                            <div className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                              {t(
                                `features.${feature.key}.${feature.plans[plan.key]}`,
                              )}
                            </div>
                          ) : feature.plans[plan.key] ? (
                            <RiCheckLine className="h-5 w-5 text-[#3b82f6] dark:text-[#3b82f6]" />
                          ) : (
                            <RiSubtractLine className="h-5 w-5 text-gray-400 dark:text-gray-600" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Faqs />
    </div>
  );
}
