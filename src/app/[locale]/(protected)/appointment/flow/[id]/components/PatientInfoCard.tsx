'use client'

import { Card } from '@/components/Card'
import { Divider } from '@/components/Divider'
import { Badge } from '@/components/Badge'
import { Cake, DatabaseZap, Fingerprint, FolderArchive, Mail, PersonStanding, Phone } from 'lucide-react'
import { Button } from '@/components/Button'
import { useEffect, useState } from 'react'
import PainLocationModal from './PainLocationModal'

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
}

export default function PatientInfoCard({ patient, saveStatus }: PatientProps) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return (
    <Card className="p-4 mb-4 shadow-sm border border-gray-100">
      <div>
        <div className="w-full flex items-start justify-between">
          <div className="flex w-full flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold flex flex-row gap-2 items-center ">
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
            <div className="flex flex-col">
              <div className="flex flex-row gap-4">
                <Button variant='primary' className='flex flex-row items-center gap-2'><FolderArchive />Dossier médical</Button>
                <PainLocationModal />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider className="my-3" />
      <div className='flex flex-row items-center justify-between'>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="absolute h-2 w-2 rounded-full bg-sky-400 opacity-75"></span>
          <p className="text-sm">Consultation médical en cours
            <Badge variant='default' className='ml-2'>
              {minutes}m {remainingSeconds}s
            </Badge>
          </p>
        </div>
        {saveStatus === 'saved' && (
          <div className='flex flex-row items-center gap-2'>
            <DatabaseZap width={18}/>
            <p className='text-sm'>Changements Sauvegardé avec succès</p>
          </div>
        )}
        {saveStatus === 'pending' && (
          <div className='flex flex-row items-center gap-2'>
            <DatabaseZap width={18}/>
            <p className='text-sm'>Cliquez sur suivant pour sauvegarder</p>
          </div>
        )}
      </div>

    </Card>
  )
}