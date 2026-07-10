'use client'

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
import { RiCloseLine } from '@remixicon/react'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { deleteRole } from '@/api/roles'
import { showToast } from '../../../dashboard/hooks/utils'

interface DeleteRoleModalProps {
  roleId: string
  onRoleDeleted?: () => void
}

export default function DeleteRoleModal({ roleId, onRoleDeleted }: DeleteRoleModalProps) {
  const [open, setOpen] = useState(false)
  const [confirmName, setConfirmName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setLoading(true)
      await deleteRole(roleId)
      showToast('success', 'Succès', 'Rôle supprimé avec succès.')
      onRoleDeleted?.()
      setOpen(false)
    } catch {
      showToast('error', 'Erreur', 'Impossible de supprimer le rôle.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="size-4 cursor-pointer" />
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

        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Supprimer le Rôle
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Cette action supprimera définitivement le rôle et ses permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <Label htmlFor="confirm-role" className="font-medium">
            Confirmez le nom du rôle
          </Label>
          <Input
            id="confirm-role"
            placeholder="Saisissez le nom du rôle"
            className="mt-2"
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Suppression...' : 'Supprimer définitivement'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
