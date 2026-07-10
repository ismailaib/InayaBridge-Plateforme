"use client";

import { Button } from "@/components/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/Dialog";
import { RiCloseLine } from "@remixicon/react";
import { UserRoundPlus } from "lucide-react";

import React, { useState } from "react";
import AddPatientModal from "./AddPatientModal";
import LinkPatientModal from "./LinkPatientModal";

interface AddPatientModalProps {
  onSuccess?: () => void;
}

export default function Add({ onSuccess }: AddPatientModalProps) {
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
          <form action="#" method="POST">
            <h4 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Choisissez le mode d’ajout du patient
            </h4>
            <p className="mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
              Souhaitez-vous créer le patient manuellement ou le lier avec un compte existant à partir de la plateforme ?
            </p>
            <div className="grid lg:grid-cols-2 grid-cols-1 mt-8 gap-4">
              <AddPatientModal onSuccess={onSuccess}/>
              <LinkPatientModal />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
