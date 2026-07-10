"use client"
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { RiExternalLinkLine, RiTimeLine } from '@remixicon/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { DoctorAvailabilityDialog } from './DoctorAvailabilityDialog'

interface FormState {
    selectedPatientId: string | null
    doctorId: string
    date: Date | undefined
    price: number | undefined
    motif: string
    note: string
    locationType: string | null
    serviceId: string | null
    inWaitingRoom: boolean
    isUrgent: boolean
    placelocation: string | null
}

export default function UnavailableDateNotice({ doctorId }: FormState) {
    const [isOpen, setIsOpen] = React.useState(true)
    const [connecteddoctorId, setConnectedDoctorId] = React.useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const stored = localStorage.getItem("user")
        if (stored) {
            try {
                const user = JSON.parse(stored)
                setConnectedDoctorId(user?.doctorProfile?.id ?? null)
            } catch (error) {
                console.error("Failed to load preferences:", error)
            }
        }
    }, [])

    return isOpen ? (
        <Card className="relative bg-blue-50  border mb-4 px-3 py-2">
            <div className="flex items-center gap-3">
                <div className="inline-flex shrink-0 rounded-full bg-blue-950 p-1.5 dark:bg-blue-800/70">
                    <span className="flex size-6 items-center justify-center rounded-full bg-blue-500 dark:bg-blue-500">
                        <RiTimeLine className="size-3.5 text-white" aria-hidden={true} />
                    </span>
                </div>

                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Date Disponible
                    </p>
                    <p className="text-xs text-gray-800 dark:text-gray-200">
                        Consultez les disponibilités du médecin avant de planifier un rendez-vous.
                    </p>
                </div>

                <div className="flex items-center gap-1.5">
                    {doctorId && <DoctorAvailabilityDialog doctorId={doctorId} />}
                    {connecteddoctorId === doctorId && (
                        <Button
                            variant="ghost"
                            className="text-blue-500 hover:bg-transparent dark:text-blue-400 hover:dark:bg-transparent text-xs px-1.5"
                            onClick={() => router.push("/settings?tab=disponibility")}
                        >
                            <span className="inline-flex items-center gap-1">
                                Modifier
                                <RiExternalLinkLine className="size-3.5" aria-hidden={true} />
                            </span>
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    ) : null
}
