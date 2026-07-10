'use client'

import { useEffect, useState } from 'react'
import { showToast } from '../../dashboard/hooks/utils'
import TableDepartements from './components/TableDepartements'
import AddDepartementModal from './components/AddDepartementModal'
import { getDepartmentsByCabinet, Department } from '@/api/departement'

export default function DepartementsPage() {
  const [departements, setDepartements] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [tenantId, setTenantId] = useState<string | null>(null)

  // ✅ Load tenantId from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        const tenant = parsedUser?.doctorProfile?.tenantId
        if (tenant) setTenantId(tenant)
      }
    } catch (err) {
      console.error('Error parsing user from localStorage', err)
    }
  }, [])

  const fetchDepartements = async () => {
    if (!tenantId) return

    try {
      setLoading(true)
      const res = await getDepartmentsByCabinet(tenantId)
      setDepartements(res.data)
    } catch (err) {
      showToast(
        'error',
        'Erreur de chargement',
        "Impossible de charger les départements pour ce cabinet."
      )
    } finally {
      setLoading(false)
    }
  }

  // ✅ Fetch when tenantId becomes available
  useEffect(() => {
    if (tenantId) {
      fetchDepartements()
    }
  }, [tenantId])

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Gestion des Départements
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez les différents départements de votre cabinet, leurs coordonnées et leur activité.
          </p>
        </div>
        <div>
          <AddDepartementModal onCreated={fetchDepartements} tenantId={tenantId!} />
        </div>
      </div>

      {/* Table */}
      <TableDepartements
        data={departements}
        loading={loading}
        onRefresh={fetchDepartements}
      />
    </div>
  )
}
