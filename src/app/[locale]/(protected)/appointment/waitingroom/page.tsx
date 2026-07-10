'use client'

import { useEffect, useState, useRef } from 'react'
import { ArrowLeft, ArrowRight, CalendarClock, CalendarPlus, CalendarX, Monitor, Users } from 'lucide-react'
import { getAppointmentsByDoctor } from '@/api/appointments'
import { Card } from '@/components/Card'
import { Divider } from '@/components/Divider'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { useRouter } from 'next/navigation'

// Types
type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "IN_PROGRESS"
  | "ARRIVED";

type ConsultationType = "LOCAL" | "IN_PERSON" | "VIDEO";

interface Appointment {
  id: string;
  doctorProfileId: string;
  patientProfileId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  consultationType: ConsultationType;
  notes?: string;
  isUrgent: boolean;
  location?: string;
  motif?: string;
  serviceId?: string;
  doctorId?: string;
  recurring: boolean;
  patientFullName: string;
  createdAt: string;
  updatedAt: string;
  price?: number;
}

export default function SalleDAttente() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [doctorProfileId, setDoctorProfileId] = useState('')
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  const callWindowRef = useRef<Window | null>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Get doctor profile ID
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('user') || localStorage.getItem('user')
      if (stored) {
        const parsed = JSON.parse(stored)
        setDoctorProfileId(parsed?.doctorProfile?.id)
      }
    } catch (e) {
      console.error('Error loading user data:', e)
    }
  }, [])

  // Fetch appointments
  useEffect(() => {
    if (!doctorProfileId) return

    const fetchAppointments = async () => {
      setLoading(true)
      try {
        const response = await getAppointmentsByDoctor(doctorProfileId)
        const ongoing = response.data.filter(
          (a: { status: string }) => a.status === 'IN_PROGRESS' || a.status === 'ARRIVED'
        )
        setAppointments(ongoing)
        setCurrentIndex(0)
      } catch (error) {
        console.error('Error fetching appointments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
    const interval = setInterval(fetchAppointments, 30000)
    return () => clearInterval(interval)
  }, [doctorProfileId])

  const currentAppointment = appointments[currentIndex]

  const updateCallScreen = (appointment: Appointment) => {
    if (!appointment) return

    if (!callWindowRef.current || callWindowRef.current.closed) {
      callWindowRef.current = window.open(
        '',
        '_blank',
        'width=800,height=600,left=200,top=200'
      )
    }

    if (callWindowRef.current) {
      callWindowRef.current.document.body.innerHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Patient Call Display</title>
            <style>
              * { margin:0; padding:0; box-sizing:border-box; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background:white;
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-items:center;
                height:100vh;
                color:#090e1a;
                overflow:hidden;
              }
              .container { text-align:center; animation: fadeIn 0.5s ease-in; }
              h1 { font-size:2rem; font-weight:300; margin-bottom:2rem; letter-spacing:2px; text-transform:uppercase; }
              .patient-name { font-size:5rem; font-weight:700; margin:2rem 0; }
              .subtitle { font-size:1.5rem; font-weight:300; opacity:0.9; }
              @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
              @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.1); } }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Veuillez vous présenter</h1>
              <div class="patient-name">${appointment.patientFullName}</div>
              <p class="subtitle">Cabinet médical</p>
            </div>
          </body>
        </html>
      `
      callWindowRef.current.document.close()
    }
  }

  const handleNext = () => {
    if (currentIndex < appointments.length - 1) {
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      updateCallScreen(appointments[newIndex])
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      updateCallScreen(appointments[newIndex])
    }
  }

  const handleSelectPatient = (index: number) => {
    setCurrentIndex(index)
    updateCallScreen(appointments[index])
  }

  const handleCallPatient = () => {
    if (currentAppointment) updateCallScreen(currentAppointment)
  }

  const goToCreateAppointment = () => {
    if (!mounted) return
    router.push('/appointment/create')
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Chargement des rendez-vous...</p>
        </div>
      </div>
    )
  }

  if (!currentAppointment) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-8">
          <CalendarX className="w-24 h-24 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Aucun rendez-vous en cours</h2>
          <p>La salle d&apos;attente est vide pour le moment.</p>
          <Button variant="primary" className="mt-4" onClick={goToCreateAppointment}>
            <CalendarPlus width={18} className="mr-2" />
            Ajouter Un Rendez-vous
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full">
          <Card className="overflow-hidden">
            <div className=" flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-medium opacity-90">Patient actuel</p>
                  <p className="text-xs opacity-75">Rendez-vous {currentIndex + 1} sur {appointments.length}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{currentAppointment.date}</p>
                <p className="text-xs opacity-75">{currentAppointment.startTime}</p>
              </div>
            </div>

            <Divider />

            <div className="grid grid-cols-4">
              <Card
                className="flex flex-col items-center justify-center text-gray-500 col-span-1 cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-900/30 transition-all duration-300"
                onClick={handlePrev}
              >
                <ArrowLeft className="w-24 h-24" strokeWidth={1} />
              </Card>
              <div className="p-12 text-center col-span-2">
                <div className="mb-8">
                  <Card className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl font-bold">{currentAppointment.patientFullName.charAt(0)}</span>
                  </Card>
                  <h2 className="text-4xl font-bold mb-2">{currentAppointment.patientFullName}</h2>
                  <Badge className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    {currentAppointment.status === 'IN_PROGRESS' ? 'En consultation' : 'Arrivé'}
                  </Badge>
                </div>
                <button onClick={handleCallPatient} className="group relative px-12 py-4 bg-blue-500 text-white rounded-2xl font-semibold text-lg transition-all duration-200 transform">
                  <span className="flex items-center justify-center gap-3"><Monitor className="w-6 h-6" /> Appeler le patient</span>
                </button>
                <p className="text-sm text-gray-500 mt-3">Affichera le nom sur l&apos;écran externe</p>
              </div>
              <Card
                className="flex flex-col items-center justify-center text-gray-500 col-span-1 cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-900/30  transition-all duration-300"
                onClick={handleNext}
              >
                <ArrowRight className="w-24 h-24" strokeWidth={1} />
              </Card>
            </div>
          </Card>

          {appointments.length > 1 && (
            <Card className="mt-6 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" /> File d&apos;attente
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {appointments.map((apt, idx) => (
                  <div
                    key={apt.id}
                    onClick={() => handleSelectPatient(idx)}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${idx === currentIndex ? 'bg-blue-600 text-white' : ''}`}
                  >
                    <p className="font-semibold">{apt.patientFullName}</p>
                    <p className="text-xs opacity-75">{apt.startTime}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
