export type CalendarViewType = "month" | "week" | "day" | "list"

export interface CalendarAppointment {
  id: string
  patient: string
  phoneNumber: string
  type: string
  typeColor?: string
  date: string
  startTime: string
  endTime: string
  location: string
  notes: string
  confirmed: boolean
  date_of_birth?: string
  consultationType?: string
  motif?: string
  timeSpentInWaitingRoom?: {
    enterTime: string
    endTime: string
  }
  timeOfExitFromConsultation?: string
}