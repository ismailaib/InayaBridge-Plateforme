'use client'

import { Card } from '@/components/Card'
import { Divider } from '@/components/Divider'
import { Badge } from '@/components/Badge'
import { Cake, Fingerprint, FolderArchive, Mail, PersonStanding, Phone, User } from 'lucide-react'
import { Button } from '@/components/Button'
import { useEffect, useState } from 'react'

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
}

export default function PatientInfoCard(patient: PatientProps) {
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
                {patient.patient.name}
              </h2>
              <div className="flex flex-row gap-4 mt-2">
                <Badge variant='neutral' className="text-sm flex flex-row gap-2 items-center">
                  <Cake size={14} /> {patient.patient.age} ans
                </Badge>
                <Badge variant='neutral' className="text-sm flex flex-row gap-2 items-center">
                  <Fingerprint size={14} /> {patient.patient.cin}
                </Badge>
                {patient.patient.phone && (
                  <Badge variant='neutral' className="text-sm flex flex-row gap-2 items-center">
                    <Phone size={14} /> {patient.patient.phone}
                  </Badge>
                )}
                {patient.patient.email && (
                  <Badge variant='neutral' className="text-sm flex flex-row gap-2 items-center">
                    <Mail size={14} /> {patient.patient.email}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row gap-4">
                <Button variant='primary' className='flex items-center gap-2'><FolderArchive />Dossier médical</Button>
                <Button variant='secondary'><PersonStanding /></Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider className="my-3" />
      <span className="h-4 w-4 animate-ping rounded-full bg-sky-400 opacity-75"></span>
      <p className="text-sm">
        Consultation médical en cours - {minutes}m {remainingSeconds}s
      </p>
    </Card>
  )
}
