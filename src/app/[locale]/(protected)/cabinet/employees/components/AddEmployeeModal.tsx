'use client'

import { useState } from 'react'
import { RiUserAddFill, RiCloseLine } from '@remixicon/react'

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

export default function AddEmployeeModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="size-4" />
          Ajouter un Employé
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
            Ajouter un Employé
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Renseignez les informations de l’employé à ajouter.
          </p>
        </DialogHeader>

        <form className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="flex flex-col justify-between border-gray-200 dark:border-gray-900 md:w-72 md:border-r">
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <div className="inline-flex shrink-0 items-center justify-center rounded bg-gray-100 p-3 dark:bg-gray-800">
                  <RiUserAddFill className="size-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    Nouvel Employé
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                    Gérer ses accès et son département.
                  </p>
                </div>
              </div>
              <Divider className="my-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chaque employé recevra ses identifiants d’accès après création.
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
              <Label htmlFor="firstName" className="font-medium">
                Prénom
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Ex : Sara"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="lastName" className="font-medium">
                Nom
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Ex : El Amrani"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="font-medium">
                Adresse e-mail professionnelle
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="exemple@votrecabinet.ma"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="role" className="font-medium">
                Rôle
              </Label>
              <Select defaultValue="staff">
                <SelectTrigger id="role" className="mt-2">
                  <SelectValue placeholder="Sélectionner un rôle" />
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
              <Select defaultValue="1">
                <SelectTrigger id="department" className="mt-2">
                  <SelectValue placeholder="Sélectionner un département" />
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
