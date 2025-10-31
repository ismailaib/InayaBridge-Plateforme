"use client";

import React, { useEffect, useState } from "react";
import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek } from "date-fns";
import { getAvailabilitySlotsByDoctor } from "@/api/disponibility";
import { cx } from "@/lib/utils";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { AppointmentChip } from "../AppointmentChip";
import { CalendarAppointment } from "../helpers/types";
import { motion, AnimatePresence } from "framer-motion";

type MonthViewProps = {
  currentDate: Date;
  appointments: CalendarAppointment[];
  onSelectAppointment: (appointment: CalendarAppointment) => void;
  doctorProfileId: string;
};

interface AvailabilitySlot {
  id: string;
  dayOfWeek: string;
  active: boolean;
  timeSlots: { from: string; to: string }[];
}

export function MonthView({
  currentDate,
  appointments,
  onSelectAppointment,
  doctorProfileId,
}: MonthViewProps) {
  const t = useTranslations("appointments.calendar.monthView");
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [showUnavailable, setShowUnavailable] = useState(true);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  useEffect(() => {
    if (doctorProfileId) {
      getAvailabilitySlotsByDoctor(doctorProfileId)
        .then((res: { data: AvailabilitySlot[] }) => setAvailability(res.data))
        .catch((err) => console.error("Error fetching availability:", err));
    }
  }, [doctorProfileId]);

  const isDayAvailable = (day: Date) => {
    const dayOfWeek = format(day, "EEEE").toUpperCase();
    const slot = availability.find((s) => s.dayOfWeek === dayOfWeek && s.active);
    return !!slot;
  };

  const shouldRenderDay = (day: Date) => showUnavailable || isDayAvailable(day);

  // Header
  const firstWeek = days.slice(0, 7);
  const headerDays = firstWeek.map((day) => format(day, "EEE")); // Mon, Tue, ...

  // Framer Motion variants
  const dayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const unavailableBgVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        {/* Header with toggle */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t("monthLabel")}</div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={showUnavailable}
              onChange={(e) => setShowUnavailable(e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-gray-400 accent-blue-600"
            />
            {t("showUnavailableLabel") || "Show unavailable slots"}
          </label>
        </div>

        {/* Days header */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 text-center dark:border-gray-800 dark:bg-gray-900">
          {headerDays.map((day, idx) => (
            <div key={idx} className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">{day}</div>
          ))}
        </div>

        {/* Days grid */}
        <AnimatePresence>
          <div className="grid grid-cols-7 divide-x divide-gray-200 dark:divide-gray-800">
            {days.map((day) => {
              const dayAppointments = appointments.filter((appointment) =>
                isSameDay(new Date(appointment.date), day)
              );
              const available = isDayAvailable(day);

              // Placeholder for hidden unavailable days
              if (!shouldRenderDay(day)) {
                return (
                  <motion.div
                    key={day.toISOString()}
                    className={cx("h-32 min-h-[8rem] border-b p-1 sm:p-2 bg-gray-50 dark:bg-gray-900")}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={dayVariants}
                  />
                );
              }

              return (
                <motion.div
                  key={day.toISOString()}
                  className={cx(
                    "h-32 min-h-[8rem] overflow-y-auto border-b p-1 sm:p-2 relative",
                    !isSameMonth(day, currentDate) && "bg-gray-50 text-gray-400 dark:bg-gray-900 dark:text-gray-600",
                    isSameDay(day, new Date()) && "bg-blue-50 dark:bg-blue-900/20"
                  )}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dayVariants}
                >
                  {/* Animated Unavailable Red Texture */}
                  <AnimatePresence>
                    {!available && showUnavailable && (
                      <motion.div
                        className="absolute inset-0 z-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#f32b113b_2px,rgba(17,24,39,0.5)_4px)] rounded-lg"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={unavailableBgVariants}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Day number */}
                  <div className="mb-1 text-right relative z-10">
                    <span
                      className={cx(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-sm",
                        isToday(day) && "bg-blue-600 text-white dark:bg-blue-500",
                        !isToday(day) && isSameMonth(day, currentDate) &&
                        "text-gray-900 dark:text-gray-100",
                        !isSameMonth(day, currentDate) && "text-gray-400 dark:text-gray-600"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </div>

                  {/* Appointments */}
                  <div className="space-y-1 relative z-10">
                    {dayAppointments.slice(0, 3).map((appointment) => (
                      <AppointmentChip
                        key={appointment.id}
                        appointment={appointment}
                        onSelect={onSelectAppointment}
                      />
                    ))}
                    {dayAppointments.length > 3 && (
                      <div className="px-1 text-xs text-gray-500 dark:text-gray-400">
                        + {dayAppointments.length - 3} {t("more")}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
