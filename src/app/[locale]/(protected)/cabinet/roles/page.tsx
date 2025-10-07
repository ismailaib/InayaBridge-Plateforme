'use client'

import { Button } from '@/components/Button'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { showToast } from '../../dashboard/hooks/utils'
import TableRoles from './components/TableRoles'
import AddRoleModal from './components/AddRoleModal'

export default function RolesPage() {
  const [loading, setLoading] = useState(true)

  const fetchRoles = async () => {
    try {
      setLoading(true)
      // TODO: Replace with API call
    } catch (err) {
      showToast('error', 'Erreur de chargement', 'Impossible de charger les rôles.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Gestion des Rôles
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Définissez les rôles et permissions des membres de votre cabinet pour un meilleur contrôle d’accès.
          </p>
        </div>
        <div>
          <AddRoleModal />
        </div>
      </div>

      <TableRoles />
    </div>
  )
}
