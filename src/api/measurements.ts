import api from "@/lib/api";

export interface Measurement {
  reverse(): unknown;
  id: string;
  patientId: string;
  heartRate: number;
  spo2: number;
  createdAt: string;
}

export interface MeasurementCreateDTO {
  patientId: string;
  heartRate: number;
  spo2: number;
}

export const getMeasurementsByPatient = async (patientId: string) => {
  return api.get<Measurement[]>(`/measurements/patient/${patientId}`);
};

export const getLatestMeasurement = async (patientId: string) => {
  return api.get<Measurement>(`/measurements/patient/${patientId}/latest`);
};

export const createMeasurement = async (data: MeasurementCreateDTO) => {
  return api.post<Measurement>(`/measurements`, data);
};

// 🔥 Call ESP32 (this was missing)
export const requestMeasurement = async (patientId: string) => {
  return api.post(`/sensor/request?patientId=${patientId}`);
};
