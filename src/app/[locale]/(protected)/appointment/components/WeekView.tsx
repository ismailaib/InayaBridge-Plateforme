"use client"

import { cx } from "@/lib/utils"
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  startOfWeek,
} from "date-fns"
import { fr, enUS, arSA } from "date-fns/locale"
import { CalendarAppointment } from "./types"
import { AppointmentChip } from "./AppointmentChip"
import { parseTime } from "./time"
import { useTranslations } from "@/lib/i18n/useTranslations"

type WeekViewProps = {
  currentDate: Date
  appointments: CalendarAppointment[]
  onSelectAppointment: (appointment: CalendarAppointment) => void
}

const BUSINESS_HOURS = Array.from({ length: 10 }, (_, index) => index + 9)

export function WeekView({ currentDate, appointments, onSelectAppointment }: WeekViewProps) {
  const t = useTranslations("appointments.calendar.weekView")

  // set correct locale dynamically
  const locale = t("locale") === "ar" ? arSA : t("locale") === "fr" ? fr : enUS

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const visibleAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date)
    return appointmentDate >= weekStart && appointmentDate <= weekEnd
  })

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px] rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        {/* Header row: days */}
        <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-800">
          <div className="border-r border-gray-200 py-2 pl-4 dark:border-gray-800">
            <div className="text-xs text-gray-500 dark:text-gray-400">{t("timeLabel")}</div>
          </div>
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={cx(
                "border-r border-gray-200 py-2 text-center dark:border-gray-800",
                isToday(day) && "bg-blue-50 dark:bg-blue-900/20",
              )}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {format(day, "EEEE", { locale })}
              </div>
              <div
                className={cx(
                  "mx-auto mt-1 flex h-6 w-6 items-center justify-center rounded-full text-sm",
                  isToday(day) && "bg-blue-600 text-white dark:bg-blue-500",
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>

        {/* Time slots grid */}
        <div className="relative">
          {BUSINESS_HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-8" style={{ minHeight: "64px" }}>
              <div className="border-r border-gray-200 py-4 pr-2 text-right text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                {hour.toString().padStart(2, "0")}:00
              </div>
              {days.map((day) => (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className={cx(
                    "relative border-b border-r border-gray-200 dark:border-gray-800",
                    isToday(day) && "bg-blue-50 dark:bg-blue-900/10",
                  )}
                  style={{ minHeight: "64px" }}
                >
                  {visibleAppointments
                    .filter((appointment) => {
                      const appointmentDate = new Date(appointment.date)
                      const start = parseTime(appointment.startTime)
                      return (
                        !!start &&
                        isSameDay(appointmentDate, day) &&
                        start.hours === hour
                      )
                    })
                    .map((appointment) => (
                      <AppointmentChip
                        key={appointment.id}
                        appointment={appointment}
                        onSelect={onSelectAppointment}
                      />
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
