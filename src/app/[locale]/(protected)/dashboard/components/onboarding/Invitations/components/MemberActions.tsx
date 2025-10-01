import React, { useRef, useEffect } from "react";
import { Member } from "../../../../hooks/types";
import { Button } from "@/components/Button";
import { Link2Off, RefreshCcw } from "lucide-react";
import { cancelInvitation, recentInvitation } from "@/api/invitations";
import { showToast } from "../../../../hooks/utils";
import useTranslations from "@/lib/i18n/useTranslations";

export const MemberActions: React.FC<{
  member: Member;
  tenantId: string;
  onDelete: (id: string) => void;
  onRecentInvitation: (id: string) => void;
}> = ({ member, tenantId, onDelete, onRecentInvitation }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("dashboard.invitations");

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      element.classList.add("cursor-grabbing");
      element.classList.remove("cursor-grab");
      startX = e.pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      element.classList.add("cursor-grab");
      element.classList.remove("cursor-grabbing");
    };

    const handleMouseUp = () => {
      isDown = false;
      element.classList.add("cursor-grab");
      element.classList.remove("cursor-grabbing");
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - element.offsetLeft;
      const walk = (x - startX) * 2;
      element.scrollLeft = scrollLeft - walk;
    };

    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mouseup", handleMouseUp);
    element.addEventListener("mousemove", handleMouseMove);

    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mouseup", handleMouseUp);
      element.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleCancelInvitation = async () => {
    try {
      await cancelInvitation(member.id, tenantId);
      showToast("success", t("toasts.successTitle"), t("toasts.invitationCancelled"));
      onDelete(member.id);
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      showToast("error", t("toasts.errorTitle"), t("toasts.invitationCancelError"));
    }
  };

  const handleRecentInvitation = async () => {
    try {
      if (member.status !== "PENDING") {
        showToast("error", t("toasts.errorTitle"), t("errors.invitationNotPending"));
        return;
      }
      await recentInvitation(member.id, tenantId);
      showToast("success", t("toasts.successTitle"), t("toasts.invitationResent"));
      onRecentInvitation(member.id);
    } catch (error) {
      console.error("Error sending invitation:", error);
      showToast("error", t("toasts.errorTitle"), t("toasts.invitationResendError"));
    }
  };

  return (
    <div className="mt-4">
      <div
        ref={scrollRef}
        className="flex flex-row items-center gap-4 overflow-x-auto touch-pan-x select-none cursor-grab pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <Button variant="secondary" className="flex-shrink-0 whitespace-nowrap" onClick={handleCancelInvitation}>
          <Link2Off width={18} className="mr-2" />
          {t("actions.delete")}
        </Button>
        <Button variant="secondary" className="flex-shrink-0 whitespace-nowrap" onClick={handleRecentInvitation}>
          <RefreshCcw width={18} className="mr-2" />
          {t("actions.resend")}
        </Button>
      </div>
    </div>
  );
};
