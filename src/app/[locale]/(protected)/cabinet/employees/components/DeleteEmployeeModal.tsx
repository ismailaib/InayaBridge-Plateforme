'use client'

import { useState } from 'react'
import { RiCloseLine, RiDeleteBin7Line } from '@remixicon/react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/Dialog'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Label } from '@/components/Label'
import { Trash2 } from 'lucide-react'

export default function DeleteEmployeeModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <Trash2 className="size-4" />
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogClose asChild>
          <Button
            variant="ghost"
            className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
          >
            <RiCloseLine className="size-5 shrink-0" />
          </Button>
        </DialogClose>

        <form>
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Supprimer l’Employé
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Cette action supprimera définitivement le compte et les accès de
              l’employé. Elle ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            <Label htmlFor="confirm-email" className="font-medium">
              Confirmez l’adresse e-mail
            </Label>
            <Input
              id="confirm-email"
              name="confirm-email"
              placeholder="Entrez l’e-mail de l’employé"
              className="mt-2"
            />
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="destructive" className="w-full">
                Supprimer définitivement
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
