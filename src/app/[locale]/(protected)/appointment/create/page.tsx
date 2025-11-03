"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/Card";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { getPatientsByTenant, TenantPatient } from "@/api/patients";
import { getServicesByTenant, Service } from "@/api/services";
import { createAppointment } from "@/api/appointments";
import type { AppointmentStatus } from "@/api/appointments";
import AppointmentForm from "./components/AppointmentForm";
import PatientDetails from "./components/PatientDetails";
import { useToast } from "@/lib/useToast";
import { Toaster } from "@/components/Toaster";
import { getEmployees } from "@/api/employees";

type ConsultationType = "LOCAL" | "IN_PERSON" | "VIDEO";

interface FormState {
  selectedPatientId: string | null;
  doctorId: string | null;
  date: Date | undefined;
  cost: number | undefined;
  motif: string;
  note: string;
  locationType: string | null;
  serviceId: string | null;
  placelocation: string | null;
  inWaitingRoom: boolean;
  urgent: boolean;
}

const LOCATION_MAP: Record<string, ConsultationType> = {
  "1": "LOCAL",
  "2": "IN_PERSON",
  "3": "VIDEO",
};

export default function RendezVousForm() {
  const t = useTranslations("appointments.form");
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
      cost: 0,
      motif: "",
      placelocation: "",
      note: "",
      locationType: "1",
      inWaitingRoom: false,
      urgent: false,
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
      cost: 0,
      motif: "",
      doctorId: "",
      note: "",
      placelocation: "",
      locationType: "1",
      inWaitingRoom: false,
      urgent: false,
    });
    setSearchQuery("");
    setSelectedPatient(null);
  };

  const validateForm = () => {
    const { selectedPatientId, serviceId, date, motif, locationType, cost, placelocation } = formState;
    if (!selectedPatientId || !date || !motif.trim() || !locationType || cost === undefined || !serviceId) {
      showToast('error', 'Erreur', t("alerts.fillAllFields"));
      return false;
    }
    if (locationType === "2" && !placelocation?.trim()) {
      showToast('error', 'Erreur', t("alerts.fillAllFields")); // Or a specific message for address
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
      cost,
      motif,
      note,
      locationType,
      inWaitingRoom,
      placelocation,
      serviceId,
      urgent,
    } = formState;

    // Format date in local timezone to avoid UTC conversion issues
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
      cost: cost!,
      notes: note,
      location: placelocation,
      serviceId: serviceId,
      urgent: urgent,
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 duration-300 transition-all">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
        {t("title")}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {t("subtitle")}
      </p>

      <Card className="mt-8 flex gap-8 overflow-hidden">
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

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden w-90 ${selectedPatient ? "opacity-100" : "w-0 opacity-0 pl-0"
            }`}
        >
          {selectedPatient && <PatientDetails patient={selectedPatient} />}
        </div>
      </Card>
      <Toaster />
    </div>
  );
}