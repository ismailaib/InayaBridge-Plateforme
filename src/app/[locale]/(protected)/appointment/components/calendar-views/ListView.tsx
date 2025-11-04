"use client";

import { useTranslations } from "@/lib/i18n/useTranslations";
import { cx } from "@/lib/utils";
import { differenceInYears, endOfMonth, format, isToday, parseISO, startOfMonth } from "date-fns";
import { arSA, enUS, fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

import { CalendarAppointment } from "../helpers/types";

type ListViewProps = {
  currentDate: Date;
  appointments: CalendarAppointment[];
  onSelectAppointment: (appointment: CalendarAppointment) => void;
  doctorProfileId: string;
  onAppointmentUpdated: (updatedAppointment: CalendarAppointment) => void;
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

  const monthAppointments = appointments.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const groupedAppointments = monthAppointments.reduce<Record<string, CalendarAppointment[]>>(
    (groups, appointment) => {
      const date = format(new Date(appointment.date), "yyyy-MM-dd");
      if (!groups[date]) groups[date] = [];
      groups[date].push(appointment);
      return groups;
    },
    {}
  );

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
    exit: { opacity: 0, y: -10 },
  };

  const getPatientAge = (dob?: string) => {
    if (!dob) return "-";
    return differenceInYears(new Date(), new Date(dob));
  };

  return (
    <div className="space-y-6">
      {Object.keys(groupedAppointments).map((date) => {
        const dateObj = parseISO(date);
        return (
          <div key={date}>
            <h3 className="mb-4 flex items-center space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              <span
                className={cx(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                  isToday(dateObj)
                    ? "bg-blue-600 text-white dark:bg-blue-500"
                    : "bg-gray-100 dark:bg-gray-800"
                )}
              >
                {format(dateObj, "d")}
              </span>
              <span>{format(dateObj, "EEEE d MMMM", { locale })}</span>
            </h3>

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Start Time
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Patient
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Age
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Motif
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Waiting Room
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Exit Time
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Notes
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-950 dark:divide-gray-800">
                  {groupedAppointments[date].map((appointment, index) => (
                    <motion.tr
                      key={appointment.id}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={itemVariants}
                      onClick={() => onSelectAppointment(appointment)}
                      className={cx(
                        "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900",
                        appointment.isUrgent && "bg-red-50 dark:bg-red-900/20"
                      )}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {appointment.startTime}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        <div className="flex items-center gap-2">
                          {appointment.patientFullName || appointment.patient || "-"}
                          {appointment.isUrgent && (
                            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {appointment.date_of_birth ? `${getPatientAge(appointment.date_of_birth)} (${appointment.date_of_birth})` : "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {appointment.consultationType || "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {appointment.motif || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {appointment.price ? `$${appointment.price}` : "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {appointment.timeSpentInWaitingRoom
                          ? `${appointment.timeSpentInWaitingRoom.enterTime} - ${appointment.timeSpentInWaitingRoom.endTime}`
                          : "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {appointment.endTime || "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {appointment.location || "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {appointment.notes || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={cx(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                            appointment.status === "CONFIRMED"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          )}
                        >
                          {t(`status.${appointment.status.toLowerCase()}`)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}