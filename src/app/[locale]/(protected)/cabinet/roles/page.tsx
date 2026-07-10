'use client'

import type { Role } from '@/api/roles'
import { getRolesByTenant } from '@/api/roles'
import { useCallback, useEffect, useState } from 'react'
import { showToast } from '../../dashboard/hooks/utils'
import AddRoleModal from './components/AddRoleModal'
import TableRoles from './components/TableRoles'

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [tenant, setTenant] = useState<string | null>(null)

  // 🔹 Load tenantId from localStorage first
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        const tenantId = parsedUser?.doctorProfile?.tenantId
        if (tenantId) {
          setTenant(tenantId)
        } else {
          console.warn('Tenant ID not found in user data.')
        }
      }
    } catch (err) {
      console.error('Error parsing user from localStorage', err)
    }
  }, [])

  // 🔹 Move fetchRoles outside useEffect and wrap with useCallback
  const fetchRoles = useCallback(async () => {
    if (!tenant) return
    try {
      setLoading(true)
      const { data } = await getRolesByTenant(tenant)
      setRoles(data)
    } catch (err) {
      showToast('error', 'Erreur de chargement', 'Impossible de charger les rôles.')
    } finally {
      setLoading(false)
    }
  }, [tenant])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Gestion des Rôles
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Définissez les rôles et permissions des membres de votre cabinet pour un meilleur contrôle d&apos;accès.
          </p>
        </div>
        <div>
          <AddRoleModal onRoleAdded={fetchRoles} tenant={tenant!}/>
        </div>
      </div>

      <TableRoles roles={roles} loading={loading} tenantId={tenant!} onRefresh={fetchRoles} />
    </div>
  )
}