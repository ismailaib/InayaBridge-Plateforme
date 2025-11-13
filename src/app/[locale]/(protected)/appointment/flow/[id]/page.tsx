'use client'

import { createFlowInstance, deleteFlowInstance, FlowInstanceDto, FlowTemplateDto, getFlowInstanceByAppointment, getTemplateById, getTemplatesByDoctor, updateFlowInstance } from '@/api/flow'
import { Button } from '@/components/Button'
import { Divider } from '@/components/Divider'
import { AnimatePresence } from 'framer-motion'
import { Replace } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import DynamicFormStep from './components/DynamicFormStep'
import FlowSelector from './components/FlowSelector'
import FlowSwipeModal from './components/FlowSwipeModal'
import PatientInfoCard from './components/PatientInfoCard'
import StepNavigator from './components/StepNavigator'
import { AppointmentFlowProvider } from './context/AppointmentFlowContext'
import { useAppointmentFlow } from './hooks/useAppointmentFlow'

export default function AppointmentFlowPage() {
  return (
    <AppointmentFlowProvider>
      <AppointmentFlowContent />
    </AppointmentFlowProvider>
  )
}

function AppointmentFlowContent() {
  const { id } = useParams()
  const [flows, setFlows] = useState<FlowTemplateDto[]>([])
  const [selectedFlow, setSelectedFlow] = useState<FlowTemplateDto | null>(null)
  const [instance, setInstance] = useState<FlowInstanceDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [showChangeModal, setShowChangeModal] = useState(false)
  const [isPreserving, setIsPreserving] = useState(false)
  const [preservedData, setPreservedData] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'pending' | null>(null)
  const lastSavedDataRef = useRef<string>('')
  const isInitialLoadRef = useRef(true)
  const { formData, setFormData, currentStepIndex, setCurrentStepIndex } = useAppointmentFlow()
  const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  const parsed = stored ? JSON.parse(stored) : null
  const doctorId = parsed?.doctorProfile?.id

  useEffect(() => {
    if (!doctorId || !id) return
    setLoading(true)
    isInitialLoadRef.current = true
    let instancePromise = getFlowInstanceByAppointment(id as string)
    instancePromise
      .then((instRes) => {
        const inst = instRes.data
        if (inst) {
          setInstance(inst)
          return getTemplateById(inst.templateId).then((templRes) => {
            setSelectedFlow(templRes.data)
            const savedData = inst.data || '{}'
            const parsedData = JSON.parse(savedData)
            console.log('parsedData', parsedData)
            setFormData(parsedData)
            lastSavedDataRef.current = savedData
          })
        } else {
          return Promise.resolve()
        }
      })
      .then(() => getTemplatesByDoctor(doctorId))
      .then((flowsRes) => {
        if (flowsRes) setFlows(flowsRes.data)
      })
      .catch((err) => {
        console.error('Error fetching data:', err)
      })
      .finally(() => {
        setLoading(false)
        isInitialLoadRef.current = false
      })
  }, [doctorId, id, setFormData])

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (isInitialLoadRef.current) return
    const currentData = JSON.stringify(formData)
    if (currentData !== lastSavedDataRef.current) {
      setHasUnsavedChanges(true)
      setSaveStatus('pending')
    }
  }, [formData])
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (!hasUnsavedChanges) return
    timeoutRef.current = setTimeout(() => {
      if (instance?.id) {
        const currentData = JSON.stringify(formData)
        if (currentData !== lastSavedDataRef.current) {
          updateFlowInstance(instance.id, { data: currentData })
            .then(() => {
              lastSavedDataRef.current = currentData
              setHasUnsavedChanges(false)
              setSaveStatus('saved')
              setTimeout(() => setSaveStatus(null), 3000)
            })
            .catch((err) => console.error('Error saving instance:', err))
        }
      }
    }, 1000)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [formData, instance, hasUnsavedChanges])
  useEffect(() => {
    if (isInitialLoadRef.current) return
    if (instance?.id && hasUnsavedChanges) {
      const currentData = JSON.stringify(formData)
      if (currentData !== lastSavedDataRef.current) {
        updateFlowInstance(instance.id, { data: currentData })
          .then(() => {
            lastSavedDataRef.current = currentData
            setHasUnsavedChanges(false)
            setSaveStatus('saved')
            setTimeout(() => setSaveStatus(null), 3000)
          })
          .catch((err) => console.error('Error saving instance:', err))
      }
    }
  }, [currentStepIndex])
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
        deleteFlowInstance(instance.id).catch(() => { })
        setInstance(null)
      }
    } else {
      setShowChangeModal(true)
    }
  }
  const handleConfirmChange = (preserve: boolean) => {
    setShowChangeModal(false)
    setIsPreserving(preserve)
    if (preserve) {
      setPreservedData(JSON.stringify(formData))
    } else {
      setPreservedData(null)
      setFormData({})
    }
    setCurrentStepIndex(0)
    setSelectedFlow(null)
    if (instance?.id) {
      deleteFlowInstance(instance.id).catch(() => { })
    }
  }
  const handleSelectFlow = async (flow: FlowTemplateDto) => {
    try {
      const schemaParsed = JSON.parse(flow.schema)

      const allFields = schemaParsed.sections.flatMap((s: any) =>
        s.fields ? s.fields.map((f: any) => f.name) : []
      )

      console.log('All fields in new schema:', allFields)

      let dataToUse: Record<string, any> = {}
      if (isPreserving && preservedData) {
        const preserved = JSON.parse(preservedData)
        console.log('Preserved data:', preserved)
        console.log('Preserved keys:', Object.keys(preserved))

        dataToUse = Object.fromEntries(
          Object.entries(preserved).filter(([key]) => {
            const isIncluded = allFields.includes(key)
            console.log(`Field "${key}": ${isIncluded ? 'INCLUDED' : 'EXCLUDED'}`)
            return isIncluded
          })
        )
        console.log('Final data to use:', dataToUse)
      }
      setFormData(dataToUse)
      setIsPreserving(false)
      setPreservedData(null)
      const res = await createFlowInstance({
        templateId: flow.id,
        appointmentId: id as string,
      })
      const instId = res.data
      const dataStr = JSON.stringify(dataToUse)
      const currentInstance = {
        id: instId,
        templateId: flow.id,
        appointmentId: id as string,
        data: dataStr,
      }
      setInstance(currentInstance)
      await updateFlowInstance(instId, { data: dataStr })
      lastSavedDataRef.current = dataStr
      setHasUnsavedChanges(false)
      setSelectedFlow(flow)
    } catch (err) {
      console.error('Error selecting flow:', err)
    }
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
      <PatientInfoCard patient={patient} saveStatus={saveStatus} startTime={instance?.startTime} instanceId={instance?.id} />
      <Divider />
      {!selectedFlow && (
        <FlowSelector flows={flows} onSelectFlow={handleSelectFlow} />
      )}
      {selectedFlow && totalSteps > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{selectedFlow.name}</h2>
            <Button onClick={handleChangeFlow} className='flex flex-row items-center gap-2' variant='secondary' >
              <Replace width={18} /> Changer de Flow
            </Button>
          </div>
          <DynamicFormStep selectedFlow={selectedFlow} />
          <StepNavigator totalSteps={totalSteps}/>
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
