import api from "@/lib/api";

/* ============================================================
   Types
============================================================ */

export interface UserPreferences {
  // UI & Locale
  theme: string;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;

  // UX
  compactMode: boolean;
  enableAnimations: boolean;
  enableSoundEffects: boolean;

  // Notifications
  enableNotifications: boolean;
  notificationChannels: Record<string, boolean>;

  // Privacy
  publicProfile: boolean;
  showOnlineStatus: boolean;

  // Calendar
  showUnavailableDays: boolean;
  showAddAppointment: boolean;
  showCalendarView: boolean;

  // Dashboard modules
  dashboardModules: Record<string, boolean>;
}

/* ============================================================
   User Preferences API
============================================================ */

// 🔹 Get user preferences
export const getUserPreferences = (userId: string) =>
  api.get<UserPreferences>(`/users/${userId}/preferences`);

// 🔹 Update user preferences (partial updates allowed)
export const updateUserPreferences = (
  userId: string,
  payload: Partial<UserPreferences>
) => api.put<UserPreferences>(`/users/${userId}/preferences`, payload);
