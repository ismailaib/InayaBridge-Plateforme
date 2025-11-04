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
  consultationType?: string;
  motif?: string;
  timeSpentInWaitingRoom?: {
    enterTime: string;
    endTime: string;
  };
  status: string;
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
