"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/Button";
import { Divider } from "@/components/Divider";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/Select";
import { DatePicker } from "@/components/DatePicker";
import {
  RadioCardGroup,
  RadioCardIndicator,
  RadioCardItem,
} from "@/components/RadioCardGroup";
import { Search } from "lucide-react";
import { Switch } from "@/components/Switch";
import { createAppointment } from "../api/appointment";
import { getDoctorPatients, Patient } from "../../mes-patients/api/patients";

export default function RendezVousForm() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [_, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDoctorPatients()
      .then((res) => setPatients(res.data))
      .catch((err) => console.error("Failed to fetch patients", err))
      .finally(() => setLoading(false));
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [value, setValue] = useState<Date | undefined>(undefined);
  const [selectOpen, setSelectOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [isUrgent, setUrgent] = useState(false);
  const [cost, setCost] = useState<number | undefined>();
  const [motif, setMotif] = useState("");
  const [note, setNote] = useState("");
  const [locationValue, setLocationValue] = useState<string | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPatients(patients.slice(0, 10));
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = patients.filter(
      (p) =>
        p?.first_name?.toLowerCase().includes(query) ||
        p?.last_name?.toLowerCase().includes(query)
    );
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (selectOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [selectOpen]);

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(Number(patientId));
    setSelectOpen(false);
    setSearchQuery("");
  };

  type ConsultationType = "local" | "in-person" | "video";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !value || !motif || !locationValue || cost === undefined) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const consultationType: ConsultationType =
      locationValue === "1"
        ? "local"
        : locationValue === "2"
        ? "in-person"
        : "video";

    const payload = {
      patientId: selectedPatientId,
      date: value.toISOString().split("T")[0],
      startTime: value.toTimeString().slice(0, 5),
      status: "pending",
      consultationType,
      motif,
      cost,
      note,
    };

    try {
      await createAppointment(payload);
      alert("Rendez-vous créé avec succès !");
      // Reset form if needed
    } catch (err) {
      console.error("Erreur lors de la création :", err);
      alert("Erreur lors de la création du rendez-vous.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
        Créer un rendez-vous
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Sélectionnez un patient existant ou ajoutez-en un nouveau.
      </p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
          <div className="col-span-3 sm:col-span-2">
            <Label htmlFor="patient" className="font-medium">
              Patient<span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-2">
              <Select
                value={selectedPatientId !== null ? String(selectedPatientId) : undefined}
                onValueChange={handlePatientSelect}
                open={selectOpen}
                onOpenChange={setSelectOpen}
              >
                <SelectTrigger id="patient" name="patient">
                  <SelectValue placeholder="Sélectionner un patient" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-auto">
                  <div className="sticky top-0 z-10 bg-white p-2 dark:bg-gray-800">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        ref={searchInputRef}
                        placeholder="Rechercher un patient..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        className="pl-8 text-sm"
                        autoComplete="off"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                            e.stopPropagation();
                          }
                        }}
                      />
                    </div>
                  </div>
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((p) => (
                      <SelectItem
                        key={p.id}
                        value={String(p.id)}
                        className="cursor-pointer px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {p.first_name} {p.last_name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-2 text-sm text-gray-500">
                      Aucun patient trouvé
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="col-span-full sm:col-span-2">
            <Label htmlFor="date" className="font-medium">
              Date<span className="text-red-500">*</span>
            </Label>
            <DatePicker
              className="mt-2"
              showTimePicker
              value={value}
              onChange={(val) => setValue(val)}
            />
          </div>

          <div className="col-span-full sm:col-span-2">
            <Label htmlFor="cost" className="font-medium">
              Coût<span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              id="cost"
              name="cost"
              min={0}
              placeholder="Ex. 250 DH"
              className="mt-2"
              onChange={(e) => setCost(Number(e.target.value))}
            />
          </div>

          <div className="col-span-full sm:col-span-3">
            <Label htmlFor="motif" className="font-medium">
              Motif<span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="motif"
              name="motif"
              placeholder="Ex. Bilan sanguin"
              className="mt-2"
              onChange={(e) => setMotif(e.target.value)}
            />
          </div>

          <div className="col-span-full sm:col-span-3">
            <Label htmlFor="note" className="font-medium">
              Note
            </Label>
            <Input
              type="text"
              id="note"
              name="note"
              placeholder="Ex. Note"
              className="mt-2"
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="col-span-full sm:col-span-6">
            <Label htmlFor="lieu" className="font-medium">
              Lieu<span className="text-red-500">*</span>
            </Label>
            <RadioCardGroup
              className="mt-2 flex flex-wrap gap-4"
              value={locationValue ?? undefined}
              onValueChange={setLocationValue}
            >
              <RadioCardItem value="1" className="min-w-48 flex-1">
                <div className="flex items-start gap-3">
                  <RadioCardIndicator className="mt-1" />
                  <div>
                    <span className="sm:text-sm">Cabinet principal</span>
                    <p className="mt-1 text-xs text-gray-500">
                      Situé au centre-ville, équipé pour tous les examens médicaux courants.
                    </p>
                  </div>
                </div>
              </RadioCardItem>
              <RadioCardItem value="2" className="min-w-48 flex-1">
                <div className="flex items-start gap-3">
                  <RadioCardIndicator className="mt-1" />
                  <div>
                    <span className="sm:text-sm">À domicile</span>
                    <p className="mt-1 text-xs text-gray-500">
                      Consultation réalisée au domicile du patient.
                    </p>
                  </div>
                </div>
              </RadioCardItem>
              <RadioCardItem value="3" className="min-w-48 flex-1">
                <div className="flex items-start gap-3">
                  <RadioCardIndicator className="mt-1" />
                  <div>
                    <span className="sm:text-sm">Télécommunication</span>
                    <p className="mt-1 text-xs text-gray-500">
                      Rendez-vous à distance par appel vidéo ou téléphonique.
                    </p>
                  </div>
                </div>
              </RadioCardItem>
            </RadioCardGroup>
          </div>
        </div>

        <Divider />

        {value && value.toDateString() === new Date().toDateString() && (
          <>
            <div className="flex items-center gap-3">
              <Switch id="a" checked={checked} onCheckedChange={setChecked} />
              <Label htmlFor="a">Ajouter à la salle d&apos;attente</Label>
            </div>
            <Divider />
          </>
        )}

        <div className="flex items-center gap-3">
          <Switch id="b" checked={isUrgent} onCheckedChange={setUrgent} />
          <Label htmlFor="b">Marquer Comme Urgente</Label>
        </div>
        <Divider />

        <div className="flex items-center justify-end space-x-4">
          <Button variant="secondary" type="button">
            Annuler
          </Button>
          <Button type="submit">Créer le rendez-vous</Button>
        </div>
      </form>
    </div>
  );
}
