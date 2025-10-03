"use client";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Checkbox } from "@/components/Checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import { Divider } from "@/components/Divider";
import { Label } from "@/components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { Switch } from "@/components/Switch";
import { MonitorCog } from "lucide-react";

import React, { useState } from "react";

const moduleList = [
  { key: "showDiagnostics", label: "Diagnostics" },
  { key: "showFollowUps", label: "Consultations de suivi" },
  { key: "showAdvancedStats", label: "Statistiques avancées" },
  { key: "showEvolutionCharts", label: "Graphiques d’évolution" },
  { key: "showPatientAlerts", label: "Alertes patients" },
  { key: "showVideoCalls", label: "Consultations vidéo" },
  { key: "showVitalsMonitoring", label: "Suivi des signes vitaux" },
  { key: "showAppointments", label: "Planning des rendez-vous" },
  { key: "showLabResults", label: "Résultats de laboratoire" },
  { key: "showPrescriptions", label: "Ordonnances" },
];

export const DashboardModal = () => {
  const [settings, setSettings] = useState(
    Object.fromEntries(moduleList.map(({ key }) => [key, true])),
  );

  const [otherSettings, setOtherSettings] = useState({
    notifications: true,
    compactMode: false,
    specialty: "généraliste",
    language: "fr",
  });

  const toggleModule = (key: string) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const updateSelect = (key: keyof typeof otherSettings, value: string) =>
    setOtherSettings((prev) => ({ ...prev, [key]: value }));

  const toggleSwitch = (key: keyof typeof otherSettings) =>
    setOtherSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="py-1.5">
            <MonitorCog
              width={18}
              className="text-slate-800 dark:text-gray-200"
            />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-3xl">
          <DialogHeader>
            <DialogTitle>Paramètres du tableau de bord</DialogTitle>
            <DialogDescription className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Personnalisez les sections de votre interface en activant les
              modules que vous souhaitez visualiser.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Section 1: Affichage modules */}
            <Card className="space-y-4 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                Modules disponibles
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

            {/* Section 2: Autres préférences */}
            <Card className="space-y-4 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                Préférences personnelles
              </h3>

              <div className="space-y-2">
                <Label htmlFor="specialty">Spécialité</Label>
                <Select
                  value={otherSettings.specialty}
                  onValueChange={(v) => updateSelect("specialty", v)}
                  disabled
                >
                  <SelectTrigger className="cursor-not-allowed opacity-70">
                    <SelectValue placeholder="Votre spécialité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="généraliste">
                      Médecin généraliste
                    </SelectItem>
                    <SelectItem value="cardiologue">Cardiologue</SelectItem>
                    <SelectItem value="pédiatre">Pédiatre</SelectItem>
                    <SelectItem value="dentiste">Dentiste</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400 mt-1">
                  Ce champ est modifiable uniquement par un administrateur.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select
                  value={otherSettings.language}
                  onValueChange={(v) => updateSelect("language", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une langue" />
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
                <Label htmlFor="notifications">Notifications</Label>
                <Switch
                  id="notifications"
                  checked={otherSettings.notifications}
                  onCheckedChange={() => toggleSwitch("notifications")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="compactMode">Mode compact</Label>
                <Switch
                  id="compactMode"
                  checked={otherSettings.compactMode}
                  onCheckedChange={() => toggleSwitch("compactMode")}
                />
              </div>
            </Card>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="secondary">Annuler</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>Enregistrer</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
