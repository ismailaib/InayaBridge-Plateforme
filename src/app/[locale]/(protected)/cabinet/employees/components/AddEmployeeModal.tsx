'use client'

import { useEffect, useState } from 'react'
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
import { showToast } from '../../../dashboard/hooks/utils'
import { sendInvitation } from '@/api/invitations'
import { getRolesByTenant } from '@/api/roles'

interface AddEmployeeModalProps {
  onSuccess?: () => void
  tenantId:string
}

export default function AddEmployeeModal({ onSuccess , tenantId }: AddEmployeeModalProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [roleId, setRoleId] = useState('')
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)


  // Fetch tenant roles dynamically
  const fetchRoles = async () => {
    try {
      const { data } = await getRolesByTenant(tenantId)
      setRoles(data)
    } catch (err) {
      console.error('Failed to load roles:', err)
      showToast('error', 'Erreur', 'Impossible de charger les rôles.')
    }
  }

  useEffect(() => {
    if (open) fetchRoles()
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !roleId) {
      showToast('error', 'Champs manquants', 'Veuillez remplir tous les champs.')
      return
    }

    try {
      setLoading(true)
      await sendInvitation(tenantId, { email, roleId })
      showToast(
        'success',
        'Invitation envoyée',
        `Une invitation a été envoyée à ${email}`
      )
      setOpen(false)
      setEmail('')
      setRoleId('')
      onSuccess?.()
    } catch (err: any) {
      console.error(err)
      const message =
        err.response?.data?.message || 'Erreur lors de l’envoi de l’invitation.'
      showToast('error', 'Échec', message)
    } finally {
      setLoading(false)
    }
  }

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
            Inviter un Employé
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Saisissez l’adresse e-mail et sélectionnez un rôle pour envoyer une invitation.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="flex flex-col justify-between border-gray-200 dark:border-gray-900 md:w-72 md:border-r">
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <div className="inline-flex shrink-0 items-center justify-center rounded bg-gray-100 p-3 dark:bg-gray-800">
                  <RiUserAddFill className="size-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    Nouvelle Invitation
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                    L’employé recevra un lien d’activation.
                  </p>
                </div>
              </div>
              <Divider className="my-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                L’invité devra créer son mot de passe lors de l’acceptation.
              </p>
            </div>

            <div className="flex justify-between border-t gap-4 border-gray-200 p-6 dark:border-gray-900">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center"
              >
                {loading ? 'Envoi...' : <Save width={18} className="mr-2" />}
                {!loading && 'Envoyer'}
              </Button>
            </div>
          </div>

          {/* Fields */}
          <div className="flex-1 space-y-6 p-6">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="role" className="font-medium">
                Rôle dans le cabinet
              </Label>
              <Select value={roleId} onValueChange={setRoleId}>
                <SelectTrigger id="role" className="mt-2">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {roles.length === 0 ? (
                    <SelectItem value="none" disabled>
                      Aucun rôle disponible
                    </SelectItem>
                  ) : (
                    roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
