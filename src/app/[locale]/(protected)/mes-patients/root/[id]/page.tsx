'use client';

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
import { AnimatePresence, motion } from "framer-motion";
import SocialHistory from "./components/medical-history/SocialHistory";
import Allergies from "./components/medical-history/Allergies";
import Vaccines from "./components/medical-history/Vaccines";
import LoadingState from "@/components/custom/LoadingState";
import { Cake, Fingerprint, Phone, Mail, FileUser, FolderClock, FolderGit, FolderTree, PillBottle, Stethoscope, FileClock, MilkOff, Syringe, ClipboardPlus } from "lucide-react";
import { getAppointmentsByPatient } from "@/api/appointments";

export default function PatientDossier() {
  const { id } = useParams();
  const router = useRouter();
  const t = useTranslations("patients.dossier");

  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<string>("patientInfo");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabFromUrl = params.get("tab");
    if (tabFromUrl) setActiveTab(tabFromUrl);
  }, []);

  // When tab changes, update URL
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    router.replace(`?${params.toString()}`);
  };

  // Fetch patient and appointments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getPatientById(id as string);
        setPatient(data);
      } catch {}
      try {
        const { data: apps } = await getAppointmentsByPatient(id as string);
        setAppointments(apps);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <LoadingState />;
  if (!patient) return <div>Patient non trouvé</div>;

  const tabAnimation = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.25 } };

  return (
    <div className="p-6">
      {/* Patient Card */}
      <Card className="p-4 mb-4 shadow-sm border border-gray-100 w-full">
        <div className="flex items-start justify-between w-full">
          <div>
            <h2 className="text-xl font-semibold flex flex-row gap-2 items-center">{patient.firstName} {patient.lastName}</h2>
            <div className="flex flex-row gap-4 mt-2">
              <Badge variant="neutral" className="text-sm flex flex-row gap-2 items-center">
                <Cake size={14} /> {patient.dateOfBirth ? dayjs().diff(patient.dateOfBirth, "year") : "-"} ans
              </Badge>
              <Badge variant="neutral" className="text-sm flex flex-row gap-2 items-center">
                <Fingerprint size={14} /> {patient.cin}
              </Badge>
              {patient.phone && <Badge variant="neutral" className="text-sm flex flex-row gap-2 items-center"><Phone size={14} /> {patient.phone}</Badge>}
              {patient.email && <Badge variant="neutral" className="text-sm flex flex-row gap-2 items-center"><Mail size={14} /> {patient.email}</Badge>}
            </div>
          </div>
          <div className="flex flex-row gap-2 items-end">
            <Button variant="secondary" className="flex flex-row items-center gap-2" onClick={() => router.push(`/appointment/create`)}>
              <ClipboardPlus width={18} /> Crée Un Nouveau Rendez-vous
            </Button>
            {appointments && appointments.length > 0 && (
              <Button variant="primary" className="flex flex-row items-center gap-2" onClick={() => router.push(`/appointment/details/${appointments[0].id}`)}>
                <Stethoscope width={18} /> Dernier Rendez-vous
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList variant="solid">
          <TabsTrigger value="patientInfo"><FileUser className="mr-2" width={18} /> Patient Info</TabsTrigger>
          <TabsTrigger value="medicalHistory"><FolderClock className="mr-2" width={18} /> Medical History</TabsTrigger>
          <TabsTrigger value="socialHistory"><FileClock className="mr-2" width={18} /> Social History</TabsTrigger>
          <TabsTrigger value="Allergies"><MilkOff className="mr-2" width={18} /> Allergies</TabsTrigger>
          <TabsTrigger value="vaccine"><Syringe className="mr-2" width={18} /> Vaccine</TabsTrigger>
          <TabsTrigger value="appointments"><FolderGit className="mr-2" width={18} /> Appointments</TabsTrigger>
          <TabsTrigger value="documentsNotes"><FolderTree className="mr-2" width={18} /> Documents & Notes</TabsTrigger>
          <TabsTrigger value="treatments"><PillBottle className="mr-2" width={18} /> Treatments</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {activeTab === "patientInfo" && <motion.div key="patientInfo" {...tabAnimation}><TabsContent value="patientInfo"><PatientInfo patient={patient} /></TabsContent></motion.div>}
          {activeTab === "medicalHistory" && <motion.div key="medicalHistory" {...tabAnimation}><TabsContent value="medicalHistory"><MedicalHistory patientId={patient.id} /></TabsContent></motion.div>}
          {activeTab === "socialHistory" && <motion.div key="socialHistory" {...tabAnimation}><TabsContent value="socialHistory"><SocialHistory patientId={patient.id} /></TabsContent></motion.div>}
          {activeTab === "Allergies" && <motion.div key="Allergies" {...tabAnimation}><TabsContent value="Allergies"><Allergies patientId={patient.id} /></TabsContent></motion.div>}
          {activeTab === "vaccine" && <motion.div key="vaccine" {...tabAnimation}><TabsContent value="vaccine"><Vaccines patientId={patient.id} /></TabsContent></motion.div>}
          {activeTab === "appointments" && <motion.div key="appointments" {...tabAnimation}><TabsContent value="appointments"><Appointments patientId={patient.id} /></TabsContent></motion.div>}
          {activeTab === "documentsNotes" && <motion.div key="documentsNotes" {...tabAnimation}><TabsContent value="documentsNotes"><DocumentsNotes patientId={patient.id} /></TabsContent></motion.div>}
          {activeTab === "treatments" && <motion.div key="treatments" {...tabAnimation}><TabsContent value="treatments"><Treatments patientId={patient.id} /></TabsContent></motion.div>}
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
