"use client";

import { useTranslations } from "@/lib/i18n/useTranslations";

import React from "react";

import CardsView from "./components/CardsView";
import TransfertDrawer from "./components/TransfertDrawer";

const Page = () => {
  const t = useTranslations("appointments.waitingRoom.page");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="mb-4 flex flex-col items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {t("title")}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("subtitle")}
          </p>
        </div>
        <div>
          <TransfertDrawer />
        </div>
      </div>

      <CardsView />
    </div>
  );
};

export default Page;
