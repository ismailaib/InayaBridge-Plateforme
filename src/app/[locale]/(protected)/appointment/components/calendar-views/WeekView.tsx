"use client";

import { useTranslations } from "@/lib/i18n/useTranslations";
import { cx } from "@/lib/utils";
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  startOfWeek,
} from "date-fns";
import { arSA, enUS, fr } from "date-fns/locale";
import React, { useState, useEffect, useMemo } from "react";
import { AppointmentChip } from "../AppointmentChip";
import { parseTime } from "../helpers/time";
import { CalendarAppointment } from "../helpers/types";
import { getAvailabilitySlotsByDoctor } from "@/api/disponibility";
import { motion, AnimatePresence } from "framer-motion";

type WeekViewProps = {
  currentDate: Date;
  appointments: CalendarAppointment[];
  onSelectAppointment: (appointment: CalendarAppointment) => void;
  doctorProfileId: string;
};

const HOURS = Array.from({ length: 24 }, (_, index) => index);

interface AvailabilitySlot {
  id: string;
  createdAt: string;
  updatedAt: string;
  doctorProfileId: string;
  dayOfWeek: string;
  fromTime: string | null;
  toTime: string | null;
  active: boolean;
  timeSlots: { from: string; to: string }[];
}

export function WeekView({
  currentDate,
  appointments,
  onSelectAppointment,
  doctorProfileId,
}: WeekViewProps) {
  const t = useTranslations("appointments.calendar.weekView");
  const locale = t("locale") === "ar" ? arSA : t("locale") === "fr" ? fr : enUS;

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const visibleAppointments = useMemo(
    () =>
      appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= weekStart && appointmentDate <= weekEnd;
      }),
    [appointments, weekStart, weekEnd]
  );

  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [showUnavailable, setShowUnavailable] = useState(true);

  useEffect(() => {
    if (doctorProfileId) {
      getAvailabilitySlotsByDoctor(doctorProfileId)
        .then((res: { data: AvailabilitySlot[] }) => {
          setAvailability(res.data);
        })
        .catch((error: any) =>
          console.error("Error fetching availability:", error)
        );
    }
  }, [doctorProfileId]);

  const isHourAvailable = (day: Date, hour: number) => {
    const dayOfWeek = format(day, "EEEE").toUpperCase();
    const dayAvailability = availability.find(
      (slot) => slot.dayOfWeek === dayOfWeek
    );

    if (!dayAvailability || !dayAvailability.active) return false;

    for (const ts of dayAvailability.timeSlots || []) {
      const from = parseTime(ts.from);
      const to = parseTime(ts.to);
      if (from && to && hour >= from.hours && hour < to.hours) {
        return true;
      }
    }

    return false;
  };

  const unavailableBgVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const cellVariants =  { hidden: { opacity: 0 }, visible: { opacity: 1 } };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px] rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {t("weekLabel")}
          </div>
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
        <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-800">
          <div className="border-r border-gray-200 py-2 pl-4 dark:border-gray-800">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {t("timeLabel")}
            </div>
          </div>
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={cx(
                "border-r border-gray-200 py-2 text-center dark:border-gray-800",
                isToday(day) && "bg-blue-50 dark:bg-blue-900/20"
              )}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {format(day, "EEEE", { locale })}
              </div>
              <div
                className={cx(
                  "mx-auto mt-1 flex h-6 w-6 items-center justify-center rounded-full text-sm",
                  isToday(day)
                    ? "bg-blue-600 text-white dark:bg-blue-500"
                    : "text-gray-600 dark:text-gray-300"
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>

        {/* 24-hour grid */}
        <div className="relative">
          {HOURS.map((hour) => {
            const visibleCells = days
              .map((day) => {
                const available = isHourAvailable(day, hour);
                if (!showUnavailable && !available) return null;
                return (
                  <motion.div
                    key={`${day.toISOString()}-${hour}`}
                    className="relative border-b border-r border-gray-200 dark:border-gray-800 transition-colors min-h-[64px]"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={cellVariants}
                  >
                    {/* Animated unavailable background */}
                    <AnimatePresence>
                      {!available && showUnavailable && (
                        <motion.div
                          className="absolute inset-0 z-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#f32b113b_2px,rgba(17,24,39,0.5)_4px)]"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={unavailableBgVariants}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Appointments */}
                    <div className="relative z-10">
                      {visibleAppointments
                        .filter((appointment) => {
                          const appointmentDate = new Date(appointment.date);
                          const start = parseTime(appointment.startTime);
                          return !!start && isSameDay(appointmentDate, day) && start.hours === hour;
                        })
                        .map((appointment) => (
                          <AppointmentChip
                            key={appointment.id}
                            appointment={appointment}
                            onSelect={onSelectAppointment}
                          />
                        ))}
                    </div>
                  </motion.div>
                );
              })
              .filter(Boolean);

            if (visibleCells.length === 0) return null;

            return (
              <div key={hour} className="grid grid-cols-8">
                <div className="border-r border-gray-200 py-4 pr-2 text-right text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                  {hour.toString().padStart(2, "0")}:00
                </div>
                {visibleCells}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
