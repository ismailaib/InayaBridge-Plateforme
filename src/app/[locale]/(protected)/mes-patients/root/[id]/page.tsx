"use client";

import { getPatientById } from "@/api/patients";
import { Button } from "@/components/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import useTranslations from "@/lib/i18n/useTranslations";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Appointments from "./components/Appointments";
import DocumentsNotes from "./components/DocumentsNotes";
import MedicalHistory from "./components/MedicalHistory";
import PatientInfo from "./components/PatientInfo";
import Treatments from "./components/Treatments";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import dayjs from "dayjs";
import { Cake, Fingerprint, Phone, Mail, FolderArchive, FileUser, FolderClock, FolderGit, FolderTree, PillBottle, Stethoscope } from "lucide-react";
import { getAppointmentsByPatient } from "@/api/appointments";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  cin: string;
  phone?: string;
  email?: string;
  gender: string;
  dateOfBirth?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PatientDossier() {
  const { id } = useParams();
  const router = useRouter();
  const t = useTranslations("patients.dossier");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getPatientById(id as string);
        setPatient(data);
      } catch (err) {
        console.error("Error fetching patient:", err);
      }

      try {
        const { data: appointments } = await getAppointmentsByPatient(id as string);
        setAppointments(appointments);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }

      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <div></div>;
  if (!patient) return <div>Patient non trouvé</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <Card className="p-4 mb-4 shadow-sm border border-gray-100">
          <div className="w-full flex items-start justify-between">
            <div className="flex w-full flex-row items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold flex flex-row gap-2 items-center">
                  {patient.firstName} {patient.lastName}
                </h2>
                <div className="flex flex-row gap-4 mt-2">
                  <Badge variant="neutral" className="text-sm flex flex-row gap-2 items-center">
                    <Cake size={14} /> {patient.dateOfBirth ? dayjs().diff(patient.dateOfBirth, "year") : "-"} ans
                  </Badge>
                  <Badge variant="neutral" className="text-sm flex flex-row gap-2 items-center">
                    <Fingerprint size={14} /> {patient.cin}
                  </Badge>
                  {patient.phone && (
                    <Badge variant="neutral" className="text-sm flex flex-row gap-2 items-center">
                      <Phone size={14} /> {patient.phone}
                    </Badge>
                  )}
                  {patient.email && (
                    <Badge variant="neutral" className="text-sm flex flex-row gap-2 items-center">
                      <Mail size={14} /> {patient.email}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 items-end">
                {appointments && (
                  <Button variant="primary" className="flex flex-row items-center gap-2" onClick={() => router.push(`/appointment/details/${appointments[0].id}`)}>
                    <Stethoscope /> Dernier Rendez-vous
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="patientInfo" className="space-y-4">
        <TabsList variant="solid">
          <TabsTrigger value="patientInfo">
            <FileUser className="mr-2" width={18} />
            {t("patientInfo")}
          </TabsTrigger>
          <TabsTrigger value="medicalHistory">
            <FolderClock className="mr-2" width={18} />
            {t("medicalHistory")}
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <FolderGit className="mr-2" width={18} />
            {t("appointments")}
          </TabsTrigger>
          <TabsTrigger value="documentsNotes">
            <FolderTree className="mr-2" width={18} />
            {t("documentsNotes")}
          </TabsTrigger>
          <TabsTrigger value="treatments">
            <PillBottle className="mr-2" width={18} />
            {t("treatments")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patientInfo">
          <PatientInfo patient={patient} />
        </TabsContent>

        <TabsContent value="medicalHistory">
          <MedicalHistory patientId={patient.id} />
        </TabsContent>

        <TabsContent value="appointments">
          <Appointments patientId={patient.id} />
        </TabsContent>

        <TabsContent value="documentsNotes">
          <DocumentsNotes patientId={patient.id} />
        </TabsContent>

        <TabsContent value="treatments">
          <Treatments patientId={patient.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}