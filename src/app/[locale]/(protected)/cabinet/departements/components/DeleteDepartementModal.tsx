'use client'

import { useState } from 'react'
import { RiCloseLine } from '@remixicon/react'
import { Trash2 } from 'lucide-react'

import { Button } from '@/components/Button'
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
import { Input } from '@/components/Input'
import { Label } from '@/components/Label'
import { deleteDepartment } from '@/api/departement'
import { showToast } from '../../../dashboard/hooks/utils'

export default function DeleteDepartementModal({
  id,
  onDeleted,
}: {
  id: string
  onDeleted?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [confirmName, setConfirmName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await deleteDepartment(id)
      showToast('success', 'Département supprimé', 'Le département a été supprimé avec succès.')
      setOpen(false)
      onDeleted?.()
    } catch {
      showToast('error', 'Erreur', "Impossible de supprimer le département.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 hover:text-red-600 dark:hover:text-red-400">
          <Trash2 className="size-4" />
        </button>
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

        <form onSubmit={handleDelete}>
          <DialogHeader>
            <DialogTitle>Supprimer le Département</DialogTitle>
            <DialogDescription className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Cette action est irréversible. Toutes les données liées à ce département seront
              définitivement supprimées.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            <Label htmlFor="confirm-name">Confirmez le nom du département</Label>
            <Input
              id="confirm-name"
              name="confirm-name"
              placeholder="Saisissez le nom pour confirmer"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              className="mt-2"
            />
          </div>

          <DialogFooter className="mt-4">
              <Button
                type="submit"
                variant="destructive"
                className="w-full"
                disabled={loading || confirmName.trim() === ''}
              >
                Supprimer définitivement
              </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
