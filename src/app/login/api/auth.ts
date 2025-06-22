import api from "@/lib/api"

/* ---------- Payload envoyé ---------- */
export interface LoginPayload {
  email: string
  password: string
}

/* ---------- Profils imbriqués ---------- */
export interface DoctorProfile {
  id: number
  userId: number
  speciality: string
  licenseNumber: string | null
  planId: number | null
  cin: string | null
  availability: unknown | null        // adapte le type si tu connais la forme
  consultationStats: unknown | null
  created_at: string                  // ISO date
  updated_at: string
}

export interface PatientProfile {
  id: number
  userId: number
  gender: "male" | "female"
  cin: string
  // Ajoute ici d’autres attributs (allergies ? dossier médical ?)
  created_at: string
  updated_at: string
}

/* ---------- Utilisateur racine ---------- */
export interface User {
  id: number
  email: string
  role: "doctor" | "patient" | string
  firstName: string
  lastName: string
  phoneNumber: string
  adress: string
  created_at: string
  updated_at: string
  doctor?: DoctorProfile              // présent si role === "doctor"
  patient?: PatientProfile            // présent si role === "patient"
}

/* ---------- Réponse API ---------- */
export interface LoginResponse {
  message: string
  token: string
  user: User
}

/* ---------- Helper ---------- */
export const login = (payload: LoginPayload) =>
  api.post<LoginResponse>("/login", payload)
