"use client";

import { DateRangePicker } from "@/components/DatePicker";
import { Label } from "@/components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { cx } from "@/lib/utils";
import {
  RiMapPinLine,
  RiMastercardLine,
  RiPhoneLine,
  RiVideoLine,
  RiVisaFill,
} from "@remixicon/react";

import Table from "./Table";

export default function Filter() {
  const t = useTranslations("appointments.history.filters");

  const countries = [
    { value: "all", label: t("allTypes"), icon: null },
    { value: "video", label: t("video"), icon: RiVideoLine },
    { value: "phone", label: t("phone"), icon: RiPhoneLine },
    { value: "physical", label: t("inPerson"), icon: RiMapPinLine },
  ];

  const status = [
    { value: "all", label: t("all"), disabled: false },
    {
      value: "completed",
      label: t("completed"),
      color: "bg-blue-600 dark:bg-blue-500",
    },
    {
      value: "processing",
      label: t("confirmed"),
      color: "bg-gray-400 dark:bg-orange-600",
    },
    {
      value: "failed",
      label: t("canceled"),
      color: "bg-red-500 dark:bg-red-500",
    },
    {
      value: "refund-requested",
      label: t("absent"),
      color: "bg-violet-500 dark:bg-violet-500",
    },
  ];

  const payment = [
    { value: "all", label: t("all"), disabled: false },
    {
      value: "payed",
      label: t("paid"),
      disabled: false,
      icon: RiVisaFill,
    },
    {
      value: "not_payed",
      label: t("notPaid"),
      disabled: false,
      icon: RiMastercardLine,
    },
  ];

  return (
    <div className="relative">
      <div className="rounded-lg border border-gray-200 bg-white pb-20 dark:border-gray-800 dark:bg-gray-950 h-full">
        <div className="grid grid-cols-1 gap-4 border-b border-gray-200 p-6 dark:border-gray-800 sm:grid-cols-2 md:grid-cols-4">
          {/* Date */}
          <div className="w-full">
            <Label htmlFor="date_1" className="font-medium">
              {t("date")}
            </Label>
            <DateRangePicker
              id="date_1"
              defaultValue={{
                from: new Date(new Date().setDate(new Date().getDate() - 10)),
                to: new Date(),
              }}
              className="mt-2"
            />
          </div>

          {/* Type */}
          <div className="w-full">
            <Label htmlFor="country_1" className="font-medium">
              {t("type")}
            </Label>
            <Select defaultValue="all">
              <SelectTrigger
                id="country_1"
                name="country_1"
                className="mt-2 sm:w-full"
              >
                <SelectValue placeholder={t("select")} />
              </SelectTrigger>
              <SelectContent>
                {countries.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Statut */}
          <div className="w-full">
            <Label htmlFor="status_1" className="font-medium">
              {t("status")}
            </Label>
            <Select defaultValue="all">
              <SelectTrigger
                id="status_1"
                name="status_1"
                className="mt-2 sm:w-full"
              >
                <SelectValue placeholder={t("select")} />
              </SelectTrigger>
              <SelectContent>
                {status.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    <div className="flex items-center gap-x-2.5">
                      <span
                        className={cx(
                          item.color,
                          "inline-block size-2 shrink-0 rounded-full",
                        )}
                        aria-hidden={true}
                      />
                      {item.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Paiement */}
          <div className="w-full">
            <Label htmlFor="payment_method" className="font-medium">
              {t("paymentStatus")}
            </Label>
            <Select defaultValue="all">
              <SelectTrigger
                id="payment_method"
                name="payment_method"
                className="mt-2 sm:w-full"
              >
                <SelectValue placeholder={t("select")} />
              </SelectTrigger>
              <SelectContent>
                {payment.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    disabled={item.disabled}
                  >
                    <div className="flex items-center gap-x-2">
                      {item.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table />
      </div>
    </div>
  );
}
