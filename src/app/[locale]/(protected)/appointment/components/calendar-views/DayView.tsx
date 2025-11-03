"use client";

import { useTranslations } from "@/lib/i18n/useTranslations";
import { cx } from "@/lib/utils";
import { isSameDay, format } from "date-fns";
import React, { useState, useEffect } from "react";
import { AppointmentChip } from "../AppointmentChip";
import { isTimeWithinRange, parseTime } from "../helpers/time";
import { CalendarAppointment } from "../helpers/types";
import { getAvailabilitySlotsByDoctor } from "@/api/disponibility";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import {
  updateAppointment,
  AppointmentUpdateDTO,
} from "@/api/appointments";

type DayViewProps = {
  currentDate: Date;
  appointments: CalendarAppointment[];
  onSelectAppointment: (appointment: CalendarAppointment) => void;
  doctorProfileId: string;
  onAppointmentUpdated: (updatedAppointment: CalendarAppointment) => void;
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

// Draggable Appointment Wrapper
function DraggableAppointment({
  appointment,
  onSelect,
  slot,
}: {
  appointment: CalendarAppointment;
  onSelect: (appointment: CalendarAppointment) => void;
  slot: string;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `${appointment.id}-${slot}`,
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

// Droppable Time Slot
function DroppableTimeSlot({
  slot,
  index,
  appointments: slotAppointments,
  available,
  showUnavailable,
  onSelectAppointment,
}: {
  slot: string;
  index: number;
  appointments: CalendarAppointment[];
  available: boolean;
  showUnavailable: boolean;
  onSelectAppointment: (appointment: CalendarAppointment) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: slot,
    data: { time: slot },
  });

  const unavailableBgVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const cellVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

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
      <div
        ref={setNodeRef}
        className={cx(
          "p-2 relative transition-colors",
          isOver && "ring-2 ring-blue-500 ring-inset bg-blue-100 dark:bg-blue-900/30"
        )}
      >
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
          {slotAppointments.map((appointment) => (
            <DraggableAppointment
              key={`${slot}-${appointment.id}`}
              appointment={appointment}
              onSelect={onSelectAppointment}
              slot={slot}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function DayView({
  currentDate,
  appointments,
  onSelectAppointment,
  doctorProfileId,
  onAppointmentUpdated,
}: DayViewProps) {
  const t = useTranslations("appointments.calendar.dayView");
  const [showUnavailable, setShowUnavailable] = useState(true);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [activeAppointment, setActiveAppointment] =
    useState<CalendarAppointment | null>(null);

  // Configure sensors for drag detection
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

    const droppedAppointment = active.data.current
      ?.appointment as CalendarAppointment;
    const newTimeSlot = over.data.current?.time as string;

    // All appointments for the current day, excluding the one being dragged
    const otherDayAppointments = dayAppointments.filter(a => a.id !== droppedAppointment.id);

    const [slotHour, slotMinute] = newTimeSlot.split(':').map(Number);
    const slotStartMinutes = slotHour * 60 + slotMinute;

    // Appointments that were already in the target slot
    const existingAppointmentsInSlot = otherDayAppointments.filter(appointment => {
        const start = parseTime(appointment.startTime);
        if (!start) return false;
        const appointmentStartMinutes = start.hours * 60 + start.minutes;
        return appointmentStartMinutes >= slotStartMinutes && appointmentStartMinutes < (slotStartMinutes + 30);
    });

    // All appointments that will be in the slot after the drop
    const allAppointmentsInSlot = [...existingAppointmentsInSlot, droppedAppointment]
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    if (allAppointmentsInSlot.length === 0) return;

    // Calculate new duration and times
    const slotDuration = 30; // Each slot is 30 minutes
    const appointmentDuration = Math.floor(slotDuration / allAppointmentsInSlot.length);

    let currentMinuteOffset = 0;
    const updatedAppointments: CalendarAppointment[] = [];
    const originalAppointments: CalendarAppointment[] = [];

    for (let i = 0; i < allAppointmentsInSlot.length; i++) {
      const appointment = allAppointmentsInSlot[i];
      const originalAppointment = dayAppointments.find(a => a.id === appointment.id);
      if(originalAppointment) {
        originalAppointments.push(originalAppointment);
      } else {
        originalAppointments.push(droppedAppointment);
      }

      const newStartMinutes = slotStartMinutes + currentMinuteOffset;
      
      let newEndMinutes;
      if (i === allAppointmentsInSlot.length - 1) {
        // Last appointment takes the rest of the slot
        newEndMinutes = slotStartMinutes + slotDuration;
      } else {
        newEndMinutes = newStartMinutes + appointmentDuration;
      }

      const newStartHour = Math.floor(newStartMinutes / 60);
      const newStartMinute = newStartMinutes % 60;
      const newEndHour = Math.floor(newEndMinutes / 60);
      const newEndMinute = newEndMinutes % 60;

      const newStartTime = `${newStartHour.toString().padStart(2, "0")}:${newStartMinute.toString().padStart(2, "0")}`;
      const newEndTime = `${newEndHour.toString().padStart(2, "0")}:${newEndMinute.toString().padStart(2, "0")}`;

      updatedAppointments.push({
        ...appointment,
        startTime: newStartTime,
        endTime: newEndTime,
        date: format(currentDate, "yyyy-MM-dd"),
      });

      currentMinuteOffset += appointmentDuration;
    }

    // Optimistically update UI
    updatedAppointments.forEach(onAppointmentUpdated);

    // API calls
    for (const appointment of updatedAppointments) {
      const payload: AppointmentUpdateDTO = {
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        urgent: appointment.urgent,
      };
      try {
        await updateAppointment(appointment.id, payload);
      } catch (error) {
        console.error(`Failed to update appointment ${appointment.id}`, error);
        // Revert all on any failure
        originalAppointments.forEach(onAppointmentUpdated);
        return;
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
            const [slotHour, slotMinute] = slot.split(':').map(Number);
            const slotStartMinutes = slotHour * 60 + slotMinute;

            const timeAppointments = dayAppointments.filter(
              (appointment) => {
                const start = parseTime(appointment.startTime);
                if (!start) return false;
                const appointmentStartMinutes = start.hours * 60 + start.minutes;
                return appointmentStartMinutes >= slotStartMinutes && appointmentStartMinutes < (slotStartMinutes + 30);
              }
            );

            const available = isSlotAvailable(slot);

            return (
              <DroppableTimeSlot
                key={slot}
                slot={slot}
                index={index}
                appointments={timeAppointments}
                available={available}
                showUnavailable={showUnavailable}
                onSelectAppointment={onSelectAppointment}
              />
            );
          })}
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeAppointment ? (
          <div className="opacity-90 scale-105 cursor-grabbing">
            <AppointmentChip
              appointment={activeAppointment}
              onSelect={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}