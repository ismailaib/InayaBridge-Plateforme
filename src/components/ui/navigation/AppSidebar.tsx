"use client"

import * as React from "react"
import Link from "next/link"
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
} from "lucide-react"
import { cx, focusRing } from "@/lib/utils"

import Image from "next/image"

const navigation = [
  { name: "Accueil", icon: LayoutDashboard, root: "dashboard" },
  { name: "Messagerie", icon: MessagesSquare, root: "chat" },
] as const

const navigation2 = [
  {
    name: "Rendez-vous",
    icon: CalendarDays,
    root: "rendez-vous",
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
    root: "mes-patients",
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
    root: "consultations-video",
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
    root: "doc-medicaux",
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
    root: "statistiques",
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
    root: "parametres",
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
    root: "gestion-cabinet",
    active: false,
    children: [
      { name: "Liste des employés", href: "#" },
      { name: "Matériel médical", href: "#" },
      { name: "Gestion des stocks", href: "#" },
      { name: "Salle de consultation", href: "#" },
    ],
  },
] as const

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = React.useState<string[]>([
    navigation2[0].name,
    navigation2[1].name,
  ])
  const toggleMenu = (name: string) =>
    setOpenMenus((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    )

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
              Plan Essentiel
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Input type="search" placeholder="Search items…" className="[&>input]:sm:py-1.5" />
          </SidebarGroupContent>
        </SidebarGroup>

        <Divider className="my-0" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.root}>
                  <Link href={`/${item.root}`}>
                    <SidebarLink
                      icon={item.icon}
                      isActive={pathname === `/${item.root}`}
                    >
                      {item.name}
                    </SidebarLink>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Divider className="my-0" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation2.map((item) => {
                const isOpen = openMenus.includes(item.name)
                return (
                  <SidebarMenuItem key={item.name}>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={cx(
                        "flex w-full items-center justify-between p-2 rounded-md text-base text-gray-900 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:bg-gray-900",
                        focusRing
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="size-[18px]" aria-hidden />
                        {item.name}
                      </div>
                      <RiArrowDownSFill
                        className={cx(
                          isOpen ? "rotate-0" : "-rotate-90",
                          "size-5 transform transition-transform"
                        )}
                      />
                    </button>

                    {isOpen && (
                      <SidebarMenuSub>
                        <div className="absolute inset-y-0 left-4 w-px bg-gray-300 dark:bg-gray-800" />
                        {item.children.map((child) => (
                          <SidebarMenuItem key={child.name}>
                            <SidebarSubLink href={child.href}>
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
