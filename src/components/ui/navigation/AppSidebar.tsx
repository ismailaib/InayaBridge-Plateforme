"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { RiArrowDownSFill } from "@remixicon/react"
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
} from "@/components/Sidebar"
import { Divider } from "@/components/Divider"
import { Input } from "@/components/Input"
import { UserProfile } from "./UserProfile"
import {
  LayoutDashboard,
  MessagesSquare,
  CalendarDays,
  UserCircle,
  Video,
  FolderSearch,
  BarChart3,
  Settings,
  Building2,
  Bot,
  Heart,
  FileText,
} from "lucide-react"
import { cx, focusRing } from "@/lib/utils"

import Image from "next/image"

const doctornavigation = [
  { name: "Accueil", icon: LayoutDashboard, root: "dashboard" },
  { name: "Messagerie", icon: MessagesSquare, root: "chat" },
  { name: "Mon Agent", icon: Bot, root: "ai" },
] as const

const patientnavigation = [
  { name: "Accueil", icon: LayoutDashboard, root: "dashboard" },
  { name: "Messagerie", icon: MessagesSquare, root: "chat" },
  { name: "Mon Suivi", icon: Heart, root: "suivi" },
] as const

const doctornavigation2 = [
  {
    name: "Rendez-vous",
    icon: CalendarDays,
    root: "/appointment",
    active: false,
    children: [
      { name: "Tous les rendez-vous", root: "/appointment" },
      { name: "Créer un rendez-vous", root: "/appointment/create" },
      { name: "Salle d'attente", root: "/appointment/waitingroom" },
      { name: "Historique des consultations", root: "/appointment/history" },
    ],
  },
  {
    name: "Mes Patients",
    icon: UserCircle,
    root: "/mes-patients",
    active: false,
    children: [
      { name: "Gestion des patients", root: "/mes-patients/search" },
      { name: "Dossier patient", root: "/mes-patients/root" },
    ],
  },
  {
    name: "Consultations Vidéo",
    icon: Video,
    root: "consultations-video",
    active: false,
    children: [
      { name: "Lancer une consultation", root: "/visioconference/321" },
      { name: "Historique des appels", root: "#" },
      { name: "Paramètres caméra & micro", root: "#" },
      { name: "Feedback visio", root: "#" },
    ],
  },
  {
    name: "Doc. Médicaux",
    icon: FolderSearch,
    root: "doc-medicaux",
    active: false,
    children: [
      { name: "Reçus des patients", root: "#" },
      { name: "Envoyés aux patients", root: "#" },
      { name: "Ordonnances", root: "#" },
      { name: "Créer une ordonnance", root: "#" },
    ],
  },
  {
    name: "Statistiques",
    icon: BarChart3,
    root: "statistiques",
    active: false,
    children: [
      { name: "Consultations par période", root: "#" },
      { name: "Profil des patients vus", root: "#" },
      { name: "Satisfaction / feedback", root: "#" },
      { name: "Rendement / revenus", root: "#" },
    ],
  },
  {
    name: "Paramètres",
    icon: Settings,
    root: "parametres",
    active: false,
    children: [
      { name: "Mes informations", root: "#" },
      { name: "Disponibilité / calendrier", root: "#" },
      { name: "Mot de passe / sécurité", root: "#" },
      { name: "Pièces justificatives", root: "#" },
      { name: "Préférences", root: "#" },
    ],
  },
  {
    name: "Gestion Cabinet",
    icon: Building2,
    root: "gestion-cabinet",
    active: false,
    children: [
      { name: "Liste des employés", root: "#" },
      { name: "Matériel médical", root: "#" },
      { name: "Gestion des stocks", root: "#" },
      { name: "Salle de consultation", root: "#" },
    ],
  },
] as const

const patientnavigation2 = [
  {
    name: "Mes Rendez-vous",
    icon: CalendarDays,
    root: "/patient/appointment",
    active: false,
    children: [
      { name: "Prendre un rendez-vous", root: "/patient/appointment/book" },
      { name: "Mes rendez-vous", root: "/patient/appointment/list" },
      { name: "Historique", root: "/patient/appointment/history" },
    ],
  },
  {
    name: "Mon Dossier Médical",
    icon: FileText,
    root: "/patient/dossier",
    active: false,
    children: [
      { name: "Mes informations", root: "/patient/dossier/info" },
      { name: "Mes ordonnances", root: "/patient/dossier/prescriptions" },
      { name: "Mes résultats", root: "/patient/dossier/results" },
      { name: "Mes documents", root: "/patient/dossier/documents" },
    ],
  },
  {
    name: "Téléconsultations",
    icon: Video,
    root: "/patient/teleconsultation",
    active: false,
    children: [
      { name: "Rejoindre une consultation", root: "/patient/teleconsultation/join" },
      { name: "Historique des appels", root: "/patient/teleconsultation/history" },
      { name: "Test audio/vidéo", root: "/patient/teleconsultation/test" },
    ],
  },
  {
    name: "Paramètres",
    icon: Settings,
    root: "/patient/settings",
    active: false,
    children: [
      { name: "Mes informations", root: "/patient/settings/profile" },
      { name: "Préférences", root: "/patient/settings/preferences" },
      { name: "Sécurité", root: "/patient/settings/security" },
      { name: "Notifications", root: "/patient/settings/notifications" },
    ],
  },
] as const

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  
  // Check if user is a patient based on URL
  const isPatient = pathname.startsWith('/patient/')
  
  // Select navigation based on user type
  const primaryNavigation = isPatient ? patientnavigation : doctornavigation
  const secondaryNavigation = isPatient ? patientnavigation2 : doctornavigation2
  
  const [openMenus, setOpenMenus] = React.useState<string[]>([
    secondaryNavigation[0].name,
  ])
  
  const toggleMenu = (name: string) =>
    setOpenMenus((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name],
    )

  // Helper function to generate href based on user type
  const generateHref = (root: string) => {
    if (isPatient) {
      // For patient routes, ensure we maintain the /patient prefix
      if (root.startsWith('/patient/')) {
        return root
      }
      return `/patient/${root}`
    } else {
      // For doctor routes, use the root as is
      if (root.startsWith('/')) {
        return root
      }
      return `/${root}`
    }
  }

  return (
    <Sidebar {...props} className="bg-gray-50 dark:bg-gray-900/25">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-[#00b38f] p-1.5 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
            <Image
              src="/images/icon-logo.png"
              alt="INAYABRIDGE ICON"
              width={24}
              height={24}
            />
          </span>
          <div>
            <span className="block text-sm font-semibold text-gray-900 dark:text-gray-50">
              InnayaBridge
            </span>
            <span className="block text-xs text-gray-900 dark:text-gray-50">
              {isPatient ? "Espace Patient" : "Plan Essentiel"}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Input
              type="search"
              placeholder="Search items…"
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
                const isOpen = openMenus.includes(item.name)
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
                        {item.children.map((child) => (
                          <SidebarMenuItem key={child.name}>
                            <SidebarSubLink
                              href={child.root}
                              className={
                                pathname === child.root
                                  ? "text-[#00b38f] dark:text-gray-100"
                                  : ""
                              }
                            >
                              {child.name}
                            </SidebarSubLink>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Divider className="my-0" />
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  )
}