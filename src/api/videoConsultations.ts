import api from "@/lib/api"

// =========================
// Types
// =========================

export interface VideoConsultation {
  id: string
  appointmentId: string
  videoSessionId: string
  diagnosis?: string
  prescription?: string
  notes?: string
  feedback?: string
  createdAt: string
  updatedAt: string
}

export interface VideoConsultationCreateDTO {
  appointmentId: string
  videoSessionId: string
  diagnosis?: string
  prescription?: string
  notes?: string
  feedback?: string
}

export interface VideoConsultationUpdateDTO {
  videoSessionId?: string
  diagnosis?: string
  prescription?: string
  notes?: string
  feedback?: string
}

// =========================
// API Helpers
// =========================

export const getAllVideoConsultations = async () => {
  return api.get<VideoConsultation[]>("/video-consultations")
}

export const getVideoConsultationById = async (id: string) => {
  return api.get<VideoConsultation>(`/video-consultations/${id}`)
}

export const getVideoConsultationByAppointment = async (appointmentId: string) => {
  return api.get<VideoConsultation>(
    `/video-consultations/appointment/${appointmentId}`
  )
}

export const createVideoConsultation = async (data: VideoConsultationCreateDTO) => {
  return api.post<VideoConsultation>("/video-consultations", data)
}

export const updateVideoConsultation = async (
  id: string,
  data: VideoConsultationUpdateDTO
) => {
  return api.put<VideoConsultation>(`/video-consultations/${id}`, data)
}

export const deleteVideoConsultation = async (id: string) => {
  return api.delete(`/video-consultations/${id}`)
}
