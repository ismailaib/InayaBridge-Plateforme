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
  RiMastercardLine,
  RiVisaFill
} from "@remixicon/react";
import React from "react";
import type { DateRange } from "react-day-picker";

import AppointmentsTable from "./AppointmentsTable";

export interface FilterState {
  dateRange: DateRange | undefined;
  consultationType: string;
  status: string;
  paymentStatus: string;
}

export default function Filter() {
  const t = useTranslations("appointments.history.filters");

  const [filters, setFilters] = React.useState<FilterState>({
    dateRange: {
      from: new Date(new Date().setDate(new Date().getDate() - 10)),
      to: new Date(),
    },
    consultationType: "all",
    status: "all",
    paymentStatus: "all",
  });

  const statuses = [
    { value: "all", label: t("all"), disabled: false, color: "" },
    {
      value: "COMPLETED",
      label: t("completed"),
      color: "bg-blue-600 dark:bg-blue-500",
      disabled: false,
    },
    {
      value: "CONFIRMED",
      label: t("confirmed"),
      color: "bg-green-500 dark:bg-green-600",
      disabled: false,
    },
    {
      value: "CANCELLED",
      label: t("canceled"),
      color: "bg-red-500 dark:bg-red-500",
      disabled: false,
    },
    {
      value: "PENDING",
      label: t("absent"),
      color: "bg-orange-500 dark:bg-orange-500",
      disabled: false,
    },
    {
      value: "IN_PROGRESS",
      label: "En cours",
      color: "bg-purple-500 dark:bg-purple-500",
      disabled: false,
    },
    {
      value: "ARRIVED",
      label: "Arrivé",
      color: "bg-teal-500 dark:bg-teal-500",
      disabled: false,
    },
  ];

  const paymentStatuses = [
    { value: "all", label: t("all"), disabled: false },
    {
      value: "paid",
      label: t("paid"),
      disabled: false,
      icon: RiVisaFill,
    },
    {
      value: "not_paid",
      label: t("notPaid"),
      disabled: false,
      icon: RiMastercardLine,
    },
  ];

  const handleDateChange = (range: DateRange | undefined) => {
    setFilters(prev => ({ ...prev, dateRange: range }));
  };

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, status: value }));
  };

  const handlePaymentStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, paymentStatus: value }));
  };

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
              defaultValue={filters.dateRange}
              onChange={handleDateChange}
              className="mt-2"
            />
          </div>

          {/* Statut */}
          <div className="w-full">
            <Label htmlFor="status_1" className="font-medium">
              {t("status")}
            </Label>
            <Select
              defaultValue={filters.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger
                id="status_1"
                name="status_1"
                className="mt-2 sm:w-full"
              >
                <SelectValue placeholder={t("select")} />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    disabled={item.disabled}
                  >
                    <div className="flex items-center gap-x-2.5">
                      {item.color && (
                        <span
                          className={cx(
                            item.color,
                            "inline-block size-2 shrink-0 rounded-full",
                          )}
                          aria-hidden={true}
                        />
                      )}
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
            <Select
              defaultValue={filters.paymentStatus}
              onValueChange={handlePaymentStatusChange}
            >
              <SelectTrigger
                id="payment_method"
                name="payment_method"
                className="mt-2 sm:w-full"
              >
                <SelectValue placeholder={t("select")} />
              </SelectTrigger>
              <SelectContent>
                {paymentStatuses.map((item) => (
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
        <AppointmentsTable filters={filters} />
      </div>
    </div>
  );
}