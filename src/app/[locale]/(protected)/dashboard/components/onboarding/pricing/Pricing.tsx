import { Button } from "@/components/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/Dialog";
import useTranslations from "@/lib/i18n/useTranslations";
import { cx } from "@/lib/utils";
import { RiCheckboxCircleFill, RiCloseLine } from "@remixicon/react";
import { Wallet } from "lucide-react";

import { useState } from "react";

const Pricing = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("dashboard.pricing");
  const plans = (t.raw("plans") ?? []) as Array<{
    id: string;
    name: string;
    price: string | { monthly: string; annually: string };
    description: string;
    capacity: string[];
    features: string[];
    isStarter: boolean;
    isRecommended: boolean;
    buttonText: string;
    buttonLink: string;
  }>;

  return (
    <div className="flex items-center justify-center pt-6">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="primary" className="w-full">
            <Wallet className="w-4 h-4 mx-2" />
            {t("openDialog")}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-6xl">
          <DialogClose asChild>
            <Button
              className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
              variant="ghost"
            >
              <RiCloseLine className="size-5 shrink-0" />
            </Button>
          </DialogClose>

          <h3 className="font-semibold text-gray-900 dark:text-gray-50 [html[lang=ar]_&]:pt-8">
            {t("title")}
          </h3>
          <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">
            {t("description")}
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cx(
                  plan.isRecommended
                    ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950"
                    : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900",
                  "border-t-2 p-6",
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold leading-8 text-gray-900 dark:text-gray-50">
                    {plan.name}
                  </h3>
                  {plan.isRecommended && (
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                      {t("recommended")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {plan.description}
                </p>
                <p className="mt-6 flex flex-col space-y-1">
                  {typeof plan.price === "string" ? (
                    <span className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
                      {plan.price}
                    </span>
                  ) : (
                    <>
                      <span className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                        {plan.price.monthly}{" "}
                        <span className="text-sm">{t("perMonth")}</span>
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {plan.price.annually} {t("perYear")}
                      </span>
                    </>
                  )}
                </p>

                <div className="mt-8">
                  <Button
                    asChild
                    variant={plan.isRecommended ? "primary" : "secondary"}
                    className="h-10 w-full"
                  >
                    <a href={plan.buttonLink}>{plan.buttonText}</a>
                  </Button>

                  <p className="mt-6 text-sm font-medium text-gray-900 dark:text-gray-50">
                    {t("capacityTitle")}
                  </p>
                  <ul
                    role="list"
                    className="mt-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {plan.capacity.map((item) => (
                      <li
                        key={item}
                        className="flex items-center space-x-2 py-2.5"
                      >
                        <RiCheckboxCircleFill
                          className={cx(
                            plan.isRecommended
                              ? "text-blue-500 dark:text-blue-500"
                              : "text-gray-400 dark:text-gray-600",
                            "size-5 shrink-0",
                          )}
                          aria-hidden={true}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 text-sm font-medium text-gray-900 dark:text-gray-50">
                    {t("featuresTitle")}
                  </p>
                  <ul
                    role="list"
                    className="mt-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center space-x-2 py-2.5"
                      >
                        <RiCheckboxCircleFill
                          className={cx(
                            plan.isRecommended
                              ? "text-blue-500 dark:text-blue-500"
                              : "text-gray-400 dark:text-gray-600",
                            "size-5 shrink-0",
                          )}
                          aria-hidden={true}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pricing;
