// Make sure you import the Appointment response type
import { updateAppointment, AppointmentUpdateDTO, AppointmentResponse } from "@/api/appointments";

/**
 * Toggle the recurring status of an appointment
 */
export const toggleRecurring = async (
  appointmentId: string,
  currentRecurringState: boolean
): Promise<AppointmentResponse> => {
  try {
    const updateData: AppointmentUpdateDTO = {
      recurring: !currentRecurringState,
    };
    
    const response = await updateAppointment(appointmentId, updateData);
    return response.data; 
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut récurrent:", error);
    throw error;
  }
};

/**
 * Mark patient as arrived
 */
export const markPatientArrived = async (
  appointmentId: string
): Promise<AppointmentResponse> => {
  try {
    const updateData: AppointmentUpdateDTO = {
      status: "ARRIVED",
      notes: "Patient arrivé",
    };
    
    const response = await updateAppointment(appointmentId, updateData);
    return response.data; // <-- Return data
  } catch (error) {
    console.error("Erreur lors du marquage de l'arrivée du patient:", error);
    throw error;
  }
};

/**
 * Confirm patient appointment
 */
export const confirmPatientAppointment = async (
  appointmentId: string
): Promise<AppointmentResponse> => { // <-- Changed return type
  try {
    const updateData: AppointmentUpdateDTO = {
      status: "CONFIRMED", 
    };
    
    const response = await updateAppointment(appointmentId, updateData);
    return response.data; // <-- Return data
  } catch (error) {
    console.error("Erreur lors de la confirmation du rendez-vous:", error);
    throw error;
  }
};

/**
 * Start consultation
 */
export const startConsultation = async (
  appointmentId: string
): Promise<AppointmentResponse> => { 
  try {
    const updateData: AppointmentUpdateDTO = {
      status: "IN_PROGRESS",
    };
    
    const response = await updateAppointment(appointmentId, updateData);
    return response.data; // <-- Return data
  } catch (error) {
    console.error("Erreur lors du démarrage de la consultation:", error);
    throw error;
  }
};

/**
 * Cancel appointment
 */
export const cancelAppointment = async (
  appointmentId: string,
  reason?: string
): Promise<AppointmentResponse> => { 
  try {
    const updateData: AppointmentUpdateDTO = {
      status: "CANCELLED",
      ...(reason && { notes: reason }),
    };
    
    const response = await updateAppointment(appointmentId, updateData);
    return response.data; 
  } catch (error) {
    console.error("Erreur lors de l'annulation du rendez-vous:", error);
    throw error;
  }
};

/**
 * Complete appointment
 */
export const completeAppointment = async (
  appointmentId: string
): Promise<AppointmentResponse> => {
  try {
    const updateData: AppointmentUpdateDTO = {
      status: "COMPLETED",
    };
    
    const response = await updateAppointment(appointmentId, updateData);
    return response.data;
  } catch (error) { 
    console.error("Erreur lors de la finalisation du rendez-vous:", error);
    throw error;
  }
};