"use client";

import { Appointment, getAppointmentsByPatient } from "@/api/appointments";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import LoadingState from "@/components/custom/LoadingState";
import { DatePicker } from "@/components/DatePicker";
import { Divider } from "@/components/Divider";
import { Input } from "@/components/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/Table";
import useTranslations from "@/lib/i18n/useTranslations";
import { RotateCcw, SquareActivity } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface AppointmentsProps {
  patientId: string;
}

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmé",
  CANCELLED: "Annulé",
  COMPLETED: "Terminé",
  IN_PROGRESS: "En cours",
  ARRIVED: "Arrivé",
};

const typeLabels: Record<string, string> = {
  LOCAL: "Cabinet",
  IN_PERSON: "Présentiel",
  VIDEO: "Vidéo",
};

export default function Appointments({ patientId }: AppointmentsProps) {
  const t = useTranslations("patients.appointments");
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [timeSearch, setTimeSearch] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await getAppointmentsByPatient(patientId);
        setAppointments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [patientId]);

  const filtered = useMemo(() => {
    return appointments.filter((apt) => {
      const matchStatus = !statusFilter || apt.status === statusFilter;
      const matchType = !typeFilter || apt.consultationType === typeFilter;
      const matchDate = !dateFilter || apt.date === dateFilter;
      const matchTime = !timeSearch || apt.startTime.includes(timeSearch);
      return matchStatus && matchType && matchDate && matchTime;
    });
  }, [appointments, statusFilter, typeFilter, dateFilter, timeSearch]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const resetFilters = () => {
    setStatusFilter("");
    setTypeFilter("");
    setDateFilter("");
    setTimeSearch("");
    setPage(1);
  };

  if (loading) return <LoadingState />;

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-semibold">{t("title")}</h3>
      <Divider />

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t("date")}</label>
          <DatePicker value={dateFilter ? new Date(dateFilter) : undefined} onChange={(date) => setDateFilter(date ? new Date(date.setHours(date.getHours() + 1)).toISOString().split('T')[0] : "")} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t("status")}</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("status")} />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(statusLabels).map((key) => (
                <SelectItem key={key} value={key}>
                  {statusLabels[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t("type")}</label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("type")} />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(typeLabels).map((key) => (
                <SelectItem key={key} value={key}>
                  {typeLabels[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t("time")}</label>
          <Input
            placeholder="HH:MM"
            value={timeSearch}
            onChange={(e) => setTimeSearch(e.target.value)}
          />
        </div>


      </div>

              <div className="flex justify-end">
        <Button variant="secondary" onClick={resetFilters}>
          <RotateCcw width={18}/>
        </Button>
      </div>

      <Divider />

      {/* TABLE */}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>{t("date")}</TableHeaderCell>
            <TableHeaderCell>{t("time")}</TableHeaderCell>
            <TableHeaderCell>{t("type")}</TableHeaderCell>
            <TableHeaderCell>{t("status")}</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {paginated.map((apt) => (
            <TableRow key={apt.id}>
              <TableCell>{apt.date}</TableCell>
              <TableCell>{apt.startTime}</TableCell>
              <TableCell>{typeLabels[apt.consultationType]}</TableCell>
              <TableCell>{statusLabels[apt.status]}</TableCell>

              <TableCell>
                <Button
                  variant="secondary"
                  onClick={() => router.push(`/appointment/details/${apt.id}`)}
                >
                  <SquareActivity width={18} className="mr-2" />
                  Consulter
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>{t("noAppointments")}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* PAGINATION */}
      {filtered.length > rowsPerPage && (
        <div className="flex items-center justify-end gap-4 mt-4">
          <Button variant="secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>
            {t("prev")}
          </Button>
          <span>
            {page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            {t("next")}
          </Button>
        </div>
      )}
    </Card>
  );
}
