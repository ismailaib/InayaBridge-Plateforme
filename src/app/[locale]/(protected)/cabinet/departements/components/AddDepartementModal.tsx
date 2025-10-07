'use client'

import { useState } from 'react'
import { RiBuilding2Fill, RiCloseLine } from '@remixicon/react'

import { Button } from '@/components/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/Dialog'
import { Divider } from '@/components/Divider'
import { Input } from '@/components/Input'
import { Label } from '@/components/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Select'
import { Plus, Save } from 'lucide-react'

export default function AddDepartementModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="size-4" />
          Ajouter un Département
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 sm:max-w-3xl">
        {/* Close Button */}
        <DialogClose asChild>
          <Button
            className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
            variant="ghost"
          >
            <RiCloseLine className="size-5 shrink-0" />
          </Button>
        </DialogClose>

        {/* Header */}
        <DialogHeader className="border-b border-gray-200 px-6 py-4 dark:border-gray-900">
          <DialogTitle className="text-base font-semibold">
            Ajouter un Département
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Renseignez les informations principales du département.
          </p>
        </DialogHeader>

        {/* Form */}
        <form action="#" method="POST" className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="flex flex-col justify-between border-gray-200 dark:border-gray-900 md:w-72 md:border-r">
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <div className="inline-flex shrink-0 items-center justify-center rounded bg-gray-100 p-3 dark:bg-gray-800">
                  <RiBuilding2Fill
                    className="size-5 text-gray-700 dark:text-gray-300"
                    aria-hidden={true}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    Nouveau Département
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                    Gérer les services et le personnel liés.
                  </p>
                </div>
              </div>
              <Divider className="my-4" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                Description
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Un département représente une unité de travail ou un service
                dans votre cabinet (ex : Radiologie, Pédiatrie…).
              </p>
            </div>
            <div className="flex justify-between border-t gap-4 border-gray-200 p-6 dark:border-gray-900">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className='w-full'><Save width={18} className='mr-2' /> Enregistrer</Button>
            </div>
          </div>

          {/* Fields */}
          <div className="flex-1 space-y-6 p-6">
            <div>
              <Label htmlFor="name" className="font-medium">
                Nom du département
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex : Radiologie"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="font-medium">
                Numéro de téléphone
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+212 600-123456"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="head" className="font-medium">
                Responsable du département
              </Label>
              <Select defaultValue="none">
                <SelectTrigger id="head" className="mt-2">
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="1">Dr. Sara El Amrani</SelectItem>
                  <SelectItem value="2">Dr. Youssef Bennani</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description" className="font-medium">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                placeholder="Courte description du département"
                className="mt-2"
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
