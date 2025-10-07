'use client'

import { Button } from '@/components/Button'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { showToast } from '../../dashboard/hooks/utils'
import TableEmployees from './components/TableEmployees'
import AddEmployeeModal from './components/AddEmployeeModal'

export default function EmployeesPage() {
  const [loading, setLoading] = useState(true)

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      // TODO: Replace with API call
    } catch (err) {
      showToast('error', 'Erreur de chargement', 'Impossible de charger les employés.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Gestion des Employés
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Consultez et gérez les employés de votre cabinet, leurs rôles et leur statut.
          </p>
        </div>
        <div>
          <AddEmployeeModal />
        </div>
      </div>

      <TableEmployees />
    </div>
  )
}
