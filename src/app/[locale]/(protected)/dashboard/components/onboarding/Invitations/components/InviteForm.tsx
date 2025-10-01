import { sendInvitation, SendInvitation } from "@/api/invitations";
import { Button } from "@/components/Button";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/Dialog";
import { Input } from "@/components/Input";
import { UserRoundPlus } from "lucide-react";
import React, { useCallback, useState } from "react";
import { TOAST_MESSAGE_KEYS } from "../../../../hooks/constants";
import { showToast, validateEmail } from "../../../../hooks/utils";
import useTranslations from "@/lib/i18n/useTranslations";

interface InviteFormProps {
  tenantId: string;
  onSuccess: () => void;
  onInviteSent: () => void;
}

const loadStoredUser = () => {
  if (typeof window === "undefined") return null;
  const storedUser = window.localStorage.getItem("user");
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("InviteForm - unable to parse stored user", error);
    return null;
  }
};

export const InviteForm: React.FC<InviteFormProps> = ({ tenantId, onSuccess, onInviteSent }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [storedUser] = useState(() => loadStoredUser());
  const t = useTranslations("dashboard.invitations");
  const hasUser = Boolean(storedUser);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!storedUser) {
        showToast("error", t("toasts.errorTitle"), t("errors.userMissing"));
        return;
      }

      if (!storedUser.email) {
        showToast("error", t("toasts.errorTitle"), t("errors.userIncomplete"));
        return;
      }

      if (storedUser.email === email.trim()) {
        showToast("error", t("toasts.errorTitle"), t("errors.selfInvitation"));
        return;
      }

      if (!tenantId) {
        showToast("error", t("toasts.errorTitle"), t(TOAST_MESSAGE_KEYS.TENANT_ERROR));
        return;
      }

      const emailErrorKey = validateEmail(email);
      if (emailErrorKey) {
        showToast("error", t("toasts.errorTitle"), t(emailErrorKey));
        return;
      }

      setIsLoading(true);
      try {
        await sendInvitation(tenantId, { email: email.trim() } as SendInvitation);
        showToast(
          "success",
          t("toasts.successTitle"),
          t(TOAST_MESSAGE_KEYS.INVITATION_SUCCESS, { email: email.trim() })
        );
        setEmail("");
        onSuccess();
        onInviteSent();
      } catch (error) {
        console.error("Error sending invitation:", error);
        showToast("error", t("toasts.errorTitle"), t(TOAST_MESSAGE_KEYS.INVITATION_ERROR));
      } finally {
        setIsLoading(false);
      }
    },
    [storedUser, tenantId, email, onSuccess, onInviteSent, t]
  );

  if (!hasUser) {
    return (
      <div>
        <DialogHeader>
          <DialogTitle className="text-base flex items-center">
            <UserRoundPlus className="w-5 h-5 mr-2 text-emerald-500" />
            {t("form.title")}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm/6">
            {t("form.loadingDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 flex w-full items-center space-x-2">
          <Input className="flex-1" placeholder={t("form.loadingPlaceholder")}
            type="email"
            disabled
          />
          <Button type="button" disabled className="shrink-0">
            {t("form.loadingButton")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="text-base flex items-center">
          <UserRoundPlus className="w-5 h-5 mx-2 text-emerald-500" />
          {t("form.title")}
        </DialogTitle>
        <DialogDescription className="mt-1 text-sm/6">
          {t("form.description")}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-6 flex w-full gap-2 items-center space-x-2">
        <Input
          className="flex-1"
          placeholder={t("form.placeholder")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading || !tenantId}
          required
        />
        <Button onClick={handleSubmit} disabled={isLoading} className="shrink-0">
          {isLoading ? t("form.submitting") : t("form.submit")}
        </Button>
      </div>

      {!tenantId && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {t(TOAST_MESSAGE_KEYS.TENANT_ERROR)}
        </p>
      )}
    </div>
  );
};
