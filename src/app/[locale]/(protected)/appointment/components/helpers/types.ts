export type CalendarViewType = "month" | "week" | "day" | "list";

export interface CalendarAppointment {
  id: string;
  patient: string;
  type: string;
  typeColor?: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  notes: string;
  patientProfileId: string;
  confirmed: boolean;
  date_of_birth?: string;
  consultationType?: string;
  motif?: string;
  timeSpentInWaitingRoom?: {
    enterTime: string;
    endTime: string;
  };
  status: string;
  recurring: boolean;
  patientFullName: string;
  createdAt: string;
  updatedAt: string;
  timeOfExitFromConsultation?: string;
}
