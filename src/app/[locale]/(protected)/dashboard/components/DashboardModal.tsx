"use client"

import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog"
import { MonitorCog } from "lucide-react"
import { Checkbox } from "@/components/Checkbox"
import { Label } from "@/components/Label"
import { Switch } from "@/components/Switch"
import { Card } from "@/components/Card"
import { Divider } from "@/components/Divider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { useTranslations } from "@/lib/i18n/useTranslations"

export const DashboardModal = () => {
  const t = useTranslations("dashboard.dashboardSettings")
  const router = useRouter()
  const pathname = usePathname()
  const initialLocale = pathname.split("/")[1] || "fr"

  const moduleList = Object.entries(t.raw("modulesList") || {}).map(
    ([key, label]) => ({ key, label: label as string })
  )

  const [settings, setSettings] = useState(
    Object.fromEntries(moduleList.map(({ key }) => [key, true]))
  )

  const [otherSettings, setOtherSettings] = useState({
    notifications: true,
    compactMode: false,
    specialty: "généraliste",
    language: initialLocale,
  })

  useEffect(() => {
    const currentLocale = pathname.split("/")[1]
    if (currentLocale && currentLocale !== otherSettings.language) {
      setOtherSettings((prev) => ({ ...prev, language: currentLocale }))
    }
  }, [pathname])

  const toggleModule = (key: string) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))

  const updateSelect = (key: keyof typeof otherSettings, value: string) => {
    setOtherSettings((prev) => ({ ...prev, [key]: value }))
    if (key === "language") {
      const parts = pathname.split("/")
      parts[1] = value
      const newPath = parts.join("/") || `/${value}/dashboard`
      router.push(newPath)
    }
  }

  const toggleSwitch = (key: keyof typeof otherSettings) =>
    setOtherSettings((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="flex justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="py-1.5">
            <MonitorCog width={18} className="text-slate-800 dark:text-gray-200" />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("description")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Modules */}
            <Card className="space-y-4 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                {t("modules")}
              </h3>
              {moduleList.map((mod) => (
                <div key={mod.key} className="flex items-center gap-2">
                  <Checkbox
                    id={mod.key}
                    checked={settings[mod.key]}
                    onCheckedChange={() => toggleModule(mod.key)}
                  />
                  <Label htmlFor={mod.key}>{mod.label}</Label>
                </div>
              ))}
            </Card>

            {/* Preferences */}
            <Card className="space-y-4 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                {t("preferences")}
              </h3>

              <div className="space-y-2">
                <Label htmlFor="specialty">{t("specialty")}</Label>
                <Select
                  value={otherSettings.specialty}
                  onValueChange={(v) => updateSelect("specialty", v)}
                  disabled
                >
                  <SelectTrigger className="cursor-not-allowed opacity-70">
                    <SelectValue placeholder={t("specialty")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="généraliste">
                      {t("specialties.general")}
                    </SelectItem>
                    <SelectItem value="cardiologue">
                      {t("specialties.cardio")}
                    </SelectItem>
                    <SelectItem value="pédiatre">
                      {t("specialties.pediatre")}
                    </SelectItem>
                    <SelectItem value="dentiste">
                      {t("specialties.dentist")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400 mt-1">{t("specialtyNote")}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">{t("language")}</Label>
                <Select
                  value={otherSettings.language}
                  onValueChange={(v) => updateSelect("language", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("language")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Divider />

              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">{t("notifications")}</Label>
                <Switch
                  id="notifications"
                  checked={otherSettings.notifications}
                  onCheckedChange={() => toggleSwitch("notifications")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="compactMode">{t("compactMode")}</Label>
                <Switch
                  id="compactMode"
                  checked={otherSettings.compactMode}
                  onCheckedChange={() => toggleSwitch("compactMode")}
                />
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
