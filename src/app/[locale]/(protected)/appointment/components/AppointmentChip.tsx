"use client";

import { cx } from "@/lib/utils";

import { CalendarAppointment } from "./helpers/types";

type AppointmentChipProps = {
  appointment: CalendarAppointment;
  onSelect: (appointment: CalendarAppointment) => void;
};

export function AppointmentChip({
  appointment,
  onSelect,
}: AppointmentChipProps) {

  console.log("Rendering AppointmentChip for:", appointment);
  return (
    <button
      key={appointment.id}
      onClick={() => onSelect(appointment)}
      className={cx(
        "flex w-full items-center gap-2 rounded-lg bg-blue-50/60 px-2 py-1 text-left shadow-sm transition hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/60",
        appointment.typeColor,
      )}
    >
      <span className="flex-shrink-0 rounded bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white dark:bg-blue-500">
        {appointment.startTime}
      </span>
      <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
        {appointment.patientFullName}
      </span>
    </button>
  );
}
