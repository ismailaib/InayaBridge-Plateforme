"use client";

import React from 'react';
import { RiCloseLine } from '@remixicon/react';
import { CircleUserRound, UserRoundPlus } from 'lucide-react';

import { Button } from '@/components/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/Dialog';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/Select';
import { DatePicker } from '@/components/DatePicker';

export default function AddPatientModal() {
  return (
    <div className="flex items-center justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex flex-row gap-2">
            <UserRoundPlus width={18} />
            Ajouter un patient
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogClose asChild>
            <Button
              className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
              variant="ghost"
            >
              <RiCloseLine className="size-5 shrink-0" />
            </Button>
          </DialogClose>
          <form action="#" method="POST">
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
                  Nom complet
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="mt-2"
                  placeholder="Entrez le nom complet"
                />
              </div>

              <div>
                <Label htmlFor="gender" className="font-medium">
                  Sexe
                </Label>
                <Select defaultValue="Homme">
                  <SelectTrigger id="gender" name="gender" className="mt-2">
                    <SelectValue placeholder="Sélectionnez le sexe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Homme">Homme</SelectItem>
                    <SelectItem value="Femme">Femme</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dob" className="font-medium">
                  Date de naissance
                </Label>
                <DatePicker
                  id="dob"
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
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Annuler
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit">
                  Ajouter
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
