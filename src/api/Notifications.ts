import api from "@/lib/api";

/* ========== API helpers ========== */
export const getnotifications = (id: string) =>
  api.get(`/notifications/user/${id}`);
