'use client'

import { useEffect, useState } from 'react'
import { RiUserSettingsFill, RiCloseLine } from '@remixicon/react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/Dialog'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Label } from '@/components/Label'
import { Divider } from '@/components/Divider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Select'
import { SquarePen } from 'lucide-react'
import api from '@/lib/api'
import { showToast } from '../../../dashboard/hooks/utils'
import { getRolesByTenant } from '@/api/roles'
import { getDepartmentsByCabinet } from '@/api/departement'

interface Props {
  employee: any
  onSuccess?: () => void
  tenantId:string
}

export default function EditEmployeeModal({ employee, onSuccess, tenantId }: Props) {
  const [open, setOpen] = useState(false)
  const [roles, setRoles] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [roleId, setRoleId] = useState(employee?.roleId || '')
  const [departmentId, setDepartmentId] = useState(employee?.departmentId || '')
  const [loading, setLoading] = useState(false)


  const fetchRolesAndDepartments = async () => {
    try {
      const [rolesRes, deptRes] = await Promise.all([
        await getRolesByTenant(tenantId),
        await getDepartmentsByCabinet(tenantId),
      ])
      setRoles(rolesRes.data)
      setDepartments(deptRes.data)
    } catch (err) {
      showToast('error', 'Erreur', 'Impossible de charger les données.')
    }
  }

  useEffect(() => {
    if (open) fetchRolesAndDepartments()
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await api.put(`/doctors/${employee.id}`, {
        roleId,
        departmentId,
      })
      showToast('success', 'Employé mis à jour', 'Les informations ont été sauvegardées.')
      setOpen(false)
      onSuccess?.()
    } catch (err: any) {
      console.error(err)
      showToast('error', 'Erreur', 'Impossible de mettre à jour l’employé.')
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
          <DialogTitle className="text-base font-semibold">
            Modifier l’Employé
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mettez à jour le rôle ou le département de {employee?.email}.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
          <div className="flex flex-col justify-between border-gray-200 dark:border-gray-900 md:w-72 md:border-r">
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <div className="inline-flex shrink-0 items-center justify-center rounded bg-gray-100 p-3 dark:bg-gray-800">
                  <RiUserSettingsFill className="size-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    {employee?.email}
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                    Employé actuel
                  </p>
                </div>
              </div>
              <Divider className="my-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Les changements seront visibles immédiatement.
              </p>
            </div>

            <div className="flex justify-between border-t gap-4 border-gray-200 p-6 dark:border-gray-900">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Mise à jour...' : 'Mettre à jour'}
              </Button>
            </div>
          </div>

          <div className="flex-1 space-y-6 p-6">
            <div>
              <Label htmlFor="role" className="font-medium">
                Rôle
              </Label>
              <Select value={roleId} onValueChange={setRoleId}>
                <SelectTrigger id="role" className="mt-2">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="department" className="font-medium">
                Département
              </Label>
              <Select value={departmentId} onValueChange={setDepartmentId}>
                <SelectTrigger id="department" className="mt-2">
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
