"use client";

import { Button } from "@/components/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/Dialog";
import useTranslations from "@/lib/i18n/useTranslations";
import { RiCloseLine } from "@remixicon/react";
import { MailCheck, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { resendVerification, sendVerification, verifyEmailCode } from "@/api/verifications";
import { InviteMembersProps } from "../../../hooks/types";

interface UserData {
  id: string;
  email: string;
  status: string;
  firstName: string;
  lastName: string;
  role: string;
}

type ViewState = "loading" | "pending" | "success";

export default function Verification({ onSuccess }: InviteMembersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSendingInitial, setIsSendingInitial] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const t = useTranslations("dashboard.verification");

  const getUserData = (): UserData | null => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      return JSON.parse(userStr) as UserData;
    } catch {
      return null;
    }
  };

  const updateUserStatus = (status: string) => {
    const userData = getUserData();
    if (userData) {
      userData.status = status;
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const startCountdown = () => {
    setCountdown(30);
    setCanResend(false);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendInitialVerification = async () => {
    const userData = getUserData();
    if (!userData?.email) {
      setError(t("errorUserEmailMissing"));
      setViewState("pending");
      return;
    }

    setIsSendingInitial(true);
    setError(null);

    try {
      await sendVerification({ email: userData.email });
      setVerificationSent(true);
      setViewState("pending");
      startCountdown();
    } catch (err: any) {
      setError(err?.response?.data?.message || t("errorSendFailed"));
      setViewState("pending");
    } finally {
      setIsSendingInitial(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    const userData = getUserData();
    if (!userData?.email) {
      setError(t("errorUserEmailMissing"));
      return;
    }

    setIsResending(true);
    setError(null);

    try {
      await resendVerification({ email: userData.email });
      startCountdown();
    } catch (err: any) {
      setError(err?.response?.data?.message || t("errorResendFailed"));
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6 || isVerifying) return;
    setIsVerifying(true);
    setError(null);

    try {
      await verifyEmailCode({ code });
      updateUserStatus("ACTIVE");
      setViewState("success");
      setCode("");
      setTimeout(() => {
        setIsOpen(false);
        onSuccess?.();
      }, 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || t("errorInvalidCode"));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setCode("");
      setError(null);
      setViewState("loading");
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const userData = getUserData();
    if (!userData) {
      setError(t("errorUserDataMissing"));
      setViewState("pending");
      return;
    }

    if (userData.status === "ACTIVE" || userData.status === "VERIFIED") {
      setViewState("success");
    } else if (userData.status === "PENDING_VERIFICATION") {
      if (verificationSent) {
        setViewState("pending");
        startCountdown();
      } else {
        handleSendInitialVerification();
      }
    } else {
      setViewState("pending");
    }
  }, [isOpen]);

  return (
    <div className="flex items-center justify-center pt-6">
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="primary" className="w-full">
            <MailCheck className="w-4 h-4 mx-2" />
            {t("openDialog")}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogClose asChild>
            <Button
              className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
              variant="ghost"
            >
              <RiCloseLine className="size-5 shrink-0" />
            </Button>
          </DialogClose>

          <div className="[html[lang=ar]_&]:pt-8 px-2">
            {viewState === "loading" && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <MailCheck className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isSendingInitial ? t("sendingCode") : t("loading")}
                </p>
              </div>
            )}

            {viewState === "pending" && (
              <>
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <MailCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 text-center mb-2">
                  {t("dialogTitle")}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
                  {t("dialogDescription")}
                </p>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="verification-code"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      {t("codeLabel")}
                    </label>
                    <input
                      id="verification-code"
                      type="text"
                      value={code}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setCode(value);
                        setError(null);
                      }}
                      placeholder={t("codePlaceholder")}
                      maxLength={6}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-center tracking-widest"
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 dark:text-red-400 text-center">
                      {error}
                    </div>
                  )}

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleVerify}
                    disabled={code.length !== 6 || isVerifying}
                  >
                    {isVerifying ? t("verifying") : t("verifyButton")}
                  </Button>

                  <div className="text-center">
                    <button
                      onClick={handleResend}
                      disabled={!canResend || isResending}
                      className={`text-sm ${
                        canResend && !isResending
                          ? "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      {isResending
                        ? t("resending")
                        : canResend
                        ? t("resendButton")
                        : `${t("resendIn")} ${countdown}s`}
                    </button>
                  </div>
                </div>
              </>
            )}

            {viewState === "success" && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 text-center mb-2">
                  {t("successTitle")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {t("successMessage")}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
