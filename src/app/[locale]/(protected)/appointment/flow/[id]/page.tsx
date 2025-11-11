'use client'

import { SetStateAction, useEffect, useState, useCallback, useRef } from 'react'
import { Divider } from '@/components/Divider'
import DynamicFormStep from './components/DynamicFormStep'
import PatientInfoCard from './components/PatientInfoCard'
import StepNavigator from './components/StepNavigator'
import { AppointmentFlowProvider } from './context/AppointmentFlowContext'
import { useAppointmentFlow } from './hooks/useAppointmentFlow'
import FlowSelector from './components/FlowSelector'
import { useParams } from 'next/navigation'
import { FlowTemplateDto, getTemplatesByDoctor, getTemplateById, FlowInstanceDto, getFlowInstanceByAppointment, createFlowInstance, updateFlowInstance, deleteFlowInstance } from '@/api/flow'
import { motion, AnimatePresence } from 'framer-motion'
import { Replace } from 'lucide-react'
import { Button } from '@/components/Button'
import FlowSwipeModal from './components/FlowSwipeModal'

export default function AppointmentFlowPage() {
  return (
    <AppointmentFlowProvider>
      <AppointmentFlowContent />
    </AppointmentFlowProvider>
  )
}

function AppointmentFlowContent() {
  const { id } = useParams() // appointment id
  const [flows, setFlows] = useState<FlowTemplateDto[]>([])
  const [selectedFlow, setSelectedFlow] = useState<FlowTemplateDto | null>(null)
  const [instance, setInstance] = useState<FlowInstanceDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [showChangeModal, setShowChangeModal] = useState(false)
  const [isPreserving, setIsPreserving] = useState(false)

  const { formData, setFormData, currentStepIndex, setCurrentStepIndex } = useAppointmentFlow()

  // Replace with real doctor ID (from auth context/localStorage)
  const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  const parsed = stored ? JSON.parse(stored) : null
  const doctorId = parsed?.doctorProfile?.id

  useEffect(() => {
    if (!doctorId || !id) return
    setLoading(true)
    getFlowInstanceByAppointment(id as string)
      .then((instRes) => {
        const inst = instRes.data
        if (inst) {
          setInstance(inst)
          getTemplateById(inst.templateId)
            .then((templRes) => {
              setSelectedFlow(templRes.data)
              const parsedData = JSON.parse(inst.data || '{}')
              setFormData(parsedData)
            })
            .catch((err) => console.error('Error fetching template:', err))
        }
        return getTemplatesByDoctor(doctorId)
      })
      .then((flowsRes) => {
        if (flowsRes) setFlows(flowsRes.data)
      })
      .catch((err) => console.error('Error fetching data:', err))
      .finally(() => setLoading(false))
  }, [doctorId, id, setFormData])

  // Save on unmount
  useEffect(() => {
    return () => {
      if (instance?.id) {
        updateFlowInstance(instance.id, { data: JSON.stringify(formData) }).catch(() => {})
      }
    }
  }, [])

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      if (instance?.id) {
        updateFlowInstance(instance.id, { data: JSON.stringify(formData) })
          .catch((err) => console.error('Error saving instance:', err))
      }
    }, 1000)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [formData, instance])

  useEffect(() => {
    if (instance?.id) {
      updateFlowInstance(instance.id, { data: JSON.stringify(formData) })
        .catch((err) => console.error('Error saving instance:', err))
    }
  }, [currentStepIndex, instance])

  // Calculate total steps from selected flow (excluding Start Node)
  const parsedSchema = selectedFlow?.schema ? JSON.parse(selectedFlow.schema) : null
  const allSections = parsedSchema?.sections || []
  const filteredSections = allSections.filter(
    (section: any) => section.title !== 'Start Node' && section.id !== '1'
  )
  const totalSteps = filteredSections.length

  const patient = {
    name: 'Fatima Zahra Benali',
    age: 34,
    cin: 'AB123456',
    phone: '+212 612345678',
    email: 'fatimazahra@example.com',
    status: 'active' as 'active',
  }

  const handleChangeFlow = () => {
    if (Object.keys(formData).length === 0) {
      setCurrentStepIndex(0)
      setSelectedFlow(null)
      if (instance?.id) {
        deleteFlowInstance(instance.id).catch(() => {})
        setInstance(null)
      }
    } else {
      setShowChangeModal(true)
    }
  }

  const handleConfirmChange = (preserve: boolean) => {
    setShowChangeModal(false)
    setIsPreserving(preserve)
    if (!preserve) {
      setFormData({})
    }
    setCurrentStepIndex(0)
    setSelectedFlow(null)
    if (instance?.id) {
      deleteFlowInstance(instance.id).catch(() => {})
      setInstance(null)
    }
  }

  const handleSelectFlow = (flow: FlowTemplateDto) => {
    const schemaParsed = JSON.parse(flow.schema)
    const allFields = schemaParsed.sections.flatMap((s: any) =>
      s.fields ? s.fields.map((f: any) => f.name) : []
    )

    let dataToUse: Record<string, any> = {}
    if (isPreserving) {
      dataToUse = Object.fromEntries(
        Object.entries(formData).filter(([key]) => allFields.includes(key))
      )
    }
    setFormData(dataToUse)
    setIsPreserving(false)

    createFlowInstance({ templateId: flow.id, appointmentId: id as string })
      .then((res) => {
        const instId = res.data
        setInstance({
          id: instId,
          templateId: flow.id,
          appointmentId: id as string,
          data: JSON.stringify(dataToUse),
        })
        updateFlowInstance(instId, { data: JSON.stringify(dataToUse) }).catch(() => {})
        setSelectedFlow(flow)
      })
      .catch((err) => console.error('Error creating instance:', err))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Chargement des flows...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-32 overflow-hidden p-4 md:p-8">
      <PatientInfoCard patient={patient} />
      <Divider />

      {!selectedFlow && (
        <FlowSelector flows={flows} onSelectFlow={handleSelectFlow} />
      )}

      {selectedFlow && totalSteps > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{selectedFlow.name}</h2>
            <Button onClick={handleChangeFlow} className='flex flex-row items-center gap-2' variant='ghost' >
              <Replace width={18}/> Changer de Flow
            </Button>
          </div>
          <DynamicFormStep selectedFlow={selectedFlow} />
          <StepNavigator totalSteps={totalSteps} />
        </>
      )}

      {selectedFlow && totalSteps === 0 && (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">
            Ce flow ne contient aucune étape valide.
          </p>
        </div>
      )}
      <AnimatePresence>
        {showChangeModal && (
          <FlowSwipeModal
            selectedFlow={selectedFlow}
            totalSteps={totalSteps}
            showChangeModal={showChangeModal}
            onCloseModal={() => setShowChangeModal(false)}
            onConfirmChange={handleConfirmChange}
          />
        )}
      </AnimatePresence>
    </div>
  )
}