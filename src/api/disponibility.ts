import api from "@/lib/api";

/* ===================== Availability Slots ===================== */

/** Get all availability slots (admin use) */
export const getAllAvailabilitySlots = () =>
  api.get("/availability-slots");

/** Get all slots for a specific doctor */
export const getAvailabilitySlotsByDoctor = (doctorProfileId: string) =>
  api.get(`/availability-slots/doctor/${doctorProfileId}`);

/** Get a single slot by its ID */
export const getAvailabilitySlotById = (slotId: string) =>
  api.get(`/availability-slots/${slotId}`);

/** Create a new availability slot manually */
export const createAvailabilitySlot = (payload: any) =>
  api.post("/availability-slots", payload);

/** ✅ Update availability for a single day for a specific doctor */
export const updateAvailabilitySlot = (
  doctorProfileId: string,
  dayOfWeek: string,
  payload: any
) => api.put(`/availability-slots/doctor/${doctorProfileId}/${dayOfWeek}`, payload);

/** ✅ Replace the full weekly schedule (all 7 days) */
export const replaceWeeklyAvailability = (
  doctorProfileId: string,
  payload: any
) => api.put(`/availability-slots/doctor/${doctorProfileId}/replace`, payload);

/** Delete a specific slot by ID */
export const deleteAvailabilitySlot = (slotId: string) =>
  api.delete(`/availability-slots/${slotId}`);


/* ===================== Availability Exceptions ===================== */

/** Get all availability exceptions (admin use) */
export const getAllAvailabilityExceptions = () =>
  api.get("/availability-exceptions");

/** Get all exceptions for a specific doctor */
export const getAvailabilityExceptionsByDoctor = (doctorProfileId: string) =>
  api.get(`/availability-exceptions/doctor/${doctorProfileId}`);

/** Get a specific exception by its ID */
export const getAvailabilityExceptionById = (id: string) =>
  api.get(`/availability-exceptions/${id}`);

/** Create an availability exception (e.g. vacation, conference, etc.) */
export const createAvailabilityException = (payload: any) =>
  api.post("/availability-exceptions", payload);

/** Update a specific availability exception */
export const updateAvailabilityException = (id: string, payload: any) =>
  api.put(`/availability-exceptions/${id}`, payload);

/** Delete a specific exception by ID */
export const deleteAvailabilityException = (id: string) =>
  api.delete(`/availability-exceptions/${id}`);
