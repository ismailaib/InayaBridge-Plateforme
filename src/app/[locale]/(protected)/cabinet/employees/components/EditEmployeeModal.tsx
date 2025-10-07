'use client'

import { useState } from 'react'
import { RiUserSettingsFill, RiCloseLine } from '@remixicon/react'
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
import { SquarePen } from 'lucide-react'

export default function EditEmployeeModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <SquarePen className="size-4" />
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
            Modifier l’Employé
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mettez à jour les informations de l’employé sélectionné.
          </p>
        </DialogHeader>

        <form className="flex flex-col md:flex-row">
          <div className="flex flex-col justify-between border-gray-200 dark:border-gray-900 md:w-72 md:border-r">
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <div className="inline-flex shrink-0 items-center justify-center rounded bg-gray-100 p-3 dark:bg-gray-800">
                  <RiUserSettingsFill className="size-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    Employé actuel
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                    Sara El Amrani
                  </p>
                </div>
              </div>
              <Divider className="my-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Les changements seront visibles immédiatement dans le tableau.
              </p>
            </div>

            <div className="flex justify-between border-t gap-4 border-gray-200 p-6 dark:border-gray-900">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className='w-full'>Mettre à jour</Button>
            </div>
          </div>

          <div className="flex-1 space-y-6 p-6">
            <div>
              <Label htmlFor="firstName" className="font-medium">
                Prénom
              </Label>
              <Input id="firstName" defaultValue="Sara" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="lastName" className="font-medium">
                Nom
              </Label>
              <Input id="lastName" defaultValue="El Amrani" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="email" className="font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                defaultValue="sara.elamrani@cabinet.ma"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="role" className="font-medium">
                Rôle
              </Label>
              <Select defaultValue="doctor">
                <SelectTrigger id="role" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Employé</SelectItem>
                  <SelectItem value="doctor">Docteur</SelectItem>
                  <SelectItem value="manager">Responsable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="department" className="font-medium">
                Département
              </Label>
              <Select defaultValue="2">
                <SelectTrigger id="department" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Radiologie</SelectItem>
                  <SelectItem value="2">Pédiatrie</SelectItem>
                  <SelectItem value="3">Cardiologie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
