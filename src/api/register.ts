import api from "@/lib/api";

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
  tenantId?: string,
  userId: string,
  specialty?: string,
  licenseNumber?: string
}

export interface UserAsProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  adress: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: "male" | "female";
  cin: string;
}

/* ========== API helpers ========== */
export const registerDoctor = (payload: UserAsDoctor) =>
  api.post("/users", { ...payload, role: "DOCTOR" }) ; 

export const getDoctorProfile = (userId : string) =>
  api.get(`/doctor-profiles/by-user/${userId}`) ; 

export const registerDoctorProfile = (payload: RegisterDoctor) =>
  api.post("/doctor-profiles", { ...payload }) ; 

export const updateDoctorProfile = (payload: RegisterDoctor ,doctorid : string) =>
  api.put(`/doctor-profiles/${doctorid}`, { ...payload }) ; 

export const registerPatient = (payload: UserAsProfile) =>
  api.post("/users", { ...payload, role: "PATIENT" });
