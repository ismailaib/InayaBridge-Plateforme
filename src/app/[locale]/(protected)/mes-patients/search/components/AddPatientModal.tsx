"use client";

import { Button } from "@/components/Button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/Dialog";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import { RiCloseLine } from "@remixicon/react";
import { format } from "date-fns";
import { Plus, UserRoundPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPatient } from "@/api/patients";
import { Card } from "@/components/Card";
import { DatePickerBirthDateExample } from "@/components/DateBirth";
import { showToast } from "../../../dashboard/hooks/utils";

interface AddPatientModalProps {
  onSuccess?: () => void;
}

export default function AddPatientModal({ onSuccess }: AddPatientModalProps) {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("male");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const [cin, setCin] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        const tid = user?.doctorProfile?.tenantId || user?.tenantId;
        if (tid) setTenantId(tid);
      }
    } catch (err) {
      console.error("Erreur lecture tenantId:", err);
    }
  }, []);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setGender("male");
    setDateOfBirth(undefined);
    setCin("");
    setPhone("");
    setEmail("");
    setAddress("");
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return alert("Tenant ID manquant !");
    if (!dateOfBirth) return alert("Date de naissance requise.");

    const payload = {
      tenantId,
      firstName,
      lastName,
      cin,
      phone,
      email,
      gender,
      dateOfBirth: format(dateOfBirth, "yyyy-MM-dd"),
      address,
    };

    try {
      setLoading(true);
      await createPatient(payload);
      onSuccess?.();
      showToast("success", "Patient ajouté", "Le patient a été créé avec succès.");
      setIsOpen(false);
    } catch (err) {
      console.error("Erreur création patient:", err);
      alert("Échec de la création du patient. Vérifiez les champs et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) resetForm();
  };

  return (
    <div className="flex items-center justify-center">
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Card className="flex flex-col justify-center items-center cursor-pointer hover:dark:bg-gray-900 transition-all duration-300 gap-2">
            <UserRoundPlus width={34} />
            Ajouter Manuellement
          </Card>
        </DialogTrigger>

        <DialogContent className="max-w-4xl">
          <DialogClose asChild>
            <Button
              aria-label="Close"
              className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
              variant="ghost"
            >
              <RiCloseLine className="size-5 shrink-0" />
            </Button>
          </DialogClose>

          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">
                Ajouter un nouveau patient
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                Veuillez remplir les informations du patient ci-dessous.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="nom" className="font-medium">
                  Nom
                </Label>
                <Input
                  id="nom"
                  name="nom"
                  type="text"
                  className="mt-2"
                  placeholder="Entrez le Nom"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="prenom" className="font-medium">
                  Prénom
                </Label>
                <Input
                  id="prenom"
                  name="prenom"
                  type="text"
                  className="mt-2"
                  placeholder="Entrez le Prénom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="gender" className="font-medium">
                  Genre
                </Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender" name="gender" className="mt-2">
                    <SelectValue placeholder="Sélectionnez le sexe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Homme</SelectItem>
                    <SelectItem value="female">Femme</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="address" className="font-medium">
                  Adresse Complète
                </Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  className="mt-2"
                  placeholder="Entrez l'adresse complète"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="dob" className="font-medium">
                  Date de naissance
                </Label>
                <div className="mt-2">
                  <DatePickerBirthDateExample
                    value={dateOfBirth}
                    onChange={setDateOfBirth}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cin" className="font-medium">
                  CIN
                </Label>
                <Input
                  id="cin"
                  name="cin"
                  type="text"
                  className="mt-2"
                  placeholder="Entrez le numéro de CIN"
                  value={cin}
                  onChange={(e) => setCin(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="font-medium">
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="mt-2"
                  placeholder="Entrez le numéro de téléphone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email" className="font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="mt-2"
                  placeholder="Entrez l'adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Annuler
                </Button>
              </DialogClose>
              <Button
                type="submit"
                isLoading={loading}
                loadingText="Ajout..."
                className="flex flex-row gap-2"
              >
                <Plus width={18} /> Ajouter
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
