import api from "@/lib/api";

/* ========== Interfaces ========== */

export interface UserAsDoctor {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  adress: string;
  email: string;
  password: string;
  dateOfBirth: string;
}

export interface RegisterDoctor {
  tenantId?: string;
  userId: string;
  specialty?: string;
  roleId?:string;
  departmentId?:string;
  licenseNumber?: string;
}

export interface UserAsProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  adress: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  cin: string;
}

/* ========== API Helpers ========== */

/** Get user full info (includes doctor/patient profiles) */
export const getUserProfile = (userId: string) =>
  api.get(`/users/${userId}/full-info`);

/** Register new doctor user */
export const registerDoctor = (payload: UserAsDoctor) =>
  api.post("/users", { ...payload, role: "DOCTOR" });

/** Register doctor profile */
export const registerDoctorProfile = (payload: RegisterDoctor) =>
  api.post("/doctor-profiles", { ...payload });

/** Get doctor profile by userId */
export const getDoctorProfile = (userId: string) =>
  api.get(`/doctor-profiles/by-user/${userId}`);

/** Update doctor profile */
export const updateDoctorProfile = (payload: RegisterDoctor, doctorId: string) =>
  api.put(`/doctor-profiles/${doctorId}`, { ...payload });

/** Register patient user */
export const registerPatient = (payload: UserAsProfile) =>
  api.post("/users", { ...payload, role: "PATIENT" });

/** Update user base profile (non-doctor specific fields) */
export const updateUserProfile = (
  userId: string,
  payload: Partial<UserAsProfile>
) => api.put(`/users/${userId}`, payload);

/** Change password for a user (if backend adds endpoint `/users/{id}/password`) */
export const changeUserPassword = (
  userId: string,
  payload: { currentPassword: string; newPassword: string }
) => api.put(`/users/${userId}/password`, payload);

/** Delete a user */
export const deleteUser = (userId: string) => api.delete(`/users/${userId}`);

/** Delete a doctor profile */
export const deleteDoctorProfile = (doctorId: string) =>
  api.delete(`/doctor-profiles/${doctorId}`);

/** Upload user profile image */
export const uploadUserProfileImage = (userId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post(`/users/${userId}/upload-profile`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};