'use client'

import { updateFlowInstance } from '@/api/flow'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Divider } from '@/components/Divider'
import { Cake, CheckCircle, DatabaseZap, Fingerprint, FolderArchive, LoaderCircle, Mail, Phone, Pocket, TimerReset } from 'lucide-react'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { getPatientById, TenantPatient } from '@/api/patients'
import { useRouter } from 'next/navigation'

interface PatientProps {
  saveStatus?: 'saved' | 'pending' | null
  startTime?: string
  endTime?: string
  instanceId?: string
  isCompleted?: boolean
  patientId?: string
}

export default function PatientInfoCard({ saveStatus, startTime, endTime, instanceId, isCompleted, patientId }: PatientProps) {
  const [seconds, setSeconds] = useState<number>(0)
  const [updating, setUpdating] = useState<boolean>(false)
  const [effectiveStartTime, setEffectiveStartTime] = useState<string | undefined>(startTime)
  const [totalDuration, setTotalDuration] = useState<string>('')
  const [patient, setPatient] = useState<TenantPatient | null>(null)
  
  const router = useRouter()

  useEffect(() => {
    if (!patientId) return
    getPatientById(patientId)
      .then((res: { data: any }) => setPatient(res.data))
      .catch((err: any) => console.error('Failed to fetch patient info', err))
  }, [patientId])

  useEffect(() => {
    setEffectiveStartTime(startTime)
  }, [startTime])

  // Live timer
  useEffect(() => {
    if (isCompleted) return

    let startTimestamp: number

    if (effectiveStartTime) {
      startTimestamp = new Date(effectiveStartTime).getTime()
    } else {
      const now = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS')
      setEffectiveStartTime(now)
      startTimestamp = new Date(now).getTime()
    }

    const updateSeconds = () => {
      const now = Date.now()
      const diff = Math.floor((now - startTimestamp) / 1000)
      setSeconds(diff)
    }

    updateSeconds()
    const interval = setInterval(updateSeconds, 1000)
    return () => clearInterval(interval)
  }, [effectiveStartTime, isCompleted])

  // Calculate total duration when endTime exists
  useEffect(() => {
    if (!effectiveStartTime || !endTime) return

    const startTimestamp = new Date(effectiveStartTime).getTime()
    const endTimestamp = new Date(endTime).getTime()
    if (isNaN(startTimestamp) || isNaN(endTimestamp)) return

    const diffSeconds = Math.floor((endTimestamp - startTimestamp) / 1000)
    const hours = Math.floor(diffSeconds / 3600)
    const minutes = Math.floor((diffSeconds % 3600) / 60)
    const seconds = diffSeconds % 60

    setTotalDuration(`${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`)
  }, [effectiveStartTime, endTime])

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  const timeDisplay = isNaN(hours) || isNaN(minutes) || isNaN(remainingSeconds)
    ? '0h 0m 0s'
    : `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${remainingSeconds}s`

  const handleResetTimer = async () => {
    if (!instanceId || isCompleted) return
    try {
      setUpdating(true)
      const now = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS')
      await updateFlowInstance(instanceId, { startTime: now })
      setEffectiveStartTime(now)
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  if (!patient) return <p>Loading patient info...</p>

  return (
    <Card className="p-4 mb-4 shadow-sm border border-gray-100">
      <div className="w-full flex items-start justify-between">
        <div className="flex w-full flex-row items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex flex-row gap-2 items-center">
              {patient.firstName} {patient.lastName}
            </h2>
            <div className="flex flex-row gap-4 mt-2">
              <Badge variant='neutral' className="text-sm flex flex-row gap-2 items-center">
                <Cake size={14} /> {patient.dateOfBirth ? dayjs().diff(patient.dateOfBirth, 'year') : 'N/A'} ans
              </Badge>
              <Badge variant='neutral' className="text-sm flex flex-row gap-2 items-center">
                <Fingerprint size={14} /> {patient.cin}
              </Badge>
              {patient.phone && (
                <Badge variant='neutral' className="text-sm flex flex-row gap-2 items-center">
                  <Phone size={14} /> {patient.phone}
                </Badge>
              )}
              {patient.email && (
                <Badge variant='neutral' className="text-sm flex flex-row gap-2 items-center">
                  <Mail size={14} /> {patient.email}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <Button variant='primary' className='flex flex-row items-center gap-2' onClick={() => {router.push(`/mes-patients/root/${patientId}`)}}>
              <FolderArchive />Dossier médical
            </Button>
          </div>
        </div>
      </div>

      <Divider className="my-3" />

      <div className='flex flex-row items-center justify-between'>
        {!isCompleted ? (
          <>
            <div className="flex items-center gap-2 relative">
              <span className="h-2 w-2 animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span className="absolute h-2 w-2 rounded-full bg-sky-400 opacity-75"></span>
              <p className="text-sm">
                Consultation médicale en cours
                <Badge variant='default' className='ml-2'>
                  {timeDisplay}
                </Badge>
              </p>

              <Badge
                variant='default'
                onClick={handleResetTimer}
                className='flex flex-row items-center gap-2 cursor-pointer'
              >
                <TimerReset width={18} className={updating ? 'animate-pulse' : ''} />
              </Badge>
            </div>

            {saveStatus === 'saved' && (
              <div className='flex flex-row items-center gap-2'>
                <Pocket width={18} />
                <p className='text-sm'>Changements sauvegardés avec succès</p>
              </div>
            )}

            {saveStatus === null && (
              <div className='flex flex-row items-center gap-2'>
                <DatabaseZap width={18} />
                <p className='text-sm'>Votre Flow est à jour</p>
              </div>
            )}

            {saveStatus === 'pending' && (
              <div className='flex flex-row items-center gap-2'>
                <LoaderCircle width={18} className='animate-spin' />
                <p className='text-sm'>Sauvegarde en cours...</p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <CheckCircle width={18} className="text-blue-600" />
              <p className="text-sm">
                Consultation terminée
                <Badge variant='default' className='ml-2'>
                  Durée totale: {totalDuration}
                </Badge>
              </p>
            </div>

            <div className='flex flex-row items-center gap-2'>
              <CheckCircle width={18} className="text-blue-600" />
              <p className='text-sm'>Rendez-vous clôturé avec succès</p>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
