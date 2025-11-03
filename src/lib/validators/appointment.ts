
import { z } from 'zod';

export const appointmentSchema = z.object({
  patientId: z.string().min(1, { message: "Patient is required." }),
  date: z.date({ required_error: "Date is required." }),
  serviceId: z.string().min(1, { message: "Service is required." }),
  doctorId: z.string().min(1, { message: "Doctor is required." }),
  cost: z.number().min(0, { message: "Cost must be a positive number." }),
  motif: z.string().min(1, { message: "Motif is required." }),
  note: z.string().optional(),
  locationType: z.enum(["LOCAL", "IN_PERSON", "VIDEO"]),
  placelocation: z.string().optional(),
  inWaitingRoom: z.boolean().optional(),
  urgent: z.boolean().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
