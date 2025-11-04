"use client";

import { Employee } from "@/api/employees";
import { Service } from "@/api/services";
import { Button } from "@/components/Button";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { arSA, enUS, fr } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Calendar as CalendarViewIcon,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  RotateCcw,
} from "lucide-react";
import type { ElementType } from "react";
import DepartementServiceFilter from "./header/DepartementServiceFilter";
import DoctorFilter from "./header/DoctorFilter";
import PriceFilter from "./header/PriceFilter";
import { CalendarViewType } from "./helpers/types";

import { ConditionFilter } from "./header/PriceFilter";
import { CalendarPreferences } from "./header/CalendarPreferences";

type CalendarHeaderProps = {
  currentDate: Date;
  view: CalendarViewType;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarViewType) => void;
  showUnavailable: boolean;
  onToggleUnavailable: () => void;
  selectedStatus: string | null;
  onStatusSelect: (status: string | null) => void;
  services: Service[];
  employees: Employee[];
  selectedDoctor: string | null;
  onDoctorChange: (doctorId: string | null) => void;
  selectedServices: string[];
  onServicesChange: (serviceIds: string[]) => void;
  selectedPrice: ConditionFilter | undefined;
  onPriceChange: (price: ConditionFilter | undefined) => void;
  showUnavailableDays: boolean;
  showAddAppointment: boolean;
  onToggleUnavailableDays: () => void;
  onToggleAddAppointment: () => void;
  prefsLoading: boolean;
};

export function CalendarHeader({
  currentDate,
  view,
  onNext,
  onPrevious,
  onToday,
  onViewChange,
  selectedStatus,
  onStatusSelect,
  services,
  employees,
  selectedDoctor,
  onDoctorChange,
  selectedServices,
  onServicesChange,
  selectedPrice,
  onPriceChange,
  showUnavailableDays,
  showAddAppointment,
  onToggleUnavailableDays,
  onToggleAddAppointment,
  prefsLoading,
}: CalendarHeaderProps) {
  const t = useTranslations("appointments.calendar");

  const locale =
    t("locale") === "ar" ? arSA : t("locale") === "fr" ? fr : enUS;

  const renderTitle = () => {
    switch (view) {
      case "month":
        return format(currentDate, "MMMM yyyy", { locale });
      case "week":
        return (
          <>
            {format(startOfWeek(currentDate, { weekStartsOn: 1 }), "d MMM", {
              locale,
            })}{" "}
            -{" "}
            {format(endOfWeek(currentDate, { weekStartsOn: 1 }), "d MMM yyyy", {
              locale,
            })}
          </>
        );
      case "day":
        return format(currentDate, "EEEE d MMMM yyyy", { locale });
      case "list":
      default:
        return t("views.list");
    }
  };

  const viewButtons: { value: CalendarViewType; icon: ElementType }[] = [
    { value: "month", icon: CalendarViewIcon },
    { value: "week", icon: LayoutGrid },
    { value: "day", icon: CalendarIcon },
    { value: "list", icon: List },
  ];

  const statuses = [
    { label: "PENDING", color: "bg-yellow-500" },
    { label: "CONFIRMED", color: "bg-green-500" },
    { label: "CANCELLED", color: "bg-red-500" },
    { label: "ARRIVED", color: "bg-purple-500" },
    { label: "IN_PROGRESS", color: "bg-blue-500" },
    { label: "COMPLETED", color: "bg-emerald-500" },
  ];

  return (
    <div className="flex flex-col space-y-2 mb-4">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            {renderTitle()}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="mr-4 flex gap-2">
              {viewButtons.map(({ value, icon: Icon }, index) => (
                <Button
                  key={value}
                  variant={view === value ? "secondary" : "ghost"}
                  onClick={() => onViewChange(value)}
                  className={"rounded-lg"}
                >
                  <Icon className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">{t(`views.${value}`)}</span>
                </Button>
              ))}
            </div>

            <Button onClick={onToday} variant="secondary">
              {t("today")}
            </Button>
            <div className="flex">
              <Button
                onClick={onPrevious}
                variant="secondary"
                className="rounded-r-none"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={onNext}
                variant="secondary"
                className="rounded-l-none border-l-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center pt-4  justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          {statuses.map((status) => (
            <div
              key={status.label}
              onClick={() =>
                onStatusSelect(
                  selectedStatus === status.label ? null : status.label
                )
              }
              className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md transition ${selectedStatus === status.label
                ? "bg-gray-200 dark:bg-gray-700"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
              <span
                className={`h-3 w-3 rounded-sm ${status.color}`}
                aria-hidden="true"
              />
              <span className="text-sm text-gray-700 dark:text-gray-200 font-normal hover:dark:text-white">
                {status.label}
              </span>
            </div>
          ))}

          {selectedStatus && (
            <button
              onClick={() => onStatusSelect(null)}
              className="flex items-center gap-2 m-0 p-0 bg-transparent hover:bg-transparent text-sm text-blue-500 hover:underline"
            >
              <RotateCcw className="h-4 w-4" />
              Réinitialiser
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <DoctorFilter employees={employees} selectedDoctor={selectedDoctor} onDoctorChange={onDoctorChange} />
          <DepartementServiceFilter services={services} selectedServices={selectedServices} onServicesChange={onServicesChange} />
          <PriceFilter selectedPrice={selectedPrice} onPriceChange={onPriceChange} />
          <CalendarPreferences 
            showUnavailableDays={showUnavailableDays}
            showAddAppointment={showAddAppointment}
            onToggleUnavailableDays={onToggleUnavailableDays}
            onToggleAddAppointment={onToggleAddAppointment}
            loading={prefsLoading}
          />
        </div>
      </div>

    </div>
  );
}
