"use client";

import {
  addDays,
  addMonths,
  addWeeks,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { useEffect, useState, useMemo } from "react";

import { CalendarHeader } from "./CalendarHeader";
import { getAllAppointments } from "@/api/appointments";
import { AppointmentDetails } from "./AppointmentDetails";
import { DayView } from "./calendar-views/DayView";
import { ListView } from "./calendar-views/ListView";
import { MonthView } from "./calendar-views/MonthView";
import { WeekView } from "./calendar-views/WeekView";
import { CalendarAppointment, CalendarViewType } from "./helpers/types";

const DEFAULT_VIEW: CalendarViewType = "month";
const BUSINESS_HOURS_FALLBACK = "--";

const navigateDate = (date: Date, view: CalendarViewType, direction: "next" | "previous"): Date => {
  if (view === 'list') return date;

  const actions = {
    month: direction === "next" ? addMonths : subMonths,
    week: direction === "next" ? addWeeks : subWeeks,
    day: direction === "next" ? addDays : subDays,
  };
  return actions[view](date, 1);
};

const LoadingState = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
  </div>
);

const VIEW_COMPONENTS: Record<
  CalendarViewType,
  React.ComponentType<{
    currentDate: Date;
    appointments: CalendarAppointment[];
    onSelectAppointment: (appointment: CalendarAppointment) => void;
    doctorProfileId: string;
    onAppointmentUpdated: (updatedAppointment: CalendarAppointment) => void;
  }>
> = {
  month: MonthView,
  week: WeekView,
  day: DayView,
  list: ListView,
};

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewType>(DEFAULT_VIEW);
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<CalendarAppointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [doctorProfileId, setDoctorProfileId] = useState<string>("");
  const [showUnavailable, setShowUnavailable] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const handleNavigation = (direction: "next" | "previous") => {
    setCurrentDate((prev) => navigateDate(prev, view, direction));
  };

  const handleToday = () => setCurrentDate(new Date());
  const handleViewChange = (newView: CalendarViewType) => setView(newView);

  const handleSelectAppointment = (appointment: CalendarAppointment) => {
    setSelectedAppointment(appointment);
    setDialogOpen(true);
  };

  const handleAppointmentUpdated = (updated: CalendarAppointment) => {
    if (!updated) {
      setAppointments(prev => prev.filter(a => a.id !== selectedAppointment?.id))
    } else {
      setAppointments(prev =>
        prev.map(a => (a.id === updated.id ? updated : a))
      )
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setDoctorProfileId(parsed?.doctorProfile?.id ?? "");
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        setLoading(true);
        const { data } = await getAllAppointments();
        setAppointments(data.map((item: any) => ({
          id: item.id ?? "",
          patient: "--",
          patientProfileId: item.patientProfileId ?? "",
          type: item.consultationType ?? "",
          date: item.date ?? "",
          startTime: item.startTime || BUSINESS_HOURS_FALLBACK,
          endTime: item.endTime ?? null,
          location: item.location ?? "",
          notes: item.notes ?? "",
          consultationType: item.consultationType ?? "",
          motif: item.motif ?? "",
          status: item.status ?? "",
          patientFullName: item.patientFullName ?? "",
          recurring: item.recurring ?? false,
          doctorProfileId: item.doctorProfileId ?? "",
          serviceId: item.serviceId ?? "",
          urgent: item.urgent ?? false,
          createdAt: item.createdAt ?? "",
          updatedAt: item.updatedAt ?? ""
        })));
      } catch (error) {
        console.error("Erreur lors du chargement des rendez-vous :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  const handleToggleUnavailable = () =>
    setShowUnavailable((prev) => !prev);

  const filteredAppointments = useMemo(() => {
    if (!selectedStatus) return appointments;
    return appointments.filter((a) => a.status === selectedStatus);
  }, [appointments, selectedStatus]);

  if (loading) return <LoadingState />;

  const ActiveView = VIEW_COMPONENTS[view];

  return (
    <div className="mt-8" style={{ direction: "ltr" }}>
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrevious={() => handleNavigation("previous")}
        onNext={() => handleNavigation("next")}
        onToday={handleToday}
        onViewChange={handleViewChange}
        showUnavailable={showUnavailable}
        onToggleUnavailable={handleToggleUnavailable}
        selectedStatus={selectedStatus}
        onStatusSelect={setSelectedStatus}
      />

      <ActiveView
        currentDate={currentDate}
        appointments={filteredAppointments}
        onSelectAppointment={handleSelectAppointment}
        doctorProfileId={doctorProfileId}
        onAppointmentUpdated={handleAppointmentUpdated}
      />
      
      <AppointmentDetails
        appointment={selectedAppointment}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        //@ts-ignore
        onAppointmentUpdated={handleAppointmentUpdated}
      />
    </div>
  );
}
