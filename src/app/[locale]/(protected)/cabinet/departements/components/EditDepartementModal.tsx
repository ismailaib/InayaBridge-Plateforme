'use client'

import { useState } from 'react'
import { RiBuilding2Fill, RiCloseLine } from '@remixicon/react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/Dialog'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Label } from '@/components/Label'
import { Divider } from '@/components/Divider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Select'
import { PenSquare } from 'lucide-react'

export default function EditDepartementModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <PenSquare className="size-4" />
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
            Modifier le Département
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mettez à jour les informations du département.
          </p>
        </DialogHeader>

        <form className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="flex flex-col justify-between border-gray-200 dark:border-gray-900 md:w-72 md:border-r">
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <div className="inline-flex shrink-0 items-center justify-center rounded bg-gray-100 p-3 dark:bg-gray-800">
                  <RiBuilding2Fill className="size-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    Département actuel
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                    Cardiology (exemple)
                  </p>
                </div>
              </div>
              <Divider className="my-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Les modifications seront appliquées immédiatement à votre
                espace cabinet.
              </p>
            </div>
            <div className="flex justify-between border-t gap-4 border-gray-200 p-6 dark:border-gray-900">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className='w-full'>Mettre à jour</Button>
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
                defaultValue="Cardiology"
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
                defaultValue="+212 600-112233"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="head" className="font-medium">
                Responsable du département
              </Label>
              <Select defaultValue="1">
                <SelectTrigger id="head" className="mt-2">
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
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
                defaultValue="Heart-related diagnostics and treatments"
                className="mt-2"
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
