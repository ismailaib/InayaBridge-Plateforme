"use client"
import { Divider } from "@/components/Divider"
import { Input } from "@/components/Input"
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

import {
  CalendarDays,
  BarChart3,
  Video,
  UserCircle,
  FolderSearch,
  Settings,
  MessagesSquare,
  Building2,
  LayoutDashboard,
} from "lucide-react";

import { cx, focusRing } from "@/lib/utils"
import { RiArrowDownSFill } from "@remixicon/react"
import * as React from "react"
import Image from "next/image"
import { UserProfile } from "./UserProfile"

const navigation = [
  {
    name: "Accueil",
    icon: LayoutDashboard,
    root: 'dashboard',
  },
  {
    name: "Messagerie",
    icon: MessagesSquare,
    root: 'chat',
  },
] as const

const navigation2 = [
  {
    name: "Rendez-vous",
    icon: CalendarDays,
    root: 'rendez-vous',
    active: false,
    children: [
      { name: "Tous les rendez-vous", href: "#" },
      { name: "Créer un rendez-vous", href: "#" },
      { name: "Salle d'attente", href: "#" },
      { name: "Historique des consultations", href: "#" },
    ],
  },
  {
    name: "Mes Patients",
    icon: UserCircle,
    root: 'mes-patients',
    active: false,
    children: [
      { name: "Rechercher un patient", href: "#" },
      { name: "Dossier patient", href: "#" },
      { name: "Ajouter un patient", href: "#" },
      { name: "Alertes médicales", href: "#" },
    ],
  },
  {
    name: "Consultations Vidéo",
    icon: Video,
    root: 'consultations-video',
    active: false,
    children: [
      { name: "Lancer une consultation", href: "#" },
      { name: "Historique des appels", href: "#" },
      { name: "Paramètres caméra & micro", href: "#" },
      { name: "Feedback visio", href: "#" },
    ],
  },
  {
    name: "Doc. Médicaux",
    icon: FolderSearch,
    root: 'doc-medicaux',
    active: false,
    children: [
      { name: "Reçus des patients", href: "#" },
      { name: "Envoyés aux patients", href: "#" },
      { name: "Ordonnances", href: "#" },
      { name: "Créer une ordonnance", href: "#" },
    ],
  },
  {
    name: "Statistiques",
    icon: BarChart3,
    root: 'statistiques',
    active: false,
    children: [
      { name: "Consultations par période", href: "#" },
      { name: "Profil des patients vus", href: "#" },
      { name: "Satisfaction / feedback", href: "#" },
      { name: "Rendement / revenus", href: "#" },
    ],
  },
  {
    name: "Paramètres",
    icon: Settings,
    root: 'parametres',
    active: false,
    children: [
      { name: "Mes informations", href: "#" },
      { name: "Disponibilité / calendrier", href: "#" },
      { name: "Mot de passe / sécurité", href: "#" },
      { name: "Pièces justificatives", href: "#" },
      { name: "Préférences", href: "#" },
    ],
  },
  {
    name: "Gestion Cabinet",
    icon: Building2,
    root: 'gestion-cabinet',
    active: false,
    children: [
      { name: "Liste des employés", href: "#" },
      { name: "Matériel médical", href: "#" },
      { name: "Gestion des stocks", href: "#" },
      { name: "Salle de consultation", href: "#" },
    ],
  },
] as const

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [openMenus, setOpenMenus] = React.useState<string[]>([
    navigation2[0].name,
    navigation2[1].name,
  ])
  const toggleMenu = (name: string) => {
    setOpenMenus((prev: string[]) =>
      prev.includes(name)
        ? prev.filter((item: string) => item !== name)
        : [...prev, name],
    )
  }
  return (
    <Sidebar {...props} className="bg-gray-50 dark:bg-gray-900/25">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-[#00b38f] p-1.5 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
            <Image src="/images/icon-logo.png" alt="INAYABRIDGE ICON" width={24} height={24} />
          </span>
          <div>
            <span className="block text-sm font-semibold text-gray-900 dark:text-gray-50">
              InnayaBridge
            </span>
            <span className="block text-xs text-gray-900 dark:text-gray-50">
              Plan Essentiel
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="Sidebar_parent">
        <SidebarGroup>
          <SidebarGroupContent>
            <Input
              type="search"
              placeholder="Search items..."
              className="[&>input]:sm:py-1.5"
            />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="pt-0">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                    <SidebarLink
                    href={`/${item.root}`}
                    isActive={window.location.pathname === `/${item.root}`}
                    icon={item.icon}
                    // notifications={item.notifications}
                    >
                    {item.name}
                    </SidebarLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="px-3">
          <Divider className="my-0 py-0" />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {navigation2.map((item) => (
                <SidebarMenuItem key={item.name}>
                  {/* @CHRIS/SEV: discussion whether to componentize (-> state mgmt) */}
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={cx(
                      "flex w-full items-center justify-between gap-x-2.5 rounded-md p-2 text-base text-gray-900 transition hover:bg-gray-200/50 sm:text-sm dark:text-gray-400 hover:dark:bg-gray-900 hover:dark:text-gray-50",
                      focusRing,
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon
                        className="size-[18px] shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </div>
                    <RiArrowDownSFill
                      className={cx(
                        openMenus.includes(item.name)
                          ? "rotate-0"
                          : "-rotate-90",
                        "size-5 shrink-0 transform text-gray-400 transition-transform duration-150 ease-in-out dark:text-gray-600",
                      )}
                      aria-hidden="true"
                    />
                  </button>
                  {item.children && openMenus.includes(item.name) && (
                    <SidebarMenuSub>
                      <div className="absolute inset-y-0 left-4 w-px bg-gray-300 dark:bg-gray-800" />
                      {item.children.map((child) => (
                        <SidebarMenuItem key={child.name}>
                          <SidebarSubLink
                            href={child.href}
                            // isActive={child.active}
                          >
                            {child.name}
                          </SidebarSubLink>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="border-t border-gray-200 dark:border-gray-800" />
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  )
}
