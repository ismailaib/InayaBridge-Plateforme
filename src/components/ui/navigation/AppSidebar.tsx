"use client";

import { Divider } from "@/components/Divider";
import { Input } from "@/components/Input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarLink,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarSubLink,
} from "@/components/Sidebar";
import { useTranslationsContext } from "@/lib/i18n/TranslationsProvider";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { cx, focusRing } from "@/lib/utils";
import { RiArrowDownSFill } from "@remixicon/react";
import {
  BarChart3,
  Bot,
  Building2,
  CalendarDays,
  FileText,
  FolderSearch,
  Heart,
  LayoutDashboard,
  MessagesSquare,
  Settings,
  UserCircle,
  Video,
} from "lucide-react";

import * as React from "react";

import Image from "next/image";
import { usePathname } from "next/navigation";

import { UserProfile } from "./UserProfile";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const { locale } = useTranslationsContext();
  const isPatient = pathname.startsWith("/patient/");

  const doctornavigation = [
    { name: t("doctor.home"), icon: LayoutDashboard, root: "dashboard" },
    { name: t("doctor.messages"), icon: MessagesSquare, root: "chat" },
    { name: t("doctor.agent"), icon: Bot, root: "ai" },
  ] as const;

  const patientnavigation = [
    { name: t("patient.home"), icon: LayoutDashboard, root: "dashboard" },
    { name: t("patient.messages"), icon: MessagesSquare, root: "chat" },
    { name: t("patient.followup"), icon: Heart, root: "suivi" },
  ] as const;

  const doctornavigation2 = [
    {
      name: t("doctor.appointments"),
      icon: CalendarDays,
      root: "/appointment",
      active: false,
      children: [
        { name: t("doctor.appointmentsChildren.all"), root: "/appointment" },
        {
          name: t("doctor.appointmentsChildren.create"),
          root: "/appointment/create",
        },
        {
          name: t("doctor.appointmentsChildren.waiting"),
          root: "/appointment/waitingroom",
        },
        {
          name: t("doctor.appointmentsChildren.history"),
          root: "/appointment/history",
        },
      ],
    },
    {
      name: t("doctor.patients"),
      icon: UserCircle,
      root: "/mes-patients",
      active: false,
      children: [
        {
          name: t("doctor.patientsChildren.management"),
          root: "/mes-patients/search",
        },
        {
          name: t("doctor.patientsChildren.record"),
          root: "/mes-patients/root",
        },
      ],
    },
    {
      name: t("doctor.video"),
      icon: Video,
      root: "consultations-video",
      active: false,
      children: [
        { name: t("doctor.videoChildren.start"), root: "/visioconference/321" },
        { name: t("doctor.videoChildren.history"), root: "#" },
        { name: t("doctor.videoChildren.settings"), root: "#" },
        { name: t("doctor.videoChildren.feedback"), root: "#" },
      ],
    },
    {
      name: t("doctor.docs"),
      icon: FolderSearch,
      root: "doc-medicaux",
      active: false,
      children: [
        { name: t("doctor.docsChildren.received"), root: "#" },
        { name: t("doctor.docsChildren.sent"), root: "#" },
        { name: t("doctor.docsChildren.prescriptions"), root: "#" },
        { name: t("doctor.docsChildren.createPrescription"), root: "#" },
      ],
    },
    {
      name: t("doctor.stats"),
      icon: BarChart3,
      root: "statistiques",
      active: false,
      children: [
        { name: t("doctor.statsChildren.period"), root: "#" },
        { name: t("doctor.statsChildren.profile"), root: "#" },
        { name: t("doctor.statsChildren.feedback"), root: "#" },
        { name: t("doctor.statsChildren.revenues"), root: "#" },
      ],
    },
    {
      name: t("doctor.cabinet"),
      icon: Building2,
      root: "gestion-cabinet",
      active: false,
      children: [
        { name: t("doctor.cabinetChildren.employees"), root: "/cabinet/employees" },
        { name: t("doctor.cabinetChildren.services"), root: "/cabinet/services" },
        { name: t("doctor.cabinetChildren.departements"), root: "/cabinet/departements" },
        { name: t("doctor.cabinetChildren.roles"), root: "/cabinet/roles" },
      ],
    },
  ] as const;

  const thirdnavigation = [
    {
      name: t("doctor.settings"),
      icon: Settings,
      root: "parametres",
      active: false,
      children: [
        { name: t("doctor.settingsChildren.profile"), root: "/settings?tab=account" },
        { name: t("doctor.settingsChildren.workspace"), root: "/settings?tab=workspaces" },
        { name: t("doctor.settingsChildren.availability"), root: "/settings?tab=disponibility" },
        { name: t("doctor.settingsChildren.preferences"), root: "/settings?tab=preferences" },
        { name: t("doctor.settingsChildren.billing"), root: "/settings?tab=billing" },
      ],
    },
  ] as const;

  const patientnavigation2 = [
    {
      name: t("patient.appointments"),
      icon: CalendarDays,
      root: "/patient/appointment",
      active: false,
      children: [
        {
          name: t("patient.appointmentsChildren.book"),
          root: "/patient/appointment/book",
        },
        {
          name: t("patient.appointmentsChildren.list"),
          root: "/patient/appointment/list",
        },
        {
          name: t("patient.appointmentsChildren.history"),
          root: "/patient/appointment/history",
        },
      ],
    },
    {
      name: t("patient.dossier"),
      icon: FileText,
      root: "/patient/dossier",
      active: false,
      children: [
        {
          name: t("patient.dossierChildren.info"),
          root: "/patient/dossier/info",
        },
        {
          name: t("patient.dossierChildren.prescriptions"),
          root: "/patient/dossier/prescriptions",
        },
        {
          name: t("patient.dossierChildren.results"),
          root: "/patient/dossier/results",
        },
        {
          name: t("patient.dossierChildren.documents"),
          root: "/patient/dossier/documents",
        },
      ],
    },
    {
      name: t("patient.teleconsultation"),
      icon: Video,
      root: "/patient/teleconsultation",
      active: false,
      children: [
        {
          name: t("patient.teleconsultationChildren.join"),
          root: "/patient/teleconsultation/join",
        },
        {
          name: t("patient.teleconsultationChildren.history"),
          root: "/patient/teleconsultation/history",
        },
        {
          name: t("patient.teleconsultationChildren.test"),
          root: "/patient/teleconsultation/test",
        },
      ],
    },
    {
      name: t("patient.settings"),
      icon: Settings,
      root: "/patient/settings",
      active: false,
      children: [
        {
          name: t("patient.settingsChildren.profile"),
          root: "/patient/settings/profile",
        },
        {
          name: t("patient.settingsChildren.preferences"),
          root: "/patient/settings/preferences",
        },
        {
          name: t("patient.settingsChildren.security"),
          root: "/patient/settings/security",
        },
        {
          name: t("patient.settingsChildren.notifications"),
          root: "/patient/settings/notifications",
        },
      ],
    },
  ] as const;

  const primaryNavigation = isPatient ? patientnavigation : doctornavigation;
  const secondaryNavigation = isPatient
    ? patientnavigation2
    : doctornavigation2;

  const [openMenus, setOpenMenus] = React.useState<string[]>([
    secondaryNavigation[0].name,
  ]);

  const toggleMenu = (name: string) =>
    setOpenMenus((prev) =>
      prev.includes(name) ? [] : [name],
    );

  const generateHref = (root: string) => {
    if (!root || root.startsWith("#") || root.startsWith("http")) return root;
    const base = `/${locale}`;
    if (isPatient) {
      if (root.startsWith("/patient/")) return `${base}${root}`;
      return `${base}/patient/${root}`;
    }
    if (root.startsWith("/")) return `${base}${root}`;
    return `${base}/${root}`;
  };

  return (
    <Sidebar {...props} className="bg-gray-50 dark:bg-gray-900/25">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-[#3b82f6] p-1.5 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
            <Image
              src="/images/icon-logo.png"
              alt="INAYABRIDGE ICON"
              width={24}
              height={24}
            />
          </span>
          <div>
            <span className="block text-sm font-semibold text-gray-900 dark:text-gray-50">
              InayaBridge
            </span>
            <span className="block text-xs text-gray-900 dark:text-gray-50">
              {isPatient ? t("patientSpace") : t("doctorPlan")}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Input
              type="search"
              placeholder={t("search")}
              className="[&>input]:sm:py-1.5"
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <Divider className="my-0" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {primaryNavigation.map((item) => (
                <SidebarMenuItem key={item.root}>
                  <SidebarLink
                    icon={item.icon}
                    href={generateHref(item.root)}
                    isActive={pathname === generateHref(item.root)}
                  >
                    {item.name}
                  </SidebarLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Divider className="my-0" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {secondaryNavigation.map((item) => {
                const isOpen = openMenus.includes(item.name);
                return (
                  <SidebarMenuItem key={item.name}>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={cx(
                        "flex w-full items-center justify-between rounded-md p-2 text-base text-gray-900 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:bg-gray-900",
                        focusRing,
                      )}
                    >
                      <div className="flex items-center gap-2.5 text-sm">
                        <item.icon className="size-[18px]" aria-hidden />
                        {item.name}
                      </div>
                      <RiArrowDownSFill
                        className={cx(
                          isOpen ? "rotate-0" : "-rotate-90",
                          "size-5 transform transition-transform",
                        )}
                      />
                    </button>

                    {isOpen && (
                      <SidebarMenuSub>
                        <div className={`absolute inset-y-0 left-4 w-px`} />
                        {item.children.map((child) => {
                          const childHref = generateHref(child.root);
                          return (
                            <SidebarMenuItem key={child.root}>
                              <SidebarSubLink
                                href={childHref}
                                className={
                                  pathname === childHref
                                    ? "text-[#3b82f6] dark:text-gray-100"
                                    : ""
                                }
                              >
                                {child.name}
                              </SidebarSubLink>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Divider className="my-0" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {thirdnavigation.map((item) => {
                const isOpen = openMenus.includes(item.name);
                return (
                  <SidebarMenuItem key={item.name}>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={cx(
                        "flex w-full items-center justify-between rounded-md p-2 text-base text-gray-900 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:bg-gray-900",
                        focusRing,
                      )}
                    >
                      <div className="flex items-center gap-2.5 text-sm">
                        <item.icon className="size-[18px]" aria-hidden />
                        {item.name}
                      </div>
                      <RiArrowDownSFill
                        className={cx(
                          isOpen ? "rotate-0" : "-rotate-90",
                          "size-5 transform transition-transform",
                        )}
                      />
                    </button>

                    {isOpen && (
                      <SidebarMenuSub>
                        <div className={`absolute inset-y-0 left-4 w-px`} />
                        {item.children.map((child) => {
                          const childHref = generateHref(child.root);
                          return (
                            <SidebarMenuItem key={child.root}>
                              <SidebarSubLink
                                href={childHref}
                                className={
                                  pathname === childHref
                                    ? "text-[#3b82f6] dark:text-gray-100"
                                    : ""
                                }
                              >
                                {child.name}
                              </SidebarSubLink>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Divider className="my-0" />
      </SidebarContent>

      <SidebarFooter>
        <Divider className="my-0 mb-1" />
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}