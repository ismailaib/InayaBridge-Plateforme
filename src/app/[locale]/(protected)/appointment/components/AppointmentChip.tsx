"use client";

import { cx } from "@/lib/utils";
import { getStatusDotColor } from "./helpers/details";
import { CalendarAppointment } from "./helpers/types";

type AppointmentChipProps = {
  appointment: CalendarAppointment;
  onSelect: (appointment: CalendarAppointment) => void;
};

export function AppointmentChip({
  appointment,
  onSelect,
}: AppointmentChipProps) {
  const statusColor = getStatusDotColor(appointment.status);

  return (
    <button
      key={appointment.id}
      onClick={() => onSelect(appointment)}
      className={cx(
        "flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left shadow-sm transition hover:opacity-90",
        statusColor.replace("bg-", "bg-opacity-20 text-"),
        "dark:bg-opacity-30"
      )}
      style={{ backgroundColor: "transparent" }}
    >
      <span
        className={cx(
          "flex-shrink-0 rounded px-2 py-0.5 text-xs font-semibold text-white",
          statusColor
        )}
      >
        {appointment.startTime}
      </span>

      <span
        className={cx(
          "truncate text-sm font-medium text-gray-900 dark:text-gray-100",
          appointment.status?.toUpperCase() === "CANCELLED" && "line-through opacity-60"
        )}
      >
        {appointment.patientFullName}
      </span>
    </button>
  );
}
