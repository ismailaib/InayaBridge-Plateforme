'use client'

import { Button } from '@/components/Button'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { showToast } from '../../dashboard/hooks/utils'
import TableDepartements from './components/TableDepartements'
import AddDepartementModal from './components/AddDepartementModal'

export default function DepartementsPage() {
  const [loading, setLoading] = useState(true)

  const fetchDepartements = async () => {
    try {
      setLoading(true)
      // TODO: Replace with API call
    } catch (err) {
      showToast('error', 'Erreur de chargement', 'Impossible de charger les départements.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartements()
  }, [])

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
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
          <AddDepartementModal />
        </div>
      </div>

      <TableDepartements />
    </div>
  )
}
