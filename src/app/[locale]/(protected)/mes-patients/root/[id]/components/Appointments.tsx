// components/patient-dossier/Appointments.tsx
import { useEffect, useState } from "react";
import { getAppointmentsByPatient } from "@/api/appointments"; // Assuming the path
import { Appointment } from "@/api/appointments";
import { Card } from "@/components/Card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/Table";
import useTranslations from "@/lib/i18n/useTranslations";

interface AppointmentsProps {
  patientId: string;
}

export default function Appointments({ patientId }: AppointmentsProps) {
  const t = useTranslations("patients.appointments");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Chargement des rendez-vous...</p>;

  return (
    <Card>
      <div>
        <h2>{t("title")}</h2>
      </div>
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableHead>{t("date")}</TableHead>
              <TableHead>{t("time")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("status")}</TableHead>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((apt) => (
              <TableRow key={apt.id}>
                <TableCell>{apt.date}</TableCell>
                <TableCell>{apt.startTime}</TableCell>
                <TableCell>{apt.consultationType}</TableCell>
                <TableCell>{apt.status}</TableCell>
              </TableRow>
            ))}
            {appointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>{t("noAppointments")}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}