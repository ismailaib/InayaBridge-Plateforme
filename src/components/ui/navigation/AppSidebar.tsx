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
  PillBottle,
  Settings,
  UserCircle,
  Video,
} from "lucide-react";
import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserProfile } from "./UserProfile";

// --- IMPORT NEW API ---
// Make sure this path matches where you saved the code you provided
import { getRolesByTenant, Role } from "@/api/roles";

// 1. Interface for Navigation Items
interface NavItem {
  name: string;
  icon?: any;
  root: string;
  permission?: string;
  active?: boolean;
  children?: NavItem[];
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const { locale } = useTranslationsContext();
  const isPatient = pathname.startsWith("/patient/");

  // 2. STATE
  const [userPermissions, setUserPermissions] = React.useState<string[]>([]);
  const [isMounted, setIsMounted] = React.useState(false);

  // 3. EFFECT: Load User & Fetch Specific Role Permissions
  React.useEffect(() => {
    setIsMounted(true);

    const fetchPermissions = async () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);

          if (user.doctorProfile && user.doctorProfile.tenantId) {
            const tenantId = user.doctorProfile.tenantId;
            const roleTitle = user.doctorProfile.roleTitle; // e.g. "Admin" or "Doctor"

            // FAST PATH: If the role title itself is "Admin", we can skip fetching (optional)
            // OR we fetch to be safe but handle the wildcard logic below.

            try {
              const response = await getRolesByTenant(tenantId);
              const roles: Role[] = Array.isArray(response) ? response : (response as any).data || [];

              const myRole = roles.find((r) => r.name === roleTitle);

              if (myRole) {
                console.log(`Permissions loaded for role [${roleTitle}]:`, myRole.permissions);

                // CHECK: Does this role have the wildcard "*"?
                // OR is the name explicitly "Admin"?
                if (myRole.name === "Admin" || myRole.permissions.includes("*")) {
                  setUserPermissions(["*"]); // Set a special wildcard flag
                } else {
                  setUserPermissions(myRole.permissions);
                }
              } else {
                // Fallback: If user says they are "Admin" but role not found in DB, 
                // you might want to grant access or deny. 
                // Safest is to check strictly:
                if (roleTitle === "Admin") {
                  setUserPermissions(["*"]);
                } else {
                  console.warn(`Role "${roleTitle}" not found.`);
                  setUserPermissions([]);
                }
              }

            } catch (apiError) {
              console.error("Failed to fetch tenant roles:", apiError);
              // Emergency fallback if API fails but user is clearly Admin in local storage
              if (roleTitle === "Admin") {
                setUserPermissions(["*"]);
              } else {
                setUserPermissions([]);
              }
            }
          } else {
            setUserPermissions([]);
          }
        } catch (error) {
          console.error("Error parsing user context:", error);
        }
      }
    };

    fetchPermissions();
  }, []);


  // --- NAVIGATION CONFIGURATION (Same structure) ---
  const doctornavigation: NavItem[] = [
    { name: t("doctor.home"), icon: LayoutDashboard, root: "dashboard", permission: "dashboard.view" },
    { name: t("doctor.messages"), icon: MessagesSquare, root: "chat", permission: "chat.view" },
    { name: t("doctor.agent"), icon: Bot, root: "ai", permission: "ai_agent.view" },
  ];

  const doctornavigation2: NavItem[] = [
    {
      name: t("doctor.appointments"),
      icon: CalendarDays,
      root: "/appointment",
      permission: "appointments.view",
      children: [
        { name: t("doctor.appointmentsChildren.all"), root: "/appointment", permission: "appointments.view" },
        { name: t("doctor.appointmentsChildren.create"), root: "/appointment/create", permission: "appointments.create" },
        { name: t("doctor.appointmentsChildren.waiting"), root: "/appointment/waitingroom", permission: "appointments.manage_flow" },
        { name: t("doctor.appointmentsChildren.history"), root: "/appointment/history", permission: "appointments.view" },
        { name: t("doctor.appointmentsChildren.flow"), root: "/appointment/flow-edit", permission: "appointments.manage_flow" },
      ],
    },
    {
      name: t("doctor.patients"),
      icon: UserCircle,
      root: "/mes-patients",
      permission: "patients.view",
      children: [
        { name: t("doctor.patientsChildren.management"), root: "/mes-patients/search", permission: "patients.view" },
        { name: t("doctor.patientsChildren.record"), root: "/mes-patients/root", permission: "patients.view_record" },
      ],
    },
    {
      name: t("doctor.video"),
      icon: Video,
      root: "consultations-video",
      permission: "video.view",
      children: [
        { name: t("doctor.videoChildren.start"), root: "/visioconference", permission: "video.start" },
        { name: t("doctor.videoChildren.history"), root: "/visioconference/history", permission: "video.view" },
      ],
    },
    {
      name: t("doctor.docs"),
      icon: FolderSearch,
      root: "doc-medicaux",
      permission: "documents.view",
      children: [
        { name: t("doctor.docsChildren.received"), root: "#", permission: "documents.view" },
        { name: t("doctor.docsChildren.sent"), root: "#", permission: "documents.view" },
        { name: t("doctor.docsChildren.prescriptions"), root: "#", permission: "documents.view" },
        { name: t("doctor.docsChildren.createPrescription"), root: "#", permission: "documents.create" },
      ],
    },
    {
      name: t("doctor.stats"),
      icon: BarChart3,
      root: "statistiques",
      permission: "stats.view",
      children: [
        { name: t("doctor.statsChildren.period"), root: "#", permission: "stats.view" },
        { name: t("doctor.statsChildren.profile"), root: "#", permission: "stats.view" },
        { name: t("doctor.statsChildren.feedback"), root: "#", permission: "stats.view" },
        { name: t("doctor.statsChildren.revenues"), root: "#", permission: "stats.view" },
      ],
    },
    {
      name: "Pharmacie",
      icon: PillBottle,
      root: "pharmacie-gestion",
      permission: "pharmacy.view",
      children: [
        { name: "Gestion des Medicaments", root: "/pharmacy", permission: "pharmacy.view" },
        { name: "Gestion des Categories", root: "/pharmacy/categories", permission: "pharmacy.manage" },
      ],
    },
    {
      name: t("doctor.cabinet"),
      icon: Building2,
      root: "gestion-cabinet",
      permission: "cabinet.view",
      children: [
        { name: t("doctor.cabinetChildren.employees"), root: "/cabinet/employees", permission: "employees.view" },
        { name: t("doctor.cabinetChildren.services"), root: "/cabinet/services", permission: "cabinet.manage_services" },
        { name: t("doctor.cabinetChildren.departements"), root: "/cabinet/departements", permission: "cabinet.manage_dept" },
        { name: t("doctor.cabinetChildren.roles"), root: "/cabinet/roles", permission: "roles.manage" },
      ],
    },
  ];

  const thirdnavigation: NavItem[] = [
    {
      name: t("doctor.settings"),
      icon: Settings,
      root: "parametres",
      permission: "settings.view",
      children: [
        { name: t("doctor.settingsChildren.profile"), root: "/settings?tab=account", permission: "settings.view" },
        { name: t("doctor.settingsChildren.workspace"), root: "/settings?tab=workspaces", permission: "settings.view" },
        { name: t("doctor.settingsChildren.availability"), root: "/settings?tab=disponibility", permission: "settings.manage" },
        { name: t("doctor.settingsChildren.preferences"), root: "/settings?tab=preferences", permission: "settings.view" },
        { name: t("doctor.settingsChildren.billing"), root: "/settings?tab=billing", permission: "billing.view" },
      ],
    },
  ];

  const patientnavigation: NavItem[] = [
    { name: t("patient.home"), icon: LayoutDashboard, root: "dashboard" },
    { name: t("patient.messages"), icon: MessagesSquare, root: "chat" },
    { name: t("patient.followup"), icon: Heart, root: "suivi" },
  ];

  const patientnavigation2: NavItem[] = [
    {
      name: t("patient.appointments"),
      icon: CalendarDays,
      root: "/patient/appointment",
      children: [
        { name: t("patient.appointmentsChildren.book"), root: "/patient/appointment/book" },
        { name: t("patient.appointmentsChildren.list"), root: "/patient/appointment/list" },
        { name: t("patient.appointmentsChildren.history"), root: "/patient/appointment/history" },
      ],
    },
    {
      name: t("patient.dossier"),
      icon: FileText,
      root: "/patient/dossier",
      children: [
        { name: t("patient.dossierChildren.info"), root: "/patient/dossier/info" },
        { name: t("patient.dossierChildren.prescriptions"), root: "/patient/dossier/prescriptions" },
        { name: t("patient.dossierChildren.results"), root: "/patient/dossier/results" },
        { name: t("patient.dossierChildren.documents"), root: "/patient/dossier/documents" },
      ],
    },
    {
      name: t("patient.teleconsultation"),
      icon: Video,
      root: "/patient/teleconsultation",
      children: [
        { name: t("patient.teleconsultationChildren.join"), root: "/patient/teleconsultation/join" },
        { name: t("patient.teleconsultationChildren.history"), root: "/patient/teleconsultation/history" },
        { name: t("patient.teleconsultationChildren.test"), root: "/patient/teleconsultation/test" },
      ],
    },
    {
      name: t("patient.settings"),
      icon: Settings,
      root: "/patient/settings",
      children: [
        { name: t("patient.settingsChildren.profile"), root: "/patient/settings/profile" },
        { name: t("patient.settingsChildren.preferences"), root: "/patient/settings/preferences" },
        { name: t("patient.settingsChildren.security"), root: "/patient/settings/security" },
        { name: t("patient.settingsChildren.notifications"), root: "/patient/settings/notifications" },
      ],
    },
  ];


  // --- 4. FILTER LOGIC (Standard Comparison) ---
  const hasPermission = (requiredPerm?: string) => {
    // 1. If route is public (no permission required), allow it
    if (!requiredPerm) return true;

    // 2. SUPER ADMIN CHECK: If user has "*", they can see EVERYTHING
    if (userPermissions.includes("*")) return true;

    // 3. Standard check
    return userPermissions.includes(requiredPerm);
  };

  const filterNavigation = (items: NavItem[]): NavItem[] => {
    return items
      .filter((item) => hasPermission(item.permission))
      .map((item) => {
        if (item.children) {
          return { ...item, children: filterNavigation(item.children) };
        }
        return item;
      })
      .filter((item) => {
        // Hide empty folders (unless they are links themselves)
        if (item.children && item.children.length === 0 && item.root === "#") {
          return false;
        }
        return true;
      });
  };

  // --- 5. RENDER PREPARATION ---
  const primaryNavigation = !isMounted
    ? []
    : isPatient
      ? patientnavigation
      : filterNavigation(doctornavigation);

  const secondaryNavigation = !isMounted
    ? []
    : isPatient
      ? patientnavigation2
      : filterNavigation(doctornavigation2);

  const thirdNavigationFiltered = !isMounted
    ? []
    : isPatient
      ? []
      : filterNavigation(thirdnavigation);

  const [openMenus, setOpenMenus] = React.useState<string[]>([]);

  // Initialize open menu
  React.useEffect(() => {
    if (secondaryNavigation.length > 0 && openMenus.length === 0) {
      setOpenMenus([secondaryNavigation[0].name]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

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

                if (!item.children || item.children.length === 0) {
                  return (
                    <SidebarMenuItem key={item.root}>
                      <SidebarLink
                        icon={item.icon}
                        href={generateHref(item.root)}
                        isActive={pathname === generateHref(item.root)}
                      >
                        {item.name}
                      </SidebarLink>
                    </SidebarMenuItem>
                  );
                }

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
              {thirdNavigationFiltered.map((item) => {
                const isOpen = openMenus.includes(item.name);
                if (!item.children || item.children.length === 0) {
                  return (
                    <SidebarMenuItem key={item.root}>
                      <SidebarLink
                        icon={item.icon}
                        href={generateHref(item.root)}
                        isActive={pathname === generateHref(item.root)}
                      >
                        {item.name}
                      </SidebarLink>
                    </SidebarMenuItem>
                  );
                }
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