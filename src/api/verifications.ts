import api from "@/lib/api";

/* ========== Types ========== */

export interface SendVerification {
  email: string;
}

export interface VerifyCode {
  code: string;
}

/* ========== API helpers ========== */

// Send the initial verification code to an existing user
export const sendVerification = (payload: SendVerification) =>
  api.post(`/auth/send-verification?email=${payload.email}`);

// Verify the 6-digit code the user received via email
export const verifyEmailCode = (payload: VerifyCode) =>
  api.post(`/auth/verify`, payload);

// Resend verification code (if previous one expired or lost)
export const resendVerification = (payload: SendVerification) =>
  api.post(`/auth/resend?email=${payload.email}`);
