import api from "@/lib/api";

// =========================
// Types
// =========================

export interface DashboardKpiDto {
  todayAppointments: number;
  waitingPatients: number;
  completed7days: number;
  newPatientsMonth: number;
  videoConsultations: number;
  csat: number;
  totalPatients: number;
}

export interface AlertDto {
  id: string;
  category: string;
  date: string;
  closed: boolean;
}

export interface FollowUpKpiDto {
  scheduledFollowUps: number;
  totalFollowUps: number;
  closedFollowUps: number;
}

export interface DailyConsultationStatsDto {
  date: string; // yyyy-MM-dd
  total: number;
  localCount: number;
  inPersonCount: number;
  videoCount: number;
}

export interface MonthlyConsultationEvolutionDto {
  days: DailyConsultationStatsDto[];
}

export interface PerformanceStatsDto {
  attendedPct: number;
  attendedCount: number;
  missedPct: number;
  missedCount: number;
  avgConsultationTime: string;
  pctLess20Min: number;
  pctMore20Min: number;
}


/**
 * Get monthly revenue for a doctor
 */
export interface DailyRevenueDto {
  date: string; // yyyy-MM-dd
  totalAmount: number;
}

export interface MonthlyRevenueDto {
  days: DailyRevenueDto[];
}


export interface ServiceDepartmentStatsDto {
  appointmentsPerService: Record<string, number>;
  appointmentsPerDepartment: Record<string, number>;
  summaryParagraph: string;
}

export interface UrgentStatsDto {
  urgent: number;
  nonUrgent: number;
}

export interface DoctorAppointmentsDto {
  doctorProfileId: string;
  doctorName: string;
  appointmentCount: number;
}


// =========================
// API Helpers
// =========================

/**
 * Get doctor dashboard KPIs
 */
export const getDoctorKpi = async (tenantId: string, doctorId?: string) => {
  return api.get<DashboardKpiDto>("/dashboard/doctor/kpi", {
    params: { tenantId, doctorId },
  });
};

/**
 * Get doctor alerts
 */
export const getDoctorAlerts = async (tenantId: string, doctorId?: string) => {
  return api.get<AlertDto[]>("/dashboard/doctor/alerts", {
    params: { tenantId, doctorId },
  });
};

/**
 * Get follow-up KPIs for a doctor
 */
export const getDoctorFollowUpKpi = async (tenantId: string, doctorId: string) => {
  return api.get<FollowUpKpiDto>(`/dashboard/doctor/doctor/${doctorId}/follow-up-kpi`, {
    params: { tenantId },
  });
};

/**
 * Get service & department statistics for last week
 */
export const getServiceDepartmentStats = async (tenantId: string , doctorId: string) => {
  return api.get<ServiceDepartmentStatsDto>("/dashboard/doctor/api/dashboard/service-department-stats", {
    params: { doctorId , tenantId },
  });
};

/**
 * Get monthly consultation evolution
 */
export const getConsultationEvolution = async (doctorProfileId: string, month: number, year: number) => {
  return api.get<MonthlyConsultationEvolutionDto>("/dashboard/consultation-evolution", {
    params: { doctorProfileId, month, year },
  });
};

/**
 * Get monthly performance statistics
 */
export const getPerformanceStats = async (doctorProfileId: string, month: number, year: number) => {
  return api.get<PerformanceStatsDto>("/dashboard/performance-stats", {
    params: { doctorProfileId, month, year },
  });
};
export function getnotifications(tenantId: string, doctorId: string | undefined) {
  throw new Error("Function not implemented.");
}

export function getDiseaseStats(arg0: string, tenantId: string) {
  throw new Error("Function not implemented.");
}

export const getMonthlyRevenue = async (doctorId: string, month: number, year: number) => {
  return api.get<MonthlyRevenueDto>(`/dashboard/doctor/${doctorId}/monthly-revenue`, {
    params: { month, year },
  });
};

/**
 * Get urgent vs non-urgent appointment statistics
 */
export const getUrgentStats = async (tenantId: string) => {
  return api.get<UrgentStatsDto>("/dashboard/doctor/urgent-stats", {
    params: { tenantId },
  });
};

/**
 * Get appointment count statistics per doctor
 */
export const getDoctorAppointmentsStats = async (tenantId: string) => {
  return api.get<DoctorAppointmentsDto[]>("/dashboard/doctor/doctor-appointments-stats", {
    params: { tenantId },
  });
};