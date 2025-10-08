'use client'

import { useState } from 'react'
import { RiBuilding2Fill, RiCloseLine } from '@remixicon/react'
import { Plus, Save } from 'lucide-react'

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
import { Switch } from '@/components/Switch'
import { createDepartment } from '@/api/departement'
import { showToast } from '../../../dashboard/hooks/utils'

export default function AddDepartementModal({
  tenantId,
  onCreated,
}: {
  tenantId: string
  onCreated: () => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    code: '',
    name: '',
    phone: '',
    description: '',
    status: true, // true = ACTIVE, false = INACTIVE
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tenantId) return showToast('error', 'Erreur', 'Tenant ID manquant')

    try {
      setLoading(true)
      await createDepartment({
        ...form,
        tenantId,
        status: form.status ? 'ACTIVE' : 'INACTIVE',
      })
      showToast('success', 'Département ajouté', 'Le département a été créé avec succès.')
      setOpen(false)
      onCreated?.()
    } catch {
      showToast('error', 'Erreur', "Impossible d'ajouter le département.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="size-4" />
          Ajouter un Département
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 sm:max-w-3xl">
        {/* Close Button */}
        <DialogClose asChild>
          <Button
            className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
            variant="ghost"
          >
            <RiCloseLine className="size-5 shrink-0" />
          </Button>
        </DialogClose>

        {/* Header */}
        <DialogHeader className="border-b border-gray-200 px-6 py-4 dark:border-gray-900">
          <DialogTitle className="text-base font-semibold">
            Ajouter un Département
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Renseignez les informations principales du département.
          </p>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="flex flex-col justify-between border-gray-200 dark:border-gray-900 md:w-72 md:border-r">
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <div className="inline-flex shrink-0 items-center justify-center rounded bg-gray-100 p-3 dark:bg-gray-800">
                  <RiBuilding2Fill className="size-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    Nouveau Département
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                    Gérer les services et le personnel liés.
                  </p>
                </div>
              </div>
              <Divider className="my-4" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50">Description</h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Un département représente une unité de travail ou un service dans votre cabinet
                (ex : Radiologie, Pédiatrie…).
              </p>
            </div>
            <div className="flex justify-between border-t gap-4 border-gray-200 p-6 dark:border-gray-900">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading} className="w-full">
                <Save width={18} className="mr-2" /> Enregistrer
              </Button>
            </div>
          </div>

          {/* Fields */}
          <div className="flex-1 space-y-6 p-6">
            {/* Code + Name on same row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="code" className="font-medium">
                  Code du département
                </Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="Ex : DEP-001"
                  value={form.code}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="name" className="font-medium">
                  Nom du département
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex : Radiologie"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="font-medium">
                Numéro de téléphone
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+212 600-123456"
                value={form.phone}
                onChange={handleChange}
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
                placeholder="Courte description du département"
                value={form.description}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
            <Divider />
            {/* Status toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="status" className="font-medium">
                  Statut du département
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Activez ou désactivez le département.
                </p>
              </div>
              <Switch
                id="status"
                checked={form.status}
                onCheckedChange={(checked) => setForm({ ...form, status: checked })}
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
