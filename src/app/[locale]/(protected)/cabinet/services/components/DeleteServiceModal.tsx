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
import { deleteService } from '@/api/services'
import { showToast } from '../../../dashboard/hooks/utils'

export default function DeleteServiceModal({
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
      await deleteService(id)
      showToast('success', 'Service supprimé', 'Le service a été supprimé avec succès.')
      setOpen(false)
      onDeleted?.()
    } catch {
      showToast('error', 'Erreur', "Impossible de supprimer le service.")
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
            <DialogTitle>Supprimer le Service</DialogTitle>
            <DialogDescription className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Cette action supprimera définitivement le service et ses données associées.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            <Label htmlFor="confirm-service">Confirmez le nom du service</Label>
            <Input
              id="confirm-service"
              name="confirm-service"
              placeholder="Saisissez le nom du service"
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
