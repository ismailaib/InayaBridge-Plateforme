import axios from "@/lib/axios"

/* ==================== Types ==================== */

export type Patient = {
  id?: number | undefined
  first_name?: string
  last_name?: string
  phone_number?: string
  address?: string
  email?: string
  date_of_birth?: string // YYYY-MM-DD
  gender?: "male" | "female" | string
  cin?: string
  medical_history?: {
    allergies?: string[]
    past_conditions?: string[]
    chronic_illnesses?: string[] | null
    current_medications?: {
      name: string
      dosage: string
    }[]
  }
  blood_type?: string
  contact_urgence?: {
    relation: string
    phone_number: string
  }
  documents?: {
    type: string
    url: string
  }[]
}

/* ==================== GET ==================== */

export const getDoctorPatients = () =>
  axios.get<Patient[]>("/patientsDoctor")

/* ==================== POST ==================== */

export const createPatient = (payload: Patient) =>
  axios.post<Patient>("/patientsDoctor", payload)

/* ==================== PUT ==================== */

export const updatePatient = (id: number | string, payload: Patient) =>
  axios.put<Patient>(`/patientsDoctor/${id}`, payload)


/* ==================== Delete ==================== */

export const deletePatient = (id: number) =>
  axios.delete<Patient>(`/patientsDoctor/${id}`)
