import { AppointmentStatus, ConsultationType } from "@/api/appointments";

export type CalendarViewType = "month" | "week" | "day" | "list";

export interface CalendarAppointment {
  id: string;
  patient?: string;
  type?: string;
  typeColor?: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string | undefined;
  notes?: string | undefined;
  patientProfileId: string;
  date_of_birth?: string;
  consultationType?: ConsultationType;
  motif?: string;
  timeSpentInWaitingRoom?: {
    enterTime: string;
    endTime: string;
  };
  status: AppointmentStatus;
  serviceId?: string;
  recurring: boolean;
  isUrgent: boolean;
  patientFullName: string;
  doctorProfileId: string;
  createdAt: string;
  updatedAt: string;
  timeOfExitFromConsultation?: string;
  price?: number;
}
