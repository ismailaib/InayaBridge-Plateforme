'use client'

import { useState, useEffect } from 'react'
import { RiHospitalFill, RiCloseLine } from '@remixicon/react'
import { Plus, Save, SendToBack } from 'lucide-react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select'
import { createService } from '@/api/services'
import { getDepartmentsByCabinet } from '@/api/departement'
import { showToast } from '../../../dashboard/hooks/utils'

export default function AddServiceModal({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([])
  const [isActive, setIsActive] = useState(true)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    departmentId: '',
    code: '',
  })

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const tenantId = user?.doctorProfile?.tenantId
        if (!tenantId) return
        const res = await getDepartmentsByCabinet(tenantId)
        setDepartments(res.data)
      } catch {
        showToast('error', 'Erreur', 'Impossible de charger les départements.')
      }
    }
    fetchDepartments()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const tenantId = user?.doctorProfile?.tenantId

      if (!tenantId) throw new Error('Tenant ID manquant')

      await createService({
        ...form,
        price: form.price ? parseFloat(form.price) : undefined,
        tenantId,
        status: isActive ? 'ACTIVE' : 'INACTIVE',
      })

      showToast('success', 'Service ajouté', 'Le service a été créé avec succès.')
      setOpen(false)
      onCreated?.()
    } catch {
      showToast('error', 'Erreur', "Impossible d'ajouter le service.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="size-4" /> Ajouter un Service
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
          <DialogTitle className="text-base font-semibold">Ajouter un Service</DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Créez un service associé à un département du cabinet.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="flex flex-col justify-between border-gray-200 dark:border-gray-900 md:w-72 md:border-r">
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <div className="inline-flex shrink-0 items-center justify-center rounded bg-gray-100 p-3 dark:bg-gray-800">
                  <SendToBack className="size-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    Nouveau Service
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                    Reliez-le à un département existant.
                  </p>
                </div>
              </div>
              <Divider className="my-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Les services aident à organiser les prestations au sein de chaque département
                (ex: Radiologie → Scanner, Échographie...).
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

          {/* Main form */}
          <div className="flex-1 space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Code du service</Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="Ex: SRV-001"
                  value={form.code}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="name">Nom du service</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Échographie abdominale"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2"
                  required
                />
              </div>
            </div>

            <div >
              <Label htmlFor="departmentId">Département associé</Label>
              <Select
                value={form.departmentId}
                onValueChange={(v) => setForm({ ...form, departmentId: v })}
              >
                <SelectTrigger id="departmentId" className="mt-2"  >
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {departments.map((dep) => (
                    <SelectItem key={dep.id} value={dep.id}>
                      {dep.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Décrivez le service et ses prestations"
                value={form.description}
                onChange={handleChange}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="price">Tarif (optionnel)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                placeholder="Ex: 250.00"
                value={form.price}
                onChange={handleChange}
                className="mt-2"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="active">Service actif</Label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
