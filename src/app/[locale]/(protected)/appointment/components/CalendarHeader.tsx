"use client";

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
} from "lucide-react";
import type { ElementType } from "react";
import { CalendarViewType } from "./helpers/types";

type CalendarHeaderProps = {
  currentDate: Date;
  view: CalendarViewType;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarViewType) => void;
  showUnavailable: boolean;
  onToggleUnavailable: () => void;
};

export function CalendarHeader({
  currentDate,
  view,
  onNext,
  onPrevious,
  onToday,
  onViewChange,
  showUnavailable,
  onToggleUnavailable,
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

  return (
    <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="flex items-center space-x-2">
        <CalendarIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
          {renderTitle()}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="mr-4 flex">
            {viewButtons.map(({ value, icon: Icon }, index) => (
              <Button
                key={value}
                variant={view === value ? "secondary" : "ghost"}
                onClick={() => onViewChange(value)}
                className={
                  index === 0
                    ? "rounded-l-md rounded-r-none"
                    : index === viewButtons.length - 1
                      ? "rounded-l-none rounded-r-md"
                      : "rounded-none border-l-0 border-r-0"
                }
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
  );
}
