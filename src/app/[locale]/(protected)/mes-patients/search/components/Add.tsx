"use client";

import { Button } from "@/components/Button";
import { DatePicker } from "@/components/DatePicker";
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
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { RiCloseLine } from "@remixicon/react";
import { format } from "date-fns";
import { UserRoundPlus } from "lucide-react";

import React, { useState } from "react";

import { createPatient } from "../../api/patients";

interface AddPatientModalProps {
  onSuccess?: () => void;
}

export default function AddPatientModal({ onSuccess }: AddPatientModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("male");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const [cin, setCin] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [adress, setAdress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateOfBirth) return alert("Date de naissance requise.");

    const payload = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      address: adress,
      email,
      date_of_birth: format(dateOfBirth, "yyyy-MM-dd"),
      gender,
      cin,
    };

    try {
      setLoading(true);
      await createPatient(payload);
      if (onSuccess) onSuccess();
      // Close the modal after success
      const dialog = document.querySelector(
        '[role="dialog"]',
      ) as HTMLElement | null;
      if (dialog) {
        const closeBtn = dialog.querySelector('button[type="button"]');
        if (closeBtn) (closeBtn as HTMLButtonElement).click();
      }
    } catch (err) {
      console.error("Erreur création patient:", err);
    } finally {
      setLoading(false);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex flex-row gap-2">
            <UserRoundPlus width={18} />
            Ajouter un patient
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogClose asChild>
            <Button
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
                <Label htmlFor="fullName" className="font-medium">
                  Nom
                </Label>
                <Input
                  id="nom"
                  name="nom"
                  type="text"
                  className="mt-2"
                  placeholder="Entrez le Nom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fullName" className="font-medium">
                  Prénom
                </Label>
                <Input
                  id="prenom"
                  name="prenom"
                  type="text"
                  className="mt-2"
                  placeholder="Entrez le Prénom"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                  value={adress}
                  onChange={(e) => setAdress(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="dob" className="font-medium">
                  Date de naissance
                </Label>
                <DatePicker
                  id="dob"
                  value={dateOfBirth}
                  onChange={setDateOfBirth}
                  className="mt-2"
                  required
                  placeholder="Sélectionnez la date de naissance"
                />
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
              <Button type="submit" isLoading={loading} loadingText="Ajout...">
                Ajouter
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
