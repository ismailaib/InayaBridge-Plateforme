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

export default function DeleteDepartementModal() {
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
              Supprimer le Département
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Cette action est irréversible. Toutes les données liées à ce
              département seront définitivement supprimées.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            <Label htmlFor="confirm-name" className="font-medium">
              Confirmez le nom du département
            </Label>
            <Input
              id="confirm-name"
              name="confirm-name"
              placeholder="Saisissez le nom pour confirmer"
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
