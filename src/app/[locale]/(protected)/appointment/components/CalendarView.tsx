"use client";

import {
  addDays,
  addMonths,
  addWeeks,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";

import { useCallback, useEffect, useState } from "react";

import { getAppointments } from "../api/appointment";
import { AppointmentDetails } from "./AppointmentDetails";
import { CalendarHeader } from "./CalendarHeader";
import { DayView } from "./DayView";
import { ListView } from "./ListView";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { CalendarAppointment, CalendarViewType } from "./types";

type AppointmentApi = {
  id?: string;
  patient: {
    first_name?: string;
    date_of_birth?: string;
  };
  patient_phone_number?: string;
  consultationType?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  typeColor?: string;
  location?: string;
  motif?: string;
  status?: string;
  timeSpentInWaitingRoom?: {
    enterTime?: string;
    endTime?: string;
  };
  timeOfExitFromConsultation?: string;
};

const DEFAULT_VIEW: CalendarViewType = "month";
const BUSINESS_HOURS_FALLBACK = "--";

const APPOINTMENT_EMPTY_STATE: CalendarAppointment = {
  id: "",
  patient: "",
  phoneNumber: "",
  type: "",
  typeColor: "",
  date: "",
  startTime: BUSINESS_HOURS_FALLBACK,
  endTime: BUSINESS_HOURS_FALLBACK,
  location: "",
  notes: "",
  confirmed: false,
  date_of_birth: "",
  consultationType: "",
  motif: "",
  timeSpentInWaitingRoom: { enterTime: "", endTime: "" },
  timeOfExitFromConsultation: "",
};

const VIEW_COMPONENTS: Record<
  CalendarViewType,
  React.ComponentType<{
    currentDate: Date;
    appointments: CalendarAppointment[];
    onSelectAppointment: (appointment: CalendarAppointment) => void;
  }>
> = {
  month: MonthView,
  week: WeekView,
  day: DayView,
  list: ListView,
};

function buildAppointment(
  item: AppointmentApi,
  index: number,
): CalendarAppointment {
  const baseId = item.id ?? `appointment-${index}`;
  const patient = item.patient?.first_name?.trim() || "--";
  const startTime =
    item.startTime && item.startTime !== ""
      ? item.startTime
      : BUSINESS_HOURS_FALLBACK;
  const endTime =
    item.endTime && item.endTime !== ""
      ? item.endTime
      : BUSINESS_HOURS_FALLBACK;

  return {
    ...APPOINTMENT_EMPTY_STATE,
    id: baseId,
    patient,
    phoneNumber: item.patient_phone_number ?? "",
    type: item.consultationType ?? "",
    typeColor: item.typeColor ?? "",
    date: item.date ?? "",
    startTime,
    endTime,
    location: item.location ?? "",
    date_of_birth: item.patient?.date_of_birth ?? "",
    notes: item.motif ?? "",
    confirmed: item.status === "confirmed",
    consultationType: item.consultationType ?? "",
    motif: item.motif ?? "",
    timeSpentInWaitingRoom: {
      enterTime: item.timeSpentInWaitingRoom?.enterTime ?? "",
      endTime: item.timeSpentInWaitingRoom?.endTime ?? "",
    },
    timeOfExitFromConsultation: item.timeOfExitFromConsultation ?? "",
  };
}

const LoadingState = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
  </div>
);

export default function DoctorCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewType>(DEFAULT_VIEW);
  const [selectedAppointment, setSelectedAppointment] =
    useState<CalendarAppointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAppointments();
      const data = Array.isArray(response.data)
        ? (response.data as AppointmentApi[])
        : [];
      const normalised = data.map((item, index) =>
        buildAppointment(item, index),
      );
      setAppointments(normalised);
    } catch (error) {
      console.error("Erreur lors du chargement des rendez-vous", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  const handlePrevious = () => {
    setCurrentDate((date) => {
      switch (view) {
        case "month":
          return subMonths(date, 1);
        case "week":
          return subWeeks(date, 1);
        case "day":
          return subDays(date, 1);
        default:
          return date;
      }
    });
  };

  const handleNext = () => {
    setCurrentDate((date) => {
      switch (view) {
        case "month":
          return addMonths(date, 1);
        case "week":
          return addWeeks(date, 1);
        case "day":
          return addDays(date, 1);
        default:
          return date;
      }
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleViewChange = (newView: CalendarViewType) => {
    setView(newView);
  };

  const handleSelectAppointment = (appointment: CalendarAppointment) => {
    setSelectedAppointment(appointment);
    setDialogOpen(true);
  };

  const ActiveView = VIEW_COMPONENTS[view];

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="mt-8 " style={{ direction: "ltr" }}>
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={handleViewChange}
      />

      <ActiveView
        currentDate={currentDate}
        appointments={appointments}
        onSelectAppointment={handleSelectAppointment}
      />

      <AppointmentDetails
        appointment={selectedAppointment}
        isOpen={dialogOpen}
        onClose={async () => {
          setDialogOpen(false);
          await loadAppointments();
        }}
      />
    </div>
  );
}
