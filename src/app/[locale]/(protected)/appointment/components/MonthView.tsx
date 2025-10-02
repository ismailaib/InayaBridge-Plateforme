"use client"

import { cx } from "@/lib/utils"
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { AppointmentChip } from "./AppointmentChip"
import { CalendarAppointment } from "./types"
import { useTranslations } from "@/lib/i18n/useTranslations"

type MonthViewProps = {
  currentDate: Date
  appointments: CalendarAppointment[]
  onSelectAppointment: (appointment: CalendarAppointment) => void
}

export function MonthView({ currentDate, appointments, onSelectAppointment }: MonthViewProps) {
  const t = useTranslations("appointments.calendar.monthView")

  const DAYS_OF_WEEK = [
    t("days.mon"),
    t("days.tue"),
    t("days.wed"),
    t("days.thu"),
    t("days.fri"),
    t("days.sat"),
    t("days.sun"),
  ]

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const visibleAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date)
    return appointmentDate >= startDate && appointmentDate <= endDate
  })

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 text-center dark:border-gray-800 dark:bg-gray-900">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 divide-x divide-gray-200 dark:divide-gray-800">
          {days.map((day) => {
            const dayAppointments = visibleAppointments.filter((appointment) =>
              isSameDay(new Date(appointment.date), day),
            )

            return (
              <div
                key={day.toISOString()}
                className={cx(
                  "h-32 min-h-[8rem] overflow-y-auto border-b p-1 sm:p-2",
                  !isSameMonth(day, currentDate) && "bg-gray-50 text-gray-400 dark:bg-gray-900 dark:text-gray-600",
                  isSameDay(day, new Date()) && "bg-blue-50 dark:bg-blue-900/20",
                )}
              >
                <div className="mb-1 text-right">
                  <span
                    className={cx(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full text-sm",
                      isToday(day) && "bg-blue-600 text-white dark:bg-blue-500",
                      !isToday(day) && isSameMonth(day, currentDate) && "text-gray-900 dark:text-gray-100",
                      !isSameMonth(day, currentDate) && "text-gray-400 dark:text-gray-600",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                <div className="space-y-1">
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
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
