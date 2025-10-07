'use client'

import { useState } from 'react'
import { RiUserStarFill, RiCloseLine, RiShieldCheckLine } from '@remixicon/react'

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
import { Checkbox } from '@/components/Checkbox'
import { Plus, Save } from 'lucide-react'

export default function AddRoleModal() {
  const [open, setOpen] = useState(false)
  const [permissions, setPermissions] = useState<string[]>([])

  const togglePermission = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm],
    )
  }

  const modules = [
    {
      title: 'Gestion du Cabinet',
      perms: ['Voir le cabinet', 'Modifier les informations', 'Gérer les départements'],
    },
    {
      title: 'Employés',
      perms: ['Lister les employés', 'Créer un employé', 'Modifier un employé', 'Supprimer un employé'],
    },
    {
      title: 'Patients',
      perms: ['Voir la liste', 'Modifier les dossiers', 'Supprimer un patient'],
    },
    {
      title: 'Rendez-vous',
      perms: ['Voir les rendez-vous', 'Créer un rendez-vous', 'Annuler un rendez-vous'],
    },
    {
      title: 'Facturation',
      perms: ['Voir les factures', 'Créer une facture', 'Modifier une facture', 'Supprimer une facture'],
    },
    {
      title: 'Rôles & Permissions',
      perms: ['Gérer les rôles', 'Attribuer des permissions'],
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="size-4" />
          Ajouter un Rôle
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 sm:max-w-5xl">
        <DialogClose asChild>
          <Button
            variant="ghost"
            className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
          >
            <RiCloseLine className="size-5 shrink-0" />
          </Button>
        </DialogClose>

        <DialogHeader className="border-b border-gray-200 px-6 py-4 dark:border-gray-900">
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <RiShieldCheckLine className="size-5 text-indigo-500" />
            Ajouter un Rôle
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Définissez un rôle et sélectionnez ses permissions.
          </p>
        </DialogHeader>

        <form className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="flex flex-col justify-between border-gray-200 dark:border-gray-900 md:w-72 md:border-r">
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <div className="inline-flex shrink-0 items-center justify-center rounded bg-gray-100 p-3 dark:bg-gray-800">
                  <RiUserStarFill className="size-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    Nouveau Rôle
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                    Définissez les accès de ce rôle.
                  </p>
                </div>
              </div>
              <Divider className="my-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Les permissions définissent ce qu’un utilisateur peut voir ou modifier dans le
                système.
              </p>
            </div>

            <div className="flex justify-between border-t gap-4 border-gray-200 p-6 dark:border-gray-900">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className='w-full'><Save width={18} className='mr-2' /> Enregistrer</Button>
            </div>
          </div>

          {/* Main Form */}
          <div className="flex-1 p-6 space-y-8">
            <div>
              <Label htmlFor="name" className="font-medium">
                Nom du rôle
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex : Médecin, Réceptionniste, Administrateur"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description" className="font-medium">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                placeholder="Décrivez brièvement les responsabilités du rôle"
                className="mt-2"
              />
            </div>

            <Divider className="my-6">Permissions</Divider>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((mod) => (
                <div key={mod.title} className="border rounded-lg p-4 dark:border-gray-800">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                    {mod.title}
                  </h4>
                  <div className="space-y-2">
                    {mod.perms.map((perm) => (
                      <label key={perm} className="flex items-center space-x-2 text-sm">
                        <Checkbox
                          checked={permissions.includes(perm)}
                          onCheckedChange={() => togglePermission(perm)}
                        />
                        <span>{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
