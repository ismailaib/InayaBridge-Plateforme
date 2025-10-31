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
import { RiCloseLine } from "@remixicon/react";
import { Link, UserRoundPlus } from "lucide-react";

import React, { useState } from "react";

import { Card } from "@/components/Card";

interface AddPatientModalProps {
  onSuccess?: () => void;
}

export default function AddPatientModal({ onSuccess }: AddPatientModalProps) {
  const [linkcode, setLinkcode] = useState("");
  const [loading, setLoading] = useState(false);


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
          <Card className="flex flex-col justify-center items-center cursor-pointer hover:dark:bg-gray-900 transition-all duration-300 gap-2">
            <Link width={34}/>
            Lier via code patient
          </Card>
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

          <form>
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">
                Lier un patient existant
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                Veuillez remplir les informations du patient ci-dessous.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6">
              <div>
                <Label htmlFor="fullName" className="font-medium">
                  Code patient
                </Label>
                <Input
                  id="nom"
                  name="nom"
                  type="text"
                  className="mt-2"
                  placeholder="Ex: P-12345"
                  value={linkcode}
                  required
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Annuler
                </Button>
              </DialogClose>
              <Button type="submit" isLoading={loading} loadingText="Ajout..."  className="flex flex-row gap-2">
                <Link width={18}/> Lier le patient
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
