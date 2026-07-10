'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Appointment } from '@/api/appointments'
import { Button } from '@/components/Button'
import { Download, Share2, Trash2 } from 'lucide-react'
import Print from './Print'
import { deleteAppointment } from '@/api/appointments'
import { showToast } from '@/app/[locale]/(protected)/dashboard/hooks/utils'

interface AppointmentHeaderProps {
  appointment: Appointment
  onBack?: () => void
  onPrint?: () => void
  onExport?: () => void
  onShare?: () => void
  onEdit?: () => void
  onDeleted?: () => void
}

export const AppointmentHeader = ({
  appointment,
  onExport,
  onShare,
  onDeleted,
}: AppointmentHeaderProps) => {
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const parsed = JSON.parse(stored)
        setTenantId(parsed?.doctorProfile?.tenantId ?? null)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }

    if (!appointment?.id) return

    setDeleting(true)
    try {
      await deleteAppointment(appointment.id)
      showToast('success', 'Supprimé', 'Le rendez-vous a été supprimé avec succès')
      router.push('/appointment')
      onDeleted?.()
    } catch (err) {
      console.error(err)
      showToast('error', 'Erreur', 'Impossible de supprimer le rendez-vous')
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col items-start">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Détails du rendez-vous
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Cette page représente les détails du rendez-vous
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onExport && (
            <Button variant="secondary" onClick={onExport}>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          )}
          {onShare && (
            <Button variant="secondary" onClick={onShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
          )}
          <Print appointmentId={appointment.id} tenantId={tenantId ?? ''} />

          <Button
            variant={confirmDelete ? 'destructive' : 'destructive'}
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 width={18} className='mr-2 mb-[0.5]' />
            {deleting
              ? 'Suppression...'
              : confirmDelete
                ? 'Êtes-vous sûr ?'
                : 'Supprimer'}
          </Button>
        </div>
      </div>
    </div>
  )
}
