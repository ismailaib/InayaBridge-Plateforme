"use client";

import {
  AppointmentUpdateDTO,
  updateAppointment,
} from "@/api/appointments";
import { getAvailabilitySlotsByDoctor } from "@/api/disponibility";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { cx } from "@/lib/utils";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDraggable, useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  startOfWeek,
} from "date-fns";
import { arSA, enUS, fr } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { AppointmentChip } from "../AppointmentChip";
import { parseTime } from "../helpers/time";
import { CalendarAppointment } from "../helpers/types";

type WeekViewProps = {
  currentDate: Date;
  appointments: CalendarAppointment[];
  onSelectAppointment: (appointment: CalendarAppointment) => void;
  doctorProfileId: string;
  onAppointmentUpdated: (updatedAppointment: CalendarAppointment) => void;
  showAddAppointment: boolean;
  showUnavailableDays: boolean;
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

// Draggable Appointment Wrapper
function DraggableAppointment({
  appointment,
  onSelect,
}: {
  appointment: CalendarAppointment;
  onSelect: (appointment: CalendarAppointment) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: appointment.id,
      data: { appointment },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <AppointmentChip appointment={appointment} onSelect={onSelect} />
    </div>
  );
}

// Droppable Time Cell
function DroppableTimeCell({
  day,
  hour,
  appointments: cellAppointments,
  available,
  showUnavailableDays,
  onSelectAppointment,
  onCellClick,
  showAddAppointment,
}: {
  day: Date;
  hour: number;
  appointments: CalendarAppointment[];
  available: boolean;
  showUnavailableDays: boolean;
  onSelectAppointment: (appointment: CalendarAppointment) => void;
  onCellClick: (date: Date, hour: number) => void;
  showAddAppointment: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { setNodeRef, isOver } = useDroppable({
    id: `${day.toISOString()}-${hour}`,
    data: { date: day, hour },
  });

  const unavailableBgVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const cellVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger if clicking the cell itself, not an appointment
    if ((e.target as HTMLElement).closest('[data-appointment]')) {
      return;
    }
    onCellClick(day, hour);
  };

  return (
    <motion.div
      ref={setNodeRef}
      key={`${day.toISOString()}-${hour}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className={cx(
        "relative border-b border-r border-gray-200 dark:border-gray-800 transition-colors min-h-[64px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900",
        isOver && "ring-2 ring-blue-500 ring-inset bg-blue-100 dark:bg-blue-900/30"
      )}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={cellVariants}
    >
      {/* Animated unavailable background */}
      <AnimatePresence>
        {!available && showUnavailableDays && (
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
        {cellAppointments.map((appointment) => (
          <div key={appointment.id} data-appointment>
            <DraggableAppointment
              appointment={appointment}
              onSelect={onSelectAppointment}
            />
          </div>
        ))}
      </div>

      {/* Hover overlay to create appointment */}
      <AnimatePresence>
        {isHovered && cellAppointments.length === 0 && showAddAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            <div className="border-2 border-dashed border-blue-500 dark:border-blue-400 w-full h-full flex flex-col items-center justify-center gap-1 bg-blue-50/50 dark:bg-blue-900/20 pointer-events-auto">
              <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Créer un rendez-vous
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function WeekView({
  currentDate,
  appointments,
  onSelectAppointment,
  doctorProfileId,
  onAppointmentUpdated,
  showAddAppointment,
  showUnavailableDays,
}: WeekViewProps) {
  const t = useTranslations("appointments.calendar.weekView");
  const router = useRouter();
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
  const [activeAppointment, setActiveAppointment] =
    useState<CalendarAppointment | null>(null);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    })
  );

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

  // Handle cell click to create appointment
  const handleCellClick = (date: Date, hour: number) => {
    const formattedDate = format(date, "dd/MM/yyyy");
    const formattedTime = `${hour.toString().padStart(2, "0")}:00`;
    showAddAppointment && router.push(`/appointment/create?date=${formattedDate}&time=${formattedTime}`);
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const appointment = event.active.data.current
      ?.appointment as CalendarAppointment;
    setActiveAppointment(appointment);
  };

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveAppointment(null);

    if (!over) return;

    const appointment = active.data.current
      ?.appointment as CalendarAppointment;
    const newDate = over.data.current?.date as Date;
    const newHour = over.data.current?.hour as number;

    const oldDate = new Date(appointment.date);
    const oldTime = parseTime(appointment.startTime);
    const oldHour = oldTime?.hours || 0;

    // Check if date or time changed
    const dateChanged = !isSameDay(oldDate, newDate);
    const timeChanged = oldHour !== newHour;

    if (dateChanged || timeChanged) {
      console.log("📅 Appointment dropped on new date/time:");
      console.log({
        appointmentId: appointment.id,
        oldDate: format(oldDate, "yyyy-MM-dd"),
        oldTime: appointment.startTime,
        newDate: format(newDate, "yyyy-MM-dd"),
        newTime: `${newHour.toString().padStart(2, "0")}:00`,
      });

      // Calculate new start and end times
      const startTime = parseTime(appointment.startTime);
      const endTime = parseTime(appointment.endTime);
      const duration = startTime && endTime
        ? (endTime.hours * 60 + endTime.minutes) - (startTime.hours * 60 + startTime.minutes)
        : 30; // default 30 minutes

      const newStartTime = `${newHour.toString().padStart(2, "0")}:00`;
      const newEndHour = Math.floor((newHour * 60 + duration) / 60);
      const newEndMinute = (newHour * 60 + duration) % 60;
      const newEndTime = `${newEndHour.toString().padStart(2, "0")}:${newEndMinute.toString().padStart(2, "0")}`;

      // Optimistically update UI
      const updatedAppointment = {
        ...appointment,
        date: format(newDate, "yyyy-MM-dd"),
        startTime: newStartTime,
        endTime: newEndTime,
      };

      onAppointmentUpdated(updatedAppointment);

      // Prepare API payload
      const payload: AppointmentUpdateDTO = {
        isUrgent: appointment.isUrgent,
      };

      if (dateChanged) {
        payload.date = format(newDate, "yyyy-MM-dd");
      }

      if (timeChanged) {
        payload.startTime = newStartTime;
        payload.endTime = newEndTime;
      }

      // Call API
      try {
        await updateAppointment(appointment.id, payload);
        console.log("✅ Appointment updated successfully");
      } catch (error) {
        console.error("❌ Failed to update appointment:", error);
        // Revert on failure
        onAppointmentUpdated(appointment);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto">
        <div className="min-w-[800px] rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">

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
                  if (!showUnavailableDays && !available) return null;

                  const hourAppointments = visibleAppointments.filter(
                    (appointment) => {
                      const appointmentDate = new Date(appointment.date);
                      const start = parseTime(appointment.startTime);
                      return (
                        !!start &&
                        isSameDay(appointmentDate, day) &&
                        start.hours === hour
                      );
                    }
                  );

                  return (
                    <DroppableTimeCell
                      key={`${day.toISOString()}-${hour}`}
                      day={day}
                      hour={hour}
                      appointments={hourAppointments}
                      available={available}
                      showUnavailableDays={showUnavailableDays}
                      onSelectAppointment={onSelectAppointment}
                      onCellClick={handleCellClick}
                      showAddAppointment={showAddAppointment}
                    />
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

      {/* Drag Overlay */}
      <DragOverlay>
        {activeAppointment ? (
          <div className="opacity-90 scale-105 cursor-grabbing">
            <AppointmentChip
              appointment={activeAppointment}
              onSelect={() => { }}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}