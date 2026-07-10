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
import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AppointmentChip } from "../AppointmentChip";
import { CalendarAppointment } from "../helpers/types";


type MonthViewProps = {
  currentDate: Date;
  appointments: CalendarAppointment[];
  onSelectAppointment: (appointment: CalendarAppointment) => void;
  doctorProfileId: string;
  onAppointmentUpdated: (updatedAppointment: CalendarAppointment) => void;
  showAddAppointment: boolean;
  showUnavailableDays: boolean;
};

interface AvailabilitySlot {
  id: string;
  dayOfWeek: string;
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

// Droppable Day Cell
function DroppableDay({
  day,
  currentDate,
  dayAppointments,
  available,
  showUnavailableDays,
  onSelectAppointment,
  onDayClick,
  t,
  showAddAppointment,
}: {
  day: Date;
  currentDate: Date;
  dayAppointments: CalendarAppointment[];
  available: boolean;
  showUnavailableDays: boolean;
  onSelectAppointment: (appointment: CalendarAppointment) => void;
  onDayClick: (date: Date) => void;
  t: any;
  showAddAppointment: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { setNodeRef, isOver } = useDroppable({
    id: day.toISOString(),
    data: { date: day },
  });

  const dayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const unavailableBgVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger if clicking the day cell itself, not an appointment
    if ((e.target as HTMLElement).closest('[data-appointment]')) {
      return;
    }
    onDayClick(day);
  };

  return (
    <motion.div
      ref={setNodeRef}
      key={day.toISOString()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className={cx(
        "h-32 min-h-[8rem] overflow-y-auto border-b p-1 sm:p-2 relative transition-colors overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-800 group",
        !isSameMonth(day, currentDate) &&
        "bg-gray-50 text-gray-400 dark:bg-gray-900 dark:text-gray-600",
        isSameDay(day, new Date()) && "bg-blue-50 dark:bg-blue-900/20 ",
        isOver && "ring-2 ring-blue-500 ring-inset bg-blue-100 dark:bg-blue-900/30 ",
        showAddAppointment && "cursor-pointer"
      )}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={dayVariants}
    >
      {/* Animated Unavailable Red Texture */}
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

      {/* Day number */}
      <div className="mb-1 text-right relative">
        <span
          className={cx(
            "inline-flex h-6 w-6 items-center justify-center rounded-full text-sm",
            isToday(day) && "bg-blue-600 text-white dark:bg-blue-500",
            !isToday(day) &&
            isSameMonth(day, currentDate) &&
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
          <div key={appointment.id} data-appointment>
            <DraggableAppointment
              appointment={appointment}
              onSelect={onSelectAppointment}
            />
          </div>
        ))}
        {dayAppointments.length > 3 && (
          <div className="px-1 text-xs text-gray-500 dark:text-gray-400">
            + {dayAppointments.length - 3} {t("more")}
          </div>
        )}
      </div>

      {/* Hover overlay to create appointment */}
      <AnimatePresence>
        {isHovered && dayAppointments.length === 0 && showAddAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            <div className="border-2 border-dashed border-blue-500 dark:border-blue-400 w-full h-full flex flex-col items-center justify-center gap-2 bg-blue-50/50 dark:bg-blue-900/20 pointer-events-auto">
              <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Créer un rendez-vous
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function MonthView({
  currentDate,
  appointments,
  onSelectAppointment,
  doctorProfileId,
  onAppointmentUpdated,
  showAddAppointment,
  showUnavailableDays,
}: MonthViewProps) {
  const t = useTranslations("appointments.calendar.monthView");
  const router = useRouter();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [activeAppointment, setActiveAppointment] =
    useState<CalendarAppointment | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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

  const shouldRenderDay = (day: Date) => showUnavailableDays || isDayAvailable(day);

  const handleDayClick = (date: Date) => {
    const formattedDate = format(date, "dd/MM/yyyy");
    showAddAppointment && router.push(`/appointment/create?date=${formattedDate}`);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const appointment = event.active.data.current
      ?.appointment as CalendarAppointment;
    setActiveAppointment(appointment);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveAppointment(null);

    if (!over) return;

    const appointment = active.data.current
      ?.appointment as CalendarAppointment;
    const newDate = over.data.current?.date as Date;

    if (!isSameDay(new Date(appointment.date), newDate)) {

      const updatedAppointment = {
        ...appointment,
        date: format(newDate, "yyyy-MM-dd"),
      };

      onAppointmentUpdated(updatedAppointment);

      const payload: AppointmentUpdateDTO = {
        date: format(newDate, "yyyy-MM-dd"),
        isUrgent: appointment.isUrgent,
      };

      try {
        await updateAppointment(appointment.id, payload);
      } catch (error) {
        console.error("Failed to update appointment date:", error);

        onAppointmentUpdated(appointment);

      }
    }
  };

  // Header
  const firstWeek = days.slice(0, 7);
  const headerDays = firstWeek.map((day) => format(day, "EEE"));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto">
        <div className="min-w-full rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">


          {/* Days header */}
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 text-center dark:border-gray-800 dark:bg-gray-900">
            {headerDays.map((day, idx) => (
              <div key={idx} className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
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
                      className={cx(
                        "h-32 min-h-[8rem] border-b p-1 sm:p-2 bg-gray-50 dark:bg-gray-900 "
                      )}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                    />
                  );
                }

                return (
                  <DroppableDay
                    key={day.toISOString()}
                    day={day}
                    currentDate={currentDate}
                    dayAppointments={dayAppointments}
                    available={available}
                    showUnavailableDays={showUnavailableDays}
                    onSelectAppointment={onSelectAppointment}
                    onDayClick={handleDayClick}
                    t={t}
                    showAddAppointment={showAddAppointment}
                  />
                );
              })}
            </div>
          </AnimatePresence>
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