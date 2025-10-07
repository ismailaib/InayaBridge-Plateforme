'use client'

import { Button } from '@/components/Button'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { showToast } from '../../dashboard/hooks/utils'
import TableServices from './components/TableService'
import AddServiceModal from './components/AddServiceModal'

export default function ServicesPage() {
  const [loading, setLoading] = useState(true)

  const fetchServices = async () => {
    try {
      setLoading(true)
      // TODO: Replace with API call
    } catch (err) {
      showToast('error', 'Erreur de chargement', 'Impossible de charger les services.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Gestion des Services
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configurez et gérez les services proposés par votre cabinet médical.
          </p>
        </div>
        <div>
          <AddServiceModal />
        </div>
      </div>

      <TableServices />
    </div>
  )
}
