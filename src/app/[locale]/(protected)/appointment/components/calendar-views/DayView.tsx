"use client";

import { useTranslations } from "@/lib/i18n/useTranslations";
import { cx } from "@/lib/utils";
import { isSameDay } from "date-fns";
import React, { useState, useEffect } from "react";
import { AppointmentChip } from "../AppointmentChip";
import { isTimeWithinRange, parseTime } from "../helpers/time";
import { CalendarAppointment } from "../helpers/types";
import { getAvailabilitySlotsByDoctor } from "@/api/disponibility";
import { motion, AnimatePresence } from "framer-motion";

type DayViewProps = {
  currentDate: Date;
  appointments: CalendarAppointment[];
  onSelectAppointment: (appointment: CalendarAppointment) => void;
  doctorProfileId: string;
};

const BUSINESS_HOURS = Array.from({ length: 24 }, (_, index) => index);
const HALF_HOUR_SLOTS = BUSINESS_HOURS.flatMap((hour) => [
  `${hour.toString().padStart(2, "0")}:00`,
  `${hour.toString().padStart(2, "0")}:30`,
]);

interface AvailabilitySlot {
  dayOfWeek: string;
  active: boolean;
  timeSlots: { from: string; to: string }[];
}

export function DayView({
  currentDate,
  appointments,
  onSelectAppointment,
  doctorProfileId,
}: DayViewProps) {
  const t = useTranslations("appointments.calendar.dayView");
  const [showUnavailable, setShowUnavailable] = useState(true);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);

  useEffect(() => {
    if (doctorProfileId) {
      getAvailabilitySlotsByDoctor(doctorProfileId)
        .then((res: { data: AvailabilitySlot[] }) => setAvailability(res.data))
        .catch((error) => console.error("Error fetching availability:", error));
    }
  }, [doctorProfileId]);

  const dayAppointments = appointments.filter((appointment) =>
    isSameDay(new Date(appointment.date), currentDate)
  );

  const dayOfWeek = currentDate
    .toLocaleString("en-US", { weekday: "long" })
    .toUpperCase();
  const dayAvailability = availability.find(
    (slot) => slot.dayOfWeek === dayOfWeek && slot.active
  );

  const isSlotAvailable = (slotTime: string) => {
    if (!dayAvailability || dayAvailability.timeSlots.length === 0) return false;
    const target = parseTime(slotTime);
    if (!target) return false;
    return dayAvailability.timeSlots.some(({ from, to }) => {
      const start = parseTime(from);
      const end = parseTime(to);
      if (!start || !end) return false;
      return isTimeWithinRange(start, end, target);
    });
  };

  const shouldRenderSlot = (slotTime: string) => showUnavailable || isSlotAvailable(slotTime);

  const startsAt = (appointment: CalendarAppointment, slotHour: number, slotMinute: number) => {
    const start = parseTime(appointment.startTime);
    return !!start && start.hours === slotHour && start.minutes === slotMinute;
  };

  const spansSlot = (appointment: CalendarAppointment, slotHour: number, slotMinute: number) => {
    const start = parseTime(appointment.startTime);
    const end = parseTime(appointment.endTime);
    if (!start || !end) return false;
    return isTimeWithinRange(start, end, { hours: slotHour, minutes: slotMinute });
  };

  const unavailableBgVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const cellVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

  return (
    <div>
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        {/* Header */}
        <div className="flex flex-row items-center justify-between">
          <div className="grid grid-cols-[100px_1fr] border-b border-gray-200 py-3 dark:border-gray-800">
            <div className="pl-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              {t("hour")}
            </div>
            <div className="pl-4 text-sm font-medium text-gray-900 dark:text-gray-100">
              {t("appointments")}
            </div>
          </div>
          <div className="flex justify-end px-4">
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
        </div>

        {/* Slots */}
        {HALF_HOUR_SLOTS.filter(shouldRenderSlot).map((slot, index) => {
          const [hourStr, minuteStr] = slot.split(":");
          const hour = Number(hourStr);
          const minute = Number(minuteStr);

          const timeAppointments = dayAppointments.filter(
            (appointment) => spansSlot(appointment, hour, minute) || startsAt(appointment, hour, minute)
          );

          const available = isSlotAvailable(slot);

          return (
            <motion.div
              key={slot}
              className={cx(
                "grid grid-cols-[100px_1fr] border-b border-gray-200 dark:border-gray-800 min-h-[48px]",
                index % 2 === 0 && "bg-gray-50 dark:bg-gray-900/50"
              )}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={cellVariants}
            >
              <div className="border-r border-gray-200 py-4 pr-3 text-right text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                {slot}
              </div>
              <div className="p-2 relative">
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

                <div className="relative z-10 flex flex-wrap gap-2">
                  {timeAppointments.map((appointment) => (
                    <AppointmentChip
                      key={`${slot}-${appointment.id}`}
                      appointment={appointment}
                      onSelect={onSelectAppointment}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
