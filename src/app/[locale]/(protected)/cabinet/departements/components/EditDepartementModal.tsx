'use client'

import { useState } from 'react'
import { RiBuilding2Fill, RiCloseLine } from '@remixicon/react'
import { PenSquare, Save } from 'lucide-react'

import { Button } from '@/components/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/Dialog'
import { Input } from '@/components/Input'
import { Label } from '@/components/Label'
import { Divider } from '@/components/Divider'
import { Switch } from '@/components/Switch'
import { updateDepartment } from '@/api/departement'
import { showToast } from '../../../dashboard/hooks/utils'

export default function EditDepartementModal({
  departement,
  onUpdated,
}: {
  departement: any
  onUpdated?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    code: departement?.code ?? '',
    name: departement?.name ?? '',
    phone: departement?.phone ?? '',
    description: departement?.description ?? '',
    status: departement?.status === 'ACTIVE',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await updateDepartment(departement.id, {
        ...form,
        status: form.status ? 'ACTIVE' : 'INACTIVE',
      })
      showToast('success', 'Département mis à jour', 'Les informations ont été sauvegardées.')
      setOpen(false)
      onUpdated?.()
    } catch {
      showToast('error', 'Erreur', "Impossible de mettre à jour le département.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 hover:text-blue-600 dark:hover:text-blue-400">
          <PenSquare className="size-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="p-0 sm:max-w-3xl">
        {/* Close button */}
        <DialogClose asChild>
          <Button
            variant="ghost"
            className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
          >
            <RiCloseLine className="size-5 shrink-0" />
          </Button>
        </DialogClose>

        {/* Header */}
        <DialogHeader className="border-b border-gray-200 px-6 py-4 dark:border-gray-900">
          <DialogTitle className="text-base font-semibold">Modifier le Département</DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mettez à jour les informations du département.
          </p>
        </DialogHeader>

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
                    Département actuel
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                    {departement?.name}
                  </p>
                </div>
              </div>
              <Divider className="my-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Les modifications seront appliquées immédiatement à votre espace cabinet.
              </p>
            </div>
            <div className="flex justify-between border-t gap-4 border-gray-200 p-6 dark:border-gray-900">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading} className="w-full">
                <Save width={18} className="mr-2" /> Mettre à jour
              </Button>
            </div>
          </div>

          {/* Fields */}
          <div className="flex-1 space-y-6 p-6">
            {/* Code + Name on one row */}
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
            {/* Status switch */}
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
