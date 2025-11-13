'use client'

import { updateFlowInstance } from '@/api/flow'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Divider } from '@/components/Divider'
import { Cake, DatabaseZap, Fingerprint, FolderArchive, LoaderCircle, Mail, Phone, Pocket, TimerReset } from 'lucide-react'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

interface PatientInfoCardProps {
  name: string
  age: number
  cin: string
  phone?: string
  email?: string
  status?: 'active' | 'inactive' | 'new'
}

interface PatientProps {
  patient: PatientInfoCardProps
  saveStatus?: 'saved' | 'pending' | null
  startTime?: string
  instanceId?: string
}

export default function PatientInfoCard({ patient, saveStatus, startTime, instanceId }: PatientProps) {
  const [seconds, setSeconds] = useState<number>(0)
  const [updating, setUpdating] = useState<boolean>(false)
  const [effectiveStartTime, setEffectiveStartTime] = useState<string | undefined>(startTime)

  useEffect(() => {
    setEffectiveStartTime(startTime)
  }, [startTime])

  useEffect(() => {
    if (!effectiveStartTime) return
    const startTimestamp = new Date(effectiveStartTime).getTime()
    if (isNaN(startTimestamp)) return

    const updateSeconds = () => {
      const now = Date.now()
      const diff = Math.floor((now - startTimestamp) / 1000)
      setSeconds(diff)
    }

    updateSeconds()
    const interval = setInterval(updateSeconds, 1000)
    return () => clearInterval(interval)
  }, [effectiveStartTime])

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  const timeDisplay = isNaN(hours) || isNaN(minutes) || isNaN(remainingSeconds)
    ? '0h 0m 0s'
    : `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${remainingSeconds}s`

  const handleResetTimer = async () => {
    if (!instanceId) return
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

  return (
    <Card className="p-4 mb-4 shadow-sm border border-gray-100">
      <div className="w-full flex items-start justify-between">
        <div className="flex w-full flex-row items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex flex-row gap-2 items-center">
              {patient.name}
            </h2>
            <div className="flex flex-row gap-4 mt-2">
              <Badge variant='neutral' className="text-sm flex flex-row gap-2 items-center">
                <Cake size={14} /> {patient.age} ans
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
            <Button variant='primary' className='flex flex-row items-center gap-2'>
              <FolderArchive />Dossier médical
            </Button>
          </div>
        </div>
      </div>

      <Divider className="my-3" />

      <div className='flex flex-row items-center justify-between'>
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
            className='flex flex-row items-center gap-2'
          >
            <TimerReset width={18} className={updating ? 'animate-pulse' : 'cursor-pointer'} />
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
      </div>
    </Card>
  )
}