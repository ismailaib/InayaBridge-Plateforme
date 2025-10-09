"use client";

import { Button } from "@/components/Button";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { Plus } from "lucide-react";


import Link from "next/link";

import CalendarView from "./components/CalendarView";

const Page = () => {
  const t = useTranslations("appointments.page");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-row items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {t("title")}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("description")}
          </p>
        </div>
        <div>
          <Link href="/appointment/create">
            <Button variant="primary" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              {t("newAppointment")}
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <CalendarView />
      </div>
    </div>
  );
};

export default Page;
