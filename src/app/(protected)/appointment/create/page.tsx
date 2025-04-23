'use client';

import React from 'react';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import {
  RadioCardGroup,
  RadioCardItem,
  RadioCardIndicator,
} from '@/components/RadioCardGroup';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/Select';

const appointmentTypes = [
  {
    id: 1,
    title: 'Consultation initiale',
    description: 'Premier rendez-vous avec le patient',
  },
  {
    id: 2,
    title: 'Consultation de suivi',
    description: 'Suivi post-traitement ou post-opératoire',
  },
  {
    id: 3,
    title: 'Téléconsultation',
    description: 'Consultation à distance',
  },
];

export default function RendezVousForm() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
        Créer un rendez-vous
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Remplissez les informations ci-dessous pour planifier un rendez-vous.
      </p>

      <form className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
          {/* Prénom */}
          <div className="col-span-full sm:col-span-3">
            <Label htmlFor="prenom" className="font-medium">
              Prénom<span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="prenom"
              name="prenom"
              placeholder="Emma"
              className="mt-2"
            />
          </div>

          {/* Nom */}
          <div className="col-span-full sm:col-span-3">
            <Label htmlFor="nom" className="font-medium">
              Nom<span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="nom"
              name="nom"
              placeholder="Durand"
              className="mt-2"
            />
          </div>

          {/* Date */}
          <div className="col-span-full sm:col-span-3">
            <Label htmlFor="date" className="font-medium">
              Date<span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              id="date"
              name="date"
              className="mt-2"
            />
          </div>

          {/* Heure */}
          <div className="col-span-full sm:col-span-3">
            <Label htmlFor="heure" className="font-medium">
              Heure<span className="text-red-500">*</span>
            </Label>
            <Input
              type="time"
              id="heure"
              name="heure"
              className="mt-2"
            />
          </div>

          {/* Motif */}
          <div className="col-span-full sm:col-span-4">
            <Label htmlFor="motif" className="font-medium">
              Motif<span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="motif"
              name="motif"
              placeholder="Ex. Bilan sanguin"
              className="mt-2"
            />
          </div>

          {/* Lieu */}
          <div className="col-span-full sm:col-span-2">
            <Label htmlFor="lieu" className="font-medium">
              Lieu<span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger id="lieu" name="lieu" className="mt-2">
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cabinet">Cabinet principal</SelectItem>
                <SelectItem value="teleconsultation">Téléconsultation</SelectItem>
                <SelectItem value="domicile">À domicile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type de rendez-vous */}
          <div className="col-span-full">
            <RadioCardGroup name="typeRDV" defaultValue={appointmentTypes[0].title}>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                Type de rendez-vous
              </p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {appointmentTypes.map((opt) => (
                  <RadioCardItem
                    key={opt.id}
                    value={opt.title}
                    id={opt.title}
                    className="flex flex-col justify-between p-4"
                  >
                    <div>
                      <Label
                        htmlFor={opt.title}
                        className="font-medium"
                      >
                        {opt.title}
                      </Label>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {opt.description}
                      </p>
                    </div>
                    <RadioCardIndicator />
                  </RadioCardItem>
                ))}
              </div>
            </RadioCardGroup>
          </div>
        </div>

        <Divider />

        {/* Actions */}
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
