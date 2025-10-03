"use client";

import { useTranslations } from "@/lib/i18n/useTranslations";
import { cx } from "@/lib/utils";
import { endOfMonth, format, isToday, parseISO, startOfMonth } from "date-fns";
import { arSA, enUS, fr } from "date-fns/locale";
import { Clock, MapPin } from "lucide-react";

import { CalendarAppointment } from "./types";

type ListViewProps = {
  currentDate: Date;
  appointments: CalendarAppointment[];
  onSelectAppointment: (appointment: CalendarAppointment) => void;
};

export function ListView({
  currentDate,
  appointments,
  onSelectAppointment,
}: ListViewProps) {
  const t = useTranslations("appointments.calendar.listView");

  const locale = t("locale") === "ar" ? arSA : t("locale") === "fr" ? fr : enUS;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const monthAppointments = appointments
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= monthStart && appointmentDate <= monthEnd;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const groupedAppointments = monthAppointments.reduce<
    Record<string, CalendarAppointment[]>
  >((groups, appointment) => {
    const date = format(new Date(appointment.date), "yyyy-MM-dd");
    if (!groups[date]) groups[date] = [];
    groups[date].push(appointment);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      {Object.keys(groupedAppointments).map((date) => {
        const dateObj = parseISO(date);
        return (
          <div key={date}>
            <h3 className="mb-2 flex items-center space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              <span
                className={cx(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                  isToday(dateObj)
                    ? "bg-blue-600 text-white dark:bg-blue-500"
                    : "bg-gray-100 dark:bg-gray-800",
                )}
              >
                {format(dateObj, "d")}
              </span>
              <span>{format(dateObj, "EEEE d MMMM", { locale })}</span>
            </h3>

            <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
              <ul
                role="list"
                className="divide-y divide-gray-200 dark:divide-gray-800"
              >
                {groupedAppointments[date].map((appointment) => (
                  <li key={appointment.id}>
                    <button
                      onClick={() => onSelectAppointment(appointment)}
                      className="flex w-full items-center px-4 py-4 text-left hover:bg-gray-50 sm:px-6 dark:hover:bg-gray-900"
                    >
                      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <div className="flex items-center">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                              {appointment.patient}
                            </p>
                            {appointment.type === "local" && (
                              <span className="ml-2 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {t("types.local")}
                              </span>
                            )}
                            {appointment.type === "in-person" && (
                              <span className="ml-2 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {t("types.home")}
                              </span>
                            )}
                            {appointment.type === "video" && (
                              <span className="ml-2 inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-900 dark:text-red-200">
                                {t("types.video")}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <Clock className="mr-1.5 h-4 w-4" />
                              {appointment.startTime} - {appointment.endTime}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="mr-1.5 h-4 w-4" />
                              {appointment.location}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex-shrink-0 sm:mt-0">
                          <div
                            className={cx(
                              "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium",
                              appointment.confirmed
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                            )}
                          >
                            {appointment.confirmed
                              ? t("status.confirmed")
                              : t("status.pending")}
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
