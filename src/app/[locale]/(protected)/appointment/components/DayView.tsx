"use client"

import { cx } from "@/lib/utils"
import { isSameDay } from "date-fns"
import { AppointmentChip } from "./AppointmentChip"
import { isTimeWithinRange, parseTime } from "./time"
import { CalendarAppointment } from "./types"
import { useTranslations } from "@/lib/i18n/useTranslations"

type DayViewProps = {
  currentDate: Date
  appointments: CalendarAppointment[]
  onSelectAppointment: (appointment: CalendarAppointment) => void
}

const BUSINESS_HOURS = Array.from({ length: 10 }, (_, index) => index + 9)
const HALF_HOUR_SLOTS = BUSINESS_HOURS.flatMap((hour) => [
  `${hour.toString().padStart(2, "0")}:00`,
  `${hour.toString().padStart(2, "0")}:30`,
])

export function DayView({ currentDate, appointments, onSelectAppointment }: DayViewProps) {
  const t = useTranslations("appointments.calendar.dayView")

  const dayAppointments = appointments.filter((appointment) =>
    isSameDay(new Date(appointment.date), currentDate),
  )

  const startsAt = (appointment: CalendarAppointment, slotHour: number, slotMinute: number) => {
    const start = parseTime(appointment.startTime)
    return !!start && start.hours === slotHour && start.minutes === slotMinute
  }

  const spansSlot = (appointment: CalendarAppointment, slotHour: number, slotMinute: number) => {
    const start = parseTime(appointment.startTime)
    const end = parseTime(appointment.endTime)
    if (!start || !end) return false
    return isTimeWithinRange(start, end, { hours: slotHour, minutes: slotMinute })
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="grid grid-cols-[100px_1fr] border-b border-gray-200 py-3 dark:border-gray-800">
        <div className="pl-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t("hour")}</div>
        <div className="pl-4 text-sm font-medium text-gray-900 dark:text-gray-100">{t("appointments")}</div>
      </div>
      <div>
        {HALF_HOUR_SLOTS.map((slot, index) => {
          const [hourStr, minuteStr] = slot.split(":")
          const hour = Number(hourStr)
          const minute = Number(minuteStr)

          const timeAppointments = dayAppointments.filter((appointment) =>
            spansSlot(appointment, hour, minute) || startsAt(appointment, hour, minute),
          )

          return (
            <div
              key={slot}
              className={cx(
                "grid grid-cols-[100px_1fr] border-b border-gray-200 dark:border-gray-800",
                index % 2 === 0 && "bg-gray-50 dark:bg-gray-900/50",
              )}
            >
              <div className="border-r border-gray-200 py-4 pr-3 text-right text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                {slot}
              </div>
              <div className="p-2">
                {timeAppointments.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {timeAppointments.map((appointment) => (
                      <AppointmentChip
                        key={`${slot}-${appointment.id}`}
                        appointment={appointment}
                        onSelect={onSelectAppointment}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-6" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
