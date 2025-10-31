import { Button } from "@/components/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";
import { cx } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  Edit2,
  MapPin,
  Phone,
  RefreshCw,
  User,
  Mail,
  CreditCard,
  AlertCircle,
  X,
  CircleOff,
  MapPinCheckInside,
  CalendarCheck,
  CirclePlay,
} from "lucide-react";
import { useState, useEffect } from "react";
import { CopyableRow } from "./CopyableRow";

import { getPatientById, TenantPatient } from "@/api/patients";
import { Card } from "@/components/Card";
import { Divider } from "@/components/Divider";
import { getStatusLabel, getStatusDotColor, getConsultationType, getConsultationDotColor, getGenderLabel, formatTime, getValidDate } from "./helpers/details";
import { CalendarAppointment } from "./helpers/types";

type AppointmentDetailsProps = {
  appointment: CalendarAppointment | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (appointmentId: string) => void;
  onAppointmentDeleted?: (appointmentId: string) => void;
};

export const AppointmentDetails = ({
  appointment,
  isOpen,
  onClose,
  onEdit,
  onAppointmentDeleted,
}: AppointmentDetailsProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [patientData, setPatientData] = useState<TenantPatient | null>(null);
  const [loadingPatient, setLoadingPatient] = useState(false);

  useEffect(() => {
    if (!isOpen || !appointment?.patientProfileId) {
      setPatientData(null);
      setLoadingPatient(false);
      return;
    }

    const fetchPatientData = async () => {
      setLoadingPatient(true);
      setPatientData(null);
      try {
        const { data } = await getPatientById(appointment?.patientProfileId);
        setPatientData(data);
      } catch (error) {
        console.error("Erreur lors du chargement du patient:", error);
        setPatientData(null);
      } finally {
        setLoadingPatient(false);
      }
    };

    fetchPatientData();
  }, [appointment?.patientProfileId, isOpen]);

  if (!appointment) return null;

  const appointmentDate = getValidDate(appointment.date);
  const patientBirthDate = getValidDate(patientData?.dateOfBirth);
  const createdAtDate = getValidDate(appointment.createdAt);
  const updatedAtDate = getValidDate(appointment.updatedAt);

  const handleDelete = async () => {
    if (!appointment.id) return;

    setIsDeleting(true);
    try {
      onAppointmentDeleted?.(appointment.id);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    if (appointment.id && onEdit) {
      onEdit(appointment.id);
    }
  };

  const consultationType = getConsultationType(appointment.consultationType || appointment.type);

  const patientFullName = patientData
    ? `${patientData.firstName} ${patientData.lastName}`.trim()
    : "Patient inconnu";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">Détails du rendez-vous</DialogTitle>
          <Button variant="light" onClick={onClose}><X width={18} /></Button>
        </DialogHeader>

        <Divider />

        <div className="mt-4 space-y-4">
          <div className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                {appointmentDate ? format(appointmentDate, "EEEE d MMMM yyyy", { locale: fr }) : "--"}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {formatTime(appointment.startTime)}
                {appointment.endTime && appointment.endTime !== null && ` - ${formatTime(appointment.endTime)}`}
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <div className="flex items-center gap-1.5 border border-0.5 dark:border-gray-800 border-gray-200 rounded-full p-2 px-4">
                <span className={cx("w-2 h-2 rounded-full", getConsultationDotColor(appointment.consultationType || appointment.type))} />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {consultationType.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5 border border-0.5 dark:border-gray-800 border-gray-200  rounded-full p-2 px-4">
                <span className={cx("w-2 h-2 rounded-full", getStatusDotColor(appointment.status))} />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {getStatusLabel(appointment.status)}
                </span>
              </div>
            </div>
          </div>

          <Divider />

          <div>
            {appointment.motif && (
              <div className="">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-1">{appointment.motif}</h4>
              </div>
            )}

            {appointment.notes && (
              <div className="">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{appointment.notes}</p>
              </div>
            )}
          </div>


          <Divider />

          <div className="space-y-3 pt-2">
            {loadingPatient ? (
              <p className="text-sm text-gray-500">Chargement...</p>
            ) : patientData ? (

              <div className="">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{patientFullName}</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span
                      className={cx(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        getGenderLabel(patientData.gender) === "Homme"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          : "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
                      )}
                    >
                      {getGenderLabel(patientData.gender)}
                    </span>
                    {patientBirthDate && <span className="mx-2">•</span>}
                    {patientBirthDate && <span>{format(patientBirthDate, "dd/MM/yyyy")} ({new Date().getFullYear() - patientBirthDate.getFullYear()} ans)</span>}
                  </p>
                </div>

                <div className="w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mt-2">
                  <table className="w-full table-auto">
                    <tbody>
                      {patientData.cin && (
                        <CopyableRow
                          icon={<CreditCard className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
                          label="CIN"
                          value={patientData.cin}
                        />
                      )}
                      {patientData.phone && (
                        <CopyableRow
                          icon={<Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
                          label="Téléphone"
                          value={patientData.phone}
                        />
                      )}
                      {patientData.email && (
                        <CopyableRow
                          icon={<Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
                          label="Email"
                          value={patientData.email}
                        />
                      )}
                      {patientData.address && (
                        <CopyableRow
                          icon={<MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
                          label="Adresse"
                          value={patientData.address}
                        />
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <p className="text-sm text-gray-700 dark:text-gray-300">Données patient indisponibles</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {appointment.location && (
              <Card className="p-4 w-full">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-50">Lieu</h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{appointment.location}</p>
              </Card>
            )}

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <RefreshCw className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-50">Récurrent</h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{appointment.recurring ? "Oui" : "Non"}</p>
              </Card>
          </div>

          <Divider />

          <div className="flex justify-between items-center">
            <div
              className="flex space-x-2 overflow-x-auto cursor-grab"
              style={{ overflowY: "hidden", scrollbarWidth: "none", msOverflowStyle: "none" }}
              onMouseDown={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.dataset.isDown = "true";
                el.dataset.startX = (e.pageX - el.offsetLeft).toString();
                el.dataset.scrollLeft = el.scrollLeft.toString();
                el.classList.add("cursor-grabbing");
              }}
              onMouseMove={(e) => {
                const el = e.currentTarget as HTMLElement;
                if (el.dataset.isDown !== "true") return;
                e.preventDefault();
                const x = e.pageX - el.offsetLeft;
                const walk = x - Number(el.dataset.startX || 0);
                el.scrollLeft = Number(el.dataset.scrollLeft || 0) - walk;
              }}
              onMouseUp={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.dataset.isDown = "false";
                el.classList.remove("cursor-grabbing");
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.dataset.isDown = "false";
                el.classList.remove("cursor-grabbing");
              }}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                const el = e.currentTarget as HTMLElement;
                el.dataset.isDown = "true";
                el.dataset.startX = (touch.pageX - el.offsetLeft).toString();
                el.dataset.scrollLeft = el.scrollLeft.toString();
              }}
              onTouchMove={(e) => {
                const touch = e.touches[0];
                const el = e.currentTarget as HTMLElement;
                if (el.dataset.isDown !== "true") return;
                const x = touch.pageX - el.offsetLeft;
                const walk = x - Number(el.dataset.startX || 0);
                el.scrollLeft = Number(el.dataset.scrollLeft || 0) - walk;
              }}
              onTouchEnd={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.dataset.isDown = "false";
              }}
            >
              <Button variant="secondary" onClick={handleEdit} disabled={isEditing} className="text-sm flex flex-row items-center gap-2">
                <Edit2 width={18} /> {isEditing ? "Modification..." : "Modifier"}
              </Button>
              <Button variant="secondary" onClick={handleEdit} disabled={isEditing} className="text-sm flex flex-row items-center gap-2">
                <MapPinCheckInside width={18} /> {isEditing ? "Modification..." : "Patient Arrivé"}
              </Button>
              <Button variant="success" onClick={handleEdit} disabled={isEditing} className="text-sm flex flex-row items-center gap-2">
                <CalendarCheck width={18} /> {isEditing ? "Confirmation..." : "Patient Confirmé"}
              </Button>
              <Button variant="success" onClick={handleEdit} disabled={isEditing} className="text-sm flex flex-row items-center gap-2">
                <CirclePlay width={18} /> {isEditing ? "Chargement..." : "Debut Consultation"}
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="text-sm flex flex-row items-center gap-2">
                <CircleOff width={18} /> {isDeleting ? "Annulation..." : "Annuler"}
              </Button>
            </div>
          </div>

          <Divider />

          {(createdAtDate || updatedAtDate) && (
            <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-row items-center gap-4">
              {createdAtDate && (
                <p><span className="font-medium">Créé le :</span> {format(createdAtDate, "dd/MM/yyyy HH:mm", { locale: fr })}</p>
              )}
              -
              {updatedAtDate && (
                <p><span className="font-medium">Modifié le :</span> {format(updatedAtDate, "dd/MM/yyyy HH:mm", { locale: fr })}</p>
              )}
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
};