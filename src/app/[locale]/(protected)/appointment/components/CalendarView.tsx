"use client";

import {
  addDays,
  addMonths,
  addWeeks,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { useEffect, useMemo, useState } from "react";

import { getAllAppointments } from "@/api/appointments";
import { Employee, getEmployees } from "@/api/employees";
import { getUserPreferences, updateUserPreferences, UserPreferences } from "@/api/preferences";
import { getServicesByTenant, Service } from "@/api/services";
import { AppointmentDetails } from "./AppointmentDetails";
import { DayView } from "./calendar-views/DayView";
import { ListView } from "./calendar-views/ListView";
import { MonthView } from "./calendar-views/MonthView";
import { WeekView } from "./calendar-views/WeekView";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarAppointment, CalendarViewType } from "./helpers/types";

import { ConditionFilter } from "./header/PriceFilter";

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
    showUnavailableDays: boolean;
    showAddAppointment: boolean;
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
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<ConditionFilter | undefined>(undefined);
  const [employees, setEmployees] = useState<Employee[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [prefsLoading, setPrefsLoading] = useState(false);

  const [showUnavailableDays, setShowUnavailableDays] = useState(true);
  const [showAddAppointment, setShowAddAppointment] = useState(true);


  const handleNavigation = (direction: "next" | "previous") => {
    setCurrentDate((prev) => navigateDate(prev, view, direction));
  };

  const handleToday = () => setCurrentDate(new Date());
  const handleViewChange = (newView: CalendarViewType) => setView(newView);

  const handleSelectAppointment = (appointment: CalendarAppointment) => {
    setSelectedAppointment(appointment);
    setDialogOpen(true);
  };

  const handleAppointmentUpdated = (updated: CalendarAppointment | null) => {
    if (!updated) {
      setAppointments(prev => prev.filter(a => a.id !== selectedAppointment?.id))
    } else {
      setAppointments(prev =>
        prev.map(a => (a.id === updated.id ? updated : a))
      )
    }
  };

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        const stored = localStorage.getItem("user");
        const parsed = stored ? JSON.parse(stored) : null;
        const tenantId = parsed?.doctorProfile?.tenantId;
        const profileId = parsed?.doctorProfile?.id;

        if (!tenantId) return;

        setDoctorProfileId(profileId);

        const [employeesRes, servicesRes, appointmentsRes] = await Promise.all([
          getEmployees(tenantId),
          getServicesByTenant(tenantId),
          getAllAppointments(),
        ]);

        const servicesData = servicesRes.data;
        setEmployees(employeesRes.data);
        setServices(servicesData);

        setAppointments(appointmentsRes.data.map((item: any) => {
          const service = servicesData.find(s => s.id === item.serviceId);
          return {
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
            isUrgent: item.isUrgent ?? false,
            createdAt: item.createdAt ?? "",
            updatedAt: item.updatedAt ?? "",
            price: item?.price
          }
        }));

      } catch (e) {
        console.error("Erreur lors du chargement des ressources :", e);
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, []);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const user = JSON.parse(stored);
          const res = await getUserPreferences(user.id);
          setPrefs(res.data);
          setShowUnavailableDays(res.data.showUnavailableDays);
          setShowAddAppointment(res.data.showAddAppointment);
        }
      } catch (error) {
        console.error("Failed to load preferences:", error);
      }
    };
    fetchPreferences();
  }, []);

  const handleTogglePreference = async (key: 'showUnavailableDays' | 'showAddAppointment') => {
    if (!prefs) return;

    const updatedValue = !prefs[key];
    const updatedPrefs = { ...prefs, [key]: updatedValue };
    setPrefs(updatedPrefs);

    if (key === 'showUnavailableDays') {
      setShowUnavailableDays(updatedValue);
    } else if (key === 'showAddAppointment') {
      setShowAddAppointment(updatedValue);
    }

    setPrefsLoading(true);
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        await updateUserPreferences(user.id, { [key]: updatedValue });
      }
    } catch (error) {
      console.error("Failed to update preferences:", error);
      // Revert state on failure
      const revertedPrefs = { ...prefs, [key]: !updatedValue };
      setPrefs(revertedPrefs);
      if (key === 'showUnavailableDays') {
        setShowUnavailableDays(!updatedValue);
      } else if (key === 'showAddAppointment') {
        setShowAddAppointment(!updatedValue);
      }
    } finally {
      setPrefsLoading(false);
    }
  };




  const handleToggleUnavailable = () =>
    setShowUnavailable((prev) => !prev);

  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    if (selectedStatus) {
      filtered = filtered.filter((a) => a.status === selectedStatus);
    }

    if (selectedDoctor) {
      filtered = filtered.filter((a) => a.doctorProfileId === selectedDoctor);
    }

    if (selectedServices.length > 0) {
      filtered = filtered.filter((a) => a.serviceId && selectedServices.includes(a.serviceId));
    }

    if (selectedPrice) {
      filtered = filtered.filter(a => {
        if (a.price === undefined || a.price === null) return false;
        const price = a.price;
        const [min, max] = selectedPrice.value.map(v => v ? parseFloat(v) : undefined);

        switch (selectedPrice.condition) {
          case 'greater-than':
            return min !== undefined && price > min;
          case 'less-than':
            return min !== undefined && price < min;
          case 'equal-to':
            return min !== undefined && price === min;
          case 'is-between':
            return min !== undefined && max !== undefined && price >= min && price <= max;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [appointments, selectedStatus, selectedDoctor, selectedServices, selectedPrice]);

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
        selectedDoctor={selectedDoctor}
        onDoctorChange={setSelectedDoctor}
        selectedServices={selectedServices}
        onServicesChange={setSelectedServices}
        selectedPrice={selectedPrice}
        onPriceChange={setSelectedPrice}
        services={services}
        employees={employees}
        showUnavailableDays={showUnavailableDays}
        showAddAppointment={showAddAppointment}
        onToggleUnavailableDays={() => handleTogglePreference('showUnavailableDays')}
        onToggleAddAppointment={() => handleTogglePreference('showAddAppointment')}
        prefsLoading={prefsLoading}
      />

      <ActiveView
        currentDate={currentDate}
        appointments={filteredAppointments}
        onSelectAppointment={handleSelectAppointment}
        doctorProfileId={doctorProfileId}
        onAppointmentUpdated={handleAppointmentUpdated}
        showUnavailableDays={showUnavailableDays}
        showAddAppointment={showAddAppointment}
      />

      <AppointmentDetails
        appointment={selectedAppointment}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAppointmentUpdated={handleAppointmentUpdated}
        services={services}
        employees={employees}
      />
    </div>
  );
}
