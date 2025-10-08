'use client'

import { useState, useEffect } from 'react'
import { RiSettings3Fill, RiCloseLine } from '@remixicon/react'
import { SquarePen, Save, SendToBack } from 'lucide-react'

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select'
import { Switch } from '@/components/Switch'
import { updateService } from '@/api/services'
import { getDepartmentsByCabinet } from '@/api/departement'
import { showToast } from '../../../dashboard/hooks/utils'

export default function EditServiceModal({
  service,
  onUpdated,
}: {
  service: any
  onUpdated?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([])
  const [form, setForm] = useState({
    code: service?.code || '',
    name: service?.name || '',
    description: service?.description || '',
    price: service?.price || '',
    departmentId: service?.departmentId || '',
  })
  const [isActive, setIsActive] = useState(service?.status === 'ACTIVE')

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
      await updateService(service.id, {
        ...form,
        price: form.price ? parseFloat(form.price as any) : undefined,
        status: isActive ? 'ACTIVE' : 'INACTIVE',
      })
      showToast('success', 'Service mis à jour', 'Les informations ont été enregistrées.')
      setOpen(false)
      onUpdated?.()
    } catch {
      showToast('error', 'Erreur', "Impossible de mettre à jour le service.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 hover:text-blue-600 dark:hover:text-blue-400">
          <SquarePen className="size-4" />
        </button>
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
          <DialogTitle className="text-base font-semibold">Modifier le Service</DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mettez à jour les informations du service sélectionné.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
          <div className="flex flex-col justify-between border-gray-200 dark:border-gray-900 md:w-72 md:border-r">
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <div className="inline-flex shrink-0 items-center justify-center rounded bg-gray-100 p-3 dark:bg-gray-800">
                  <SendToBack className="size-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    Service actuel
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">{service?.name}</p>
                </div>
              </div>
              <Divider className="my-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Les changements seront appliqués instantanément sur la plateforme.
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

          <div className="flex-1 space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Code du service</Label>
                <Input
                  id="code"
                  name="code"
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
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="departmentId">Département</Label>
              <Select
                value={form.departmentId}
                onValueChange={(v) => setForm({ ...form, departmentId: v })}
              >
                <SelectTrigger id="departmentId" className="mt-2">
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
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
                value={form.description}
                onChange={handleChange}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="price">Tarif</Label>
              <Input
                id="price"
                name="price"
                type="number"
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
