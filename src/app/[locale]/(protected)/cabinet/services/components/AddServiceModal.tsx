'use client'

import { useState } from 'react'
import { RiHospitalFill, RiCloseLine } from '@remixicon/react'

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
import { Switch } from '@/components/Switch'
import { Plus, Save } from 'lucide-react'

export default function AddServiceModal() {
  const [open, setOpen] = useState(false)
  const [isActive, setIsActive] = useState(true)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="size-4" />
           Ajouter un Service
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 sm:max-w-3xl">
        <DialogClose asChild>
          <Button
            variant="ghost"
            className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
          >
            <RiCloseLine className="size-5 shrink-0" />
          </Button>
        </DialogClose>

        <DialogHeader className="border-b border-gray-200 px-6 py-4 dark:border-gray-900">
          <DialogTitle className="text-base font-semibold">
            Ajouter un Service
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Créez un service associé à un département du cabinet.
          </p>
        </DialogHeader>

        <form className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="flex flex-col justify-between border-gray-200 dark:border-gray-900 md:w-72 md:border-r">
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <div className="inline-flex shrink-0 items-center justify-center rounded bg-gray-100 p-3 dark:bg-gray-800">
                  <RiHospitalFill className="size-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    Nouveau Service
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                    Reliez-le à un département existant.
                  </p>
                </div>
              </div>
              <Divider className="my-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Les services aident à organiser les prestations au sein de chaque département
                (ex: Radiologie → Scanner, Échographie...).
              </p>
            </div>

            <div className="flex justify-between border-t gap-4 border-gray-200 p-6 dark:border-gray-900">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className='w-full'><Save width={18} className='mr-2' /> Enregistrer</Button>
            </div>
          </div>

          {/* Main form */}
          <div className="flex-1 space-y-6 p-6">
            <div>
              <Label htmlFor="name" className="font-medium">
                Nom du service
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex : Échographie abdominale"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="department" className="font-medium">
                Département associé
              </Label>
              <Select defaultValue="radiologie">
                <SelectTrigger id="department" className="mt-2">
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="radiologie">Radiologie</SelectItem>
                  <SelectItem value="cardiologie">Cardiologie</SelectItem>
                  <SelectItem value="pediatrie">Pédiatrie</SelectItem>
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
                placeholder="Décrivez le service et ses prestations"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="price" className="font-medium">
                Tarif (optionnel)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                placeholder="Ex : 250.00"
                className="mt-2"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="active" className="font-medium">
                Service actif
              </Label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
