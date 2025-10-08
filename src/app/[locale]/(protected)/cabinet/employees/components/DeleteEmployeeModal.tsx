'use client'

import { useState } from 'react'
import { RiCloseLine } from '@remixicon/react'
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
import { Trash2 } from 'lucide-react'
import api from '@/lib/api'
import { cancelInvitation } from '@/api/invitations'
import { showToast } from '../../../dashboard/hooks/utils'

interface Props {
  employee: any
  onSuccess?: () => void
  tenantId:string
}

export default function DeleteEmployeeModal({ employee, onSuccess, tenantId }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)


  const handleDelete = async () => {
    try {
      setLoading(true)

      if (employee.status === 'PENDING') {
        // Delete invitation
        await cancelInvitation(employee.id, tenantId)
      } else {
        // Delete doctor profile
        await api.delete(`/doctors/${employee.id}`)
      }

      showToast('success', 'Employé supprimé', 'L’employé a été supprimé avec succès.')
      setOpen(false)
      onSuccess?.()
    } catch (err) {
      console.error(err)
      showToast('error', 'Erreur', 'Impossible de supprimer cet employé.')
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

        <DialogHeader>
          <DialogTitle>Supprimer l’Employé</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            Cette action est irréversible. {employee?.email} sera définitivement supprimé.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Suppression...' : 'Supprimer définitivement'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
