'use client'

import { getEmployees } from '@/api/employees'
import { Card } from '@/components/Card'
import { useEffect, useState } from 'react'
import { showToast } from '../../dashboard/hooks/utils'
import AddEmployeeModal from './components/AddEmployeeModal'
import TableEmployees from './components/TableEmployees'

export default function EmployeesPage() {
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState<any[]>([])
  const [tenantId, setTenantId] = useState<string>('')

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

  const fetchEmployees = async (id: string) => {
    if (!id) return
    try {
      setLoading(true)
      const res = await getEmployees(id)
      setEmployees(res.data)
    } catch (err) {
      showToast('error', 'Erreur de chargement', 'Impossible de charger les employés.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tenantId) fetchEmployees(tenantId)
  }, [tenantId])

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Gestion des Employés
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Consultez et gérez les employés et les invitations envoyées.
          </p>
        </div>
        <AddEmployeeModal onSuccess={() => fetchEmployees(tenantId)} tenantId={tenantId} />
      </div>

      <Card className="p-6">
        <TableEmployees
          loading={loading}
          employees={employees}
          refresh={() => fetchEmployees(tenantId)}
          tenantId={tenantId} 
        />
      </Card>
    </div>
  )
}
