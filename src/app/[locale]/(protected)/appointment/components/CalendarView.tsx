"use client"

import { SetStateAction, useEffect, useState } from "react"
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  parseISO,
  addMonths,
  subMonths,
  isToday,
} from "date-fns"
import { fr } from "date-fns/locale"
import { cx } from "@/lib/utils"
import { Button } from "@/components/Button"
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  LayoutGrid,
  Calendar as CalendarViewIcon,
  List,
} from "lucide-react"
import { getAppointments } from "../api/appointment"
import { AppointmentDetails } from "./AppointmentDetails"

const CalendarHeader = ({
  currentDate,
  view,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
}: {
  currentDate: Date
  view: string
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onViewChange: (view: string) => void
}) => {
  return (
    <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="flex items-center space-x-2">
        <CalendarIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
          {view === "month" && format(currentDate, "MMMM yyyy", { locale: fr })}
          {view === "week" && (
            <>
              {format(startOfWeek(currentDate, { weekStartsOn: 1 }), "d MMM", {
                locale: fr,
              })}{" "}
              -{" "}
              {format(
                endOfWeek(currentDate, { weekStartsOn: 1 }),
                "d MMM yyyy",
                { locale: fr },
              )}
            </>
          )}
          {view === "day" &&
            format(currentDate, "EEEE d MMMM yyyy", { locale: fr })}
          {view === "list" && "Vue Liste"}
        </h2>
      </div>

      <div className="flex items-center space-x-2">
        <div className="mr-4 flex">
          <Button
            variant={view === "month" ? "secondary" : "ghost"}
            onClick={() => onViewChange("month")}
            className="rounded-l-md rounded-r-none"
          >
            <CalendarViewIcon className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Mois</span>
          </Button>
          <Button
            variant={view === "week" ? "secondary" : "ghost"}
            onClick={() => onViewChange("week")}
            className="rounded-none border-l-0 border-r-0"
          >
            <LayoutGrid className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Semaine</span>
          </Button>
          <Button
            variant={view === "day" ? "secondary" : "ghost"}
            onClick={() => onViewChange("day")}
            className="rounded-none border-l-0 border-r-0"
          >
            <CalendarIcon className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Jour</span>
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            onClick={() => onViewChange("list")}
            className="rounded-l-none rounded-r-md"
          >
            <List className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Liste</span>
          </Button>
        </div>

        <Button onClick={onToday} variant="secondary">
          Aujourd&lsquo;hui
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
  )
}

const MonthView = ({
  currentDate,
  appointments,
  onSelectAppointment,
}: {
  currentDate: Date
  appointments: {
    id: string
    patient: string
    phoneNumber: string
    type: string
    typeColor: string
    date: Date
    startTime: string
    endTime: string
    location: string
    notes: string
    confirmed: boolean
    date_of_birth: string
  }[]
  onSelectAppointment: (appointment: any) => void
}) => {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

  // Filter appointments for the visible days
  const visibleAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date)
    return appointmentDate >= startDate && appointmentDate <= endDate
  })

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 text-center dark:border-gray-800 dark:bg-gray-900">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
            >
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
                key={day.toString()}
                className={cx(
                  "h-32 min-h-[8rem] overflow-y-auto border-b p-1 sm:p-2",
                  !isSameMonth(day, currentDate) &&
                  "bg-gray-50 text-gray-400 dark:bg-gray-900 dark:text-gray-600",
                  isSameDay(day, new Date()) &&
                  "bg-blue-50 dark:bg-blue-900/20",
                )}
              >
                <div className="mb-1 text-right">
                  <span
                    className={cx(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full text-sm",
                      isToday(day) && "bg-blue-600 text-white dark:bg-blue-500",
                      !isToday(day) &&
                      isSameMonth(day, currentDate) &&
                      "text-gray-900 dark:text-gray-100",
                      !isSameMonth(day, currentDate) &&
                      "text-gray-400 dark:text-gray-600",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map((appointment) => (
                    <button
                      key={appointment.id}
                      onClick={() => onSelectAppointment(appointment)}
                      className={cx(
                        "w-full flex items-center gap-2 rounded-lg bg-blue-50/60 px-2 py-1 text-left shadow-sm hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/60",
                        appointment.typeColor,
                      )}
                    >
                      <span className="flex-shrink-0 rounded bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white dark:bg-blue-500">
                        {appointment.startTime}
                      </span>
                      <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                        {appointment.patient}
                      </span>
                    </button>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="px-1 text-xs text-gray-500 dark:text-gray-400">
                      + {dayAppointments.length - 3} plus
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

const WeekView = ({
  currentDate,
  appointments,
  onSelectAppointment,
}: {
  currentDate: Date
  appointments: {
    id: string
    patient: string
    phoneNumber: string
    type: string
    typeColor: string
    date: Date
    startTime: string
    endTime: string
    location: string
    notes: string
    confirmed: boolean
  }[]
  onSelectAppointment: (appointment: any) => void
}) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Business hours (09:00 - 18:00)
  const hours = Array.from({ length: 10 }, (_, i) => i + 9)

  // Filter appointments for the visible week
  const visibleAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date)
    return appointmentDate >= weekStart && appointmentDate <= weekEnd
  })

  // Helper function to parse time and get hour/minutes
  const parseTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number)
    return { hours, minutes }
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px] rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        {/* Header with days */}
        <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-800">
          <div className="border-r border-gray-200 py-2 pl-4 dark:border-gray-800">
            <div className="text-xs text-gray-500 dark:text-gray-400">Time</div>
          </div>
          {days.map((day) => (
            <div
              key={day.toString()}
              className={cx(
                "border-r border-gray-200 py-2 text-center dark:border-gray-800",
                isToday(day) && "bg-blue-50 dark:bg-blue-900/20",
              )}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {format(day, "EEE", { locale: fr })}
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

        {/* Time grid */}
        <div className="relative">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8" style={{ minHeight: '64px' }}>
              {/* Hour label */}
              <div className="border-r border-gray-200 py-4 pr-2 text-right text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                {hour.toString().padStart(2, '0')}:00
              </div>

              {/* Day columns */}
              {days.map((day) => (
                <div
                  key={`${day.toString()}-${hour}`}
                  className={cx(
                    "relative border-b border-r border-gray-200 dark:border-gray-800",
                    isToday(day) && "bg-blue-50 dark:bg-blue-900/10",
                  )}
                  style={{ minHeight: '64px' }}
                >
                  {visibleAppointments
                    .filter((appointment) => {
                      const appointmentDate = new Date(appointment.date)
                      const startTime = parseTime(appointment.startTime)
                      return (
                        isSameDay(appointmentDate, day) &&
                        startTime.hours === hour
                      )
                    })
                    .map((appointment) => {
                      return (
                        <button
                          key={appointment.id}
                          onClick={() => onSelectAppointment(appointment)}
                          className={cx(
                            "w-full flex items-center gap-2 rounded-lg bg-blue-50/60 px-2 py-1 text-left shadow-sm hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/60",
                            appointment.typeColor,
                          )}
                        >
                          <span className="flex-shrink-0 rounded bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white dark:bg-blue-500">
                            {appointment.startTime}
                          </span>
                          <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                            {appointment.patient}
                          </span>
                        </button>
                      )
                    })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const DayView = ({
  currentDate,
  appointments,
  onSelectAppointment,
}: {
  currentDate: Date
  appointments: {
    id: string
    patient: string
    phoneNumber: string
    type: string
    typeColor: string
    date: Date
    startTime: string
    endTime: string
    location: string
    notes: string
    confirmed: boolean
  }[]
  onSelectAppointment: (appointment: any) => void
}) => {
  // Business hours (9:00 - 18:00)
  const hours = Array.from({ length: 10 }, (_, i) => i + 9)
  const halfHours: string[] = []

  hours.forEach((hour) => {
    halfHours.push(`${hour.toString().padStart(2, '0')}:00`)
    halfHours.push(`${hour.toString().padStart(2, '0')}:30`)
  })

  // Filter appointments for the selected day
  const dayAppointments = appointments.filter((appointment) =>
    isSameDay(new Date(appointment.date), currentDate),
  )

  // Helper function to parse time and get hour/minutes
  const parseTime = (timeString: { split: (arg0: string) => { (): any; new(): any; map: { (arg0: NumberConstructor): [any, any]; new(): any } } }) => {
    const [hours, minutes] = timeString.split(':').map(Number)
    return { hours, minutes }
  }

  // Helper function to check if appointment starts at a specific time slot
  const appointmentStartsAtTime = (appointment: { id?: string; patient?: string; phoneNumber?: string; type?: string; typeColor?: string; date?: Date; startTime: any; endTime?: string; location?: string; notes?: string; confirmed?: boolean }, targetHour: number, targetMinute: number) => {
    const startTime = parseTime(appointment.startTime)
    return startTime.hours === targetHour && startTime.minutes === targetMinute
  }

  // Helper function to check if appointment spans across a time slot
  const appointmentSpansTime = (appointment: { id?: string; patient?: string; phoneNumber?: string; type?: string; typeColor?: string; date?: Date; startTime: any; endTime: any; location?: string; notes?: string; confirmed?: boolean }, targetHour: number, targetMinute: number) => {
    const startTime = parseTime(appointment.startTime)
    const endTime = parseTime(appointment.endTime)

    // Convert times to minutes for easier comparison
    const startMinutes = startTime.hours * 60 + startTime.minutes
    const endMinutes = endTime.hours * 60 + endTime.minutes
    const targetMinutes = targetHour * 60 + targetMinute

    return targetMinutes >= startMinutes && targetMinutes < endMinutes
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="grid grid-cols-[100px_1fr] border-b border-gray-200 py-3 dark:border-gray-800">
        <div className="pl-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          Heure
        </div>
        <div className="pl-4 text-sm font-medium text-gray-900 dark:text-gray-100">
          Rendez-vous
        </div>
      </div>

      <div>
        {halfHours.map((time, index) => {
          const [hourStr, minuteStr] = time.split(":")
          const hour = parseInt(hourStr)
          const minute = parseInt(minuteStr)

          // Get appointments that start at this exact time
          const startingAppointments = dayAppointments.filter((appointment) =>
            appointmentStartsAtTime(appointment, hour, minute)
          )

          // Get appointments that span across this time slot (for ongoing appointments display)
          const spanningAppointments = dayAppointments.filter((appointment) =>
            appointmentSpansTime(appointment, hour, minute) &&
            !appointmentStartsAtTime(appointment, hour, minute)
          )

          // Combine both types of appointments
          const timeAppointments = [...startingAppointments, ...spanningAppointments]

          return (
            <div
              key={time}
              className={cx(
                "grid grid-cols-[100px_1fr] border-b border-gray-200 dark:border-gray-800",
                index % 2 === 0 && "bg-gray-50 dark:bg-gray-900/50",
              )}
            >
              <div className="border-r border-gray-200 py-4 pr-3 text-right text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                {time}
              </div>
              <div className="p-2">
                {timeAppointments.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {timeAppointments.map((appointment) => {
                      return (
                        <button
                          key={appointment.id}
                          onClick={() => onSelectAppointment(appointment)}
                          className={cx(
                            "w-full flex items-center gap-2 rounded-lg bg-blue-50/60 px-2 py-1 text-left shadow-sm hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/60",
                            appointment.typeColor,
                          )}
                        >
                          <span className="flex-shrink-0 rounded bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white dark:bg-blue-500">
                            {appointment.startTime}
                          </span>
                          <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                            {appointment.patient}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="h-6"></div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ListView = ({
  currentDate,
  appointments,
  onSelectAppointment,
}: {
  currentDate: Date
  appointments: {
    id: string
    patient: string
    phoneNumber: string
    type: string
    typeColor: string
    date: Date
    startTime: string
    endTime: string
    location: string
    notes: string
    confirmed: boolean
  }[]
  onSelectAppointment: (appointment: any) => void
}) => {
  // Get this month's appointments
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  const monthAppointments = appointments
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.date)
      return appointmentDate >= monthStart && appointmentDate <= monthEnd
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Group appointments by date
  const groupedAppointments = monthAppointments.reduce(
    (groups: Record<string, typeof monthAppointments>, appointment) => {
      const date = format(new Date(appointment.date), "yyyy-MM-dd")
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(appointment)
      return groups
    },
    {} as Record<string, typeof monthAppointments>,
  )

  return (
    <div className="space-y-6">
      {Object.keys(groupedAppointments).map((date) => {
        const dateObj = parseISO(date)
        return (
          <div key={date}>
            <h3 className="mb-2 flex items-center space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              <span
                className={cx(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                  isToday(dateObj) && "bg-blue-600 text-white dark:bg-blue-500",
                  !isToday(dateObj) && "bg-gray-100 dark:bg-gray-800",
                )}
              >
                {format(dateObj, "d")}
              </span>
              <span>{format(dateObj, "EEEE d MMMM", { locale: fr })}</span>
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
                      className="flex w-full items-center px-4 py-4 hover:bg-gray-50 sm:px-6 dark:hover:bg-gray-900"
                    >
                      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <div className="flex items-center">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                              {appointment.patient}
                            </p>
                            {appointment.type === "local" && (
                              <span className="ml-2 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                Cabinet principale
                              </span>
                            )}

                            {appointment.type === "in-person" && (
                              <span className="ml-2 inline-block rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                                À domicile
                              </span>
                            )}

                            {appointment.type === "video" && (
                              <span className="ml-2 inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-900 dark:text-red-200">
                                Visio Conférence
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                              <p>
                                {appointment.startTime} - {appointment.endTime}
                              </p>
                            </div>
                            <div className="ml-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                              <p>{appointment.location}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex-shrink-0 sm:mt-0">
                          <div
                            className={cx(
                              "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium",
                              appointment.confirmed
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                            )}
                          >
                            {appointment.confirmed ? "Confirmé" : "À confirmer"}
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      })}
    </div>
  )
}


export default function DoctorCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState("month")
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAppointments();
        const data = response.data;

        // Optionally map or clean data
        const cleanedData = data.map((item: any, index: number) => ({
          id: item.id || `appointment-${index}`,
          patient: item.patient.first_name || "--",
          phoneNumber: item.patient_phone_number || "--",
          type: item.consultationType || "--",
          date: item.date || "--",
          startTime: item.startTime || "--",
          endTime: item.endTime || "--",
          location: item.location || "--",
          date_of_birth: item.patient.date_of_birth || "--",
          notes: item.motif || "--",
          confirmed: item.status === "confirmed",
          consultationType: item.consultationType || "--",
          motif: item.motif || "--",
          timeSpentInWaitingRoom: item.timeSpentInWaitingRoom || {
            enterTime: "--",
            endTime: "--",
          },
          timeOfExitFromConsultation: item.timeOfExitFromConsultation || "--",
        }));

        setAppointments(cleanedData);
      } catch (error) {
        console.error("Erreur lors du chargement des rendez-vous", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1))
    } else if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1))
    } else if (view === "day") {
      setCurrentDate(subDays(currentDate, 1))
    }
  }

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1))
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1))
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, 1))
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleViewChange = (newView: SetStateAction<string>) => {
    setView(newView)
  }

  const handleSelectAppointment = (appointment: SetStateAction<null>) => {
    setSelectedAppointment(appointment)
    setDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="mt-8">

      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={handleViewChange}
      />

      {view === "month" && (
        <MonthView
          currentDate={currentDate}
          appointments={appointments}
          onSelectAppointment={handleSelectAppointment}
        />
      )}
      {view === "week" && (
        <WeekView
          currentDate={currentDate}
          appointments={appointments}
          onSelectAppointment={handleSelectAppointment}
        />
      )}
      {view === "day" && (
        <DayView
          currentDate={currentDate}
          appointments={appointments}
          onSelectAppointment={handleSelectAppointment}
        />
      )}
      {view === "list" && (
        <ListView
          currentDate={currentDate}
          appointments={appointments}
          onSelectAppointment={handleSelectAppointment}
        />
      )}

      <AppointmentDetails
        appointment={selectedAppointment}
        isOpen={dialogOpen}
        onClose={async () => {
          setDialogOpen(false);
          setLoading(true);
          try {
            const response = await getAppointments();
            const data = response.data;
            const cleanedData = data.map((item: any, index: number) => ({
              id: item.id || `appointment-${index}`,
              patient: item.patient.first_name || "--",
              phoneNumber: item.patient_phone_number || "--",
              type: item.consultationType || "--",
              date: item.date || "--",
              startTime: item.startTime || "--",
              endTime: item.endTime || "",
              location: item.location || "--",
              date_of_birth: item.patient.date_of_birth || "--",
              notes: item.motif || "--",
              confirmed: item.status === "confirmed",
              consultationType: item.consultationType || "--",
              motif: item.motif || "--",
              timeSpentInWaitingRoom: item.timeSpentInWaitingRoom || {
                enterTime: "--",
                endTime: "--",
              },
              timeOfExitFromConsultation: item.timeOfExitFromConsultation || "--",
            }));
            setAppointments(cleanedData);
          } catch (error) {
            console.error("Erreur lors du chargement des rendez-vous", error);
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  )
}


