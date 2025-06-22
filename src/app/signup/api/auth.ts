import api from "@/lib/api";

export interface RegisterDoctor {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  adress: string;
  email: string;
  password: string;
  dateOfBirth: string;
  speciality: string;
}

export interface RegisterPatient {
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
export const registerDoctor = (payload: RegisterDoctor) =>
  api.post("/register", { ...payload, role: "doctor" });

export const registerPatient = (payload: RegisterPatient) =>
  api.post("/register", { ...payload, role: "patient" });
