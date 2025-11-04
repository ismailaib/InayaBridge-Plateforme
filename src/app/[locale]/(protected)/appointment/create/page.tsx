"use client";

import type { AppointmentStatus } from "@/api/appointments";
import { createAppointment } from "@/api/appointments";
import { getEmployees } from "@/api/employees";
import { getPatientsByTenant, TenantPatient } from "@/api/patients";
import { getServicesByTenant, Service } from "@/api/services";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Toaster } from "@/components/Toaster";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { useToast } from "@/lib/useToast";
import { ScanSearch } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import AppointmentForm from "./components/AppointmentForm";
import PatientDetails from "./components/PatientDetails";

type ConsultationType = "LOCAL" | "IN_PERSON" | "VIDEO";

interface FormState {
  selectedPatientId: string | null;
  doctorId: string;
  date: Date | undefined;
  price: number | undefined;
  motif: string;
  note: string;
  locationType: string | null;
  serviceId: string | null;
  placelocation: string | null;
  inWaitingRoom: boolean;
  isUrgent: boolean;
}

const LOCATION_MAP: Record<string, ConsultationType> = {
  "1": "LOCAL",
  "2": "IN_PERSON",
  "3": "VIDEO",
};

export default function RendezVousForm() {
  const t = useTranslations("appointments.form");
  const searchParams = useSearchParams();
  const [patients, setPatients] = useState<TenantPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectOpen, setSelectOpen] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<TenantPatient | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const { toast } = useToast();
  const [showPatientDetails, setShowPatientDetails] = useState(true);
  const [leftWidth, setLeftWidth] = useState(70);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const showToast = (type: 'success' | 'error', title: string, message: string) => {
    toast({
      variant: type === 'error' ? 'error' : 'success',
      title,
      description: message,
    });
  };

  const [formState, setFormState] = useState<FormState>(() => {
    const defaultDate = new Date();
    defaultDate.setHours(defaultDate.getHours() + 1);
    defaultDate.setMinutes(0);
    defaultDate.setSeconds(0);
    defaultDate.setMilliseconds(0);

    return {
      selectedPatientId: null,
      serviceId: null,
      date: defaultDate,
      doctorId: "",
      price: 0,
      motif: "",
      placelocation: "",
      note: "",
      locationType: "1",
      inWaitingRoom: false,
      isUrgent: false,
    };
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setTenantId(parsed?.doctorProfile?.tenantId ?? null);
        setDoctorId(parsed?.doctorProfile?.id ?? null);
      }
    } catch (e) {
      console.error(e);
      showToast('error', 'Erreur', 'Échec du chargement des données utilisateur.');
    }
  }, []);

  useEffect(() => {
    const dateParam = searchParams.get('date');
    const timeParam = searchParams.get('time');

    if (dateParam) {
      const [day, month, year] = dateParam.split('/').map(Number);
      if (day && month && year) {
        const newDate = new Date(year, month - 1, day);
        if (timeParam) {
          const [hours, minutes] = timeParam.split(':').map(Number);
          if (hours !== undefined && minutes !== undefined) {
            newDate.setHours(hours);
            newDate.setMinutes(minutes);
          }
        }
        updateFormState({ date: newDate });
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!tenantId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [patientsRes, servicesRes, employees] = await Promise.all([
          getPatientsByTenant(tenantId),
          getServicesByTenant(tenantId),
          getEmployees(tenantId),
        ]);
        setPatients(patientsRes.data);
        setServices(servicesRes.data);
        setEmployees(employees.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast('error', 'Erreur', t("alerts.errorLoadingPatients"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tenantId, t]);

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;
    const q = searchQuery.toLowerCase();
    return patients.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.cin.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.phone?.includes(q)
    );
  }, [patients, searchQuery]);

  const updateFormState = (updates: Partial<FormState>) =>
    setFormState((prev) => ({ ...prev, ...updates }));

  const handlePatientSelect = (id: string) => {
    updateFormState({ selectedPatientId: id });
    setSelectOpen(false);
    setSearchQuery("");
    const patient = patients.find((p) => p.id === id) ?? null;
    setSelectedPatient(patient);
  };

  const resetForm = () => {
    const defaultDate = new Date();
    defaultDate.setHours(defaultDate.getHours() + 1);
    defaultDate.setMinutes(0);
    defaultDate.setSeconds(0);
    defaultDate.setMilliseconds(0);

    setFormState({
      selectedPatientId: null,
      serviceId: null,
      date: defaultDate,
      price: 0,
      motif: "",
      doctorId: "",
      note: "",
      placelocation: "",
      locationType: "1",
      inWaitingRoom: false,
      isUrgent: false,
    });
    setSearchQuery("");
    setSelectedPatient(null);
  };

  const validateForm = () => {
    const { selectedPatientId, serviceId, date, motif, locationType, price, placelocation } = formState;
    if (!selectedPatientId || !date || !motif.trim() || !locationType || price === undefined || !serviceId) {
      showToast('error', 'Erreur', t("alerts.fillAllFields"));
      return false;
    }
    if (locationType === "2" && !placelocation?.trim()) {
      showToast('error', 'Erreur', t("alerts.fillAllFields"));
      return false;
    }
    if (!doctorId || !tenantId) {
      showToast('error', 'Erreur', "ID docteur/tenant manquant.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const {
      selectedPatientId,
      date,
      price,
      motif,
      note,
      locationType,
      inWaitingRoom,
      placelocation,
      serviceId,
      isUrgent,
    } = formState;

    const formatLocalDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formatLocalTime = (date: Date) => {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    const payload = {
      tenantId,
      doctorProfileId: doctorId!,
      patientProfileId: selectedPatientId!,
      date: formatLocalDate(date!),
      startTime: formatLocalTime(date!),
      endTime: "",
      status: "PENDING" as AppointmentStatus,
      consultationType: LOCATION_MAP[locationType!],
      motif,
      price: price!,
      notes: note,
      location: placelocation,
      serviceId: serviceId,
      isUrgent: isUrgent,
      inWaitingRoom,
    };

    try {
      setSubmitting(true);
      await createAppointment(payload as any);
      showToast('success', 'Succès', t("alerts.success"));
      resetForm();
    } catch (err) {
      console.error(err);
      showToast('error', 'Erreur', t("alerts.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const isToday = formState.date?.toDateString() === new Date().toDateString();

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    if (newLeftWidth >= 40 && newLeftWidth <= 75) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 duration-300 transition-all">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
        {t("title")}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {t("subtitle")}
      </p>

      <Card className="mt-8 flex gap-0 overflow-hidden relative" ref={containerRef}>
        <div style={{ width: selectedPatient && showPatientDetails ? `${leftWidth}%` : '100%' }} className="transition-all duration-300">
          <AppointmentForm
            formState={formState}
            updateFormState={updateFormState}
            services={services}
            loading={loading}
            submitting={submitting}
            t={t}
            isToday={isToday}
            handleSubmit={handleSubmit}
            resetForm={resetForm}
            filteredPatients={filteredPatients}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectOpen={selectOpen}
            setSelectOpen={setSelectOpen}
            searchInputRef={searchInputRef}
            handlePatientSelect={handlePatientSelect}
            employees={employees}
          />
        </div>

        {selectedPatient && showPatientDetails && (
          <>
            <div
              onMouseDown={handleMouseDown}
              className="w-1 mx-2 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-600 cursor-col-resize transition-colors flex-shrink-0"
              style={{ cursor: isResizing ? 'col-resize' : 'col-resize' }}
            />
            <div
              style={{ width: `${100 - leftWidth}%` }}
              className="transition-all duration-300 overflow-auto"
            >
              <PatientDetails patient={selectedPatient} />
            </div>
          </>
        )}

        {selectedPatient && !showPatientDetails && (
          <Button
            variant="secondary"
            onClick={() => setShowPatientDetails(!showPatientDetails)}
            className="absolute top-0 right-0 rounded-none bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
            title={showPatientDetails ? "Masquer les détails" : "Afficher les détails"}
          >
            <ScanSearch width={18} />
          </Button>
        )}
      </Card>
      <Toaster />
    </div>
  );
}