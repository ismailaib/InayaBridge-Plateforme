import api from "@/lib/api";

/* ============================================================
   Types
============================================================ */


export interface UserPreferences {
  theme: string;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  compactMode: boolean;
  enableAnimations: boolean;
  enableSoundEffects: boolean;
  enableNotifications: boolean;
  notificationChannels: Record<string, boolean>;
  publicProfile: boolean;
  showOnlineStatus: boolean;
  dashboardModules: Record<string, boolean>;
}

/* ============================================================
    User Preferences API
============================================================ */

// 🔹 Get user preferences
export const getUserPreferences = (userId: string) =>
  api.get(`/users/${userId}/preferences`);

// 🔹 Update user preferences
export const updateUserPreferences = (userId: string, payload: UserPreferences) =>
  api.put(`/users/${userId}/preferences`, payload);
