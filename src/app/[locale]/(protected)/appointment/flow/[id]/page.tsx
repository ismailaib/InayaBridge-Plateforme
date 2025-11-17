'use client'

import { createFlowInstance, deleteFlowInstance, FlowInstanceDto, FlowTemplateDto, getFlowInstanceByAppointment, getTemplateById, getTemplatesByDoctor, updateFlowInstance } from '@/api/flow'
import { Appointment, getAppointmentById, updateAppointment } from '@/api/appointments'
import { Button } from '@/components/Button'
import { Divider } from '@/components/Divider'
import { AnimatePresence } from 'framer-motion'
import { Replace, RouteOff } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useCallback } from 'react'
import DynamicFormStep from './components/DynamicFormStep'
import FlowSelector from './components/FlowSelector'
import FlowSwipeModal from './components/FlowSwipeModal'
import PatientInfoCard from './components/PatientInfoCard'
import StepNavigator from './components/StepNavigator'
import { AppointmentFlowProvider } from './context/AppointmentFlowContext'
import { useAppointmentFlow } from './hooks/useAppointmentFlow'
import DiagnosticsSuiteModal from '@/components/DiagnosticsSuiteModal'
import LoadingState from '@/components/custom/LoadingState'
import { STATIC_STEPS } from './components/staticSteps'

// Constants
const AUTO_SAVE_DELAY = 1000
const SAVE_STATUS_DISPLAY_DURATION = 3000
const DELETE_CONFIRMATION_TIMEOUT = 3000

// Types
type SaveStatus = 'saved' | 'pending' | null

// Utility functions
const parseFlowSchema = (schema: string | null) => {
  if (!schema) return null
  try {
    return JSON.parse(schema)
  } catch {
    return null
  }
}

const getFilteredSections = (schema: any) => {
  const allSections = schema?.sections || []
  return allSections.filter(
    (section: any) => section.title !== 'Start Node' && section.id !== '1'
  )
}

const getAllFieldNames = (schema: any): string[] => {
  return schema.sections.flatMap((s: any) =>
    s.fields ? s.fields.map((f: any) => f.name) : []
  )
}

const filterPreservedData = (preserved: Record<string, any>, allowedFields: string[]) => {
  return Object.fromEntries(
    Object.entries(preserved).filter(([key]) => allowedFields.includes(key))
  )
}

const getUserData = () => {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('user')
  return stored ? JSON.parse(stored) : null
}

// Custom hooks
const useAutoSave = (
  formData: Record<string, any>,
  instance: FlowInstanceDto | null,
  isCompleted: boolean,
  isInitialLoad: boolean
) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(null)
  const lastSavedDataRef = useRef<string>('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Detect changes
  useEffect(() => {
    if (isInitialLoad || isCompleted) return

    const currentData = JSON.stringify(formData)
    if (currentData !== lastSavedDataRef.current) {
      setHasUnsavedChanges(true)
      setSaveStatus('pending')
    }
  }, [formData, isCompleted, isInitialLoad])

  // Auto-save with debounce
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (!hasUnsavedChanges || isCompleted || !instance?.id) return

    timeoutRef.current = setTimeout(async () => {
      const currentData = JSON.stringify(formData)
      if (currentData !== lastSavedDataRef.current) {
        try {
          await updateFlowInstance(instance.id, { data: currentData })
          lastSavedDataRef.current = currentData
          setHasUnsavedChanges(false)
          setSaveStatus('saved')
          setTimeout(() => setSaveStatus(null), SAVE_STATUS_DISPLAY_DURATION)
        } catch (err) {
          console.error('Error saving instance:', err)
        }
      }
    }, AUTO_SAVE_DELAY)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [formData, instance, hasUnsavedChanges, isCompleted])

  return { saveStatus, lastSavedDataRef, setHasUnsavedChanges, setSaveStatus }
}

// Main component
export default function AppointmentFlowPage() {
  return (
    <AppointmentFlowProvider>
      <AppointmentFlowContent />
    </AppointmentFlowProvider>
  )
}

function AppointmentFlowContent() {
  const { id } = useParams()
  const router = useRouter()
  const { formData, setFormData, currentStepIndex, setCurrentStepIndex } = useAppointmentFlow()
  const [appointment, setAppointment] = useState<Appointment | null>(null)

  useEffect(() => {
    if (!id || Array.isArray(id)) return
    getAppointmentById(id).then(res => setAppointment(res.data))
  }, [id])

  // State
  const [flows, setFlows] = useState<FlowTemplateDto[]>([])
  const [selectedFlow, setSelectedFlow] = useState<FlowTemplateDto | null>(null)
  const [instance, setInstance] = useState<FlowInstanceDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [showChangeModal, setShowChangeModal] = useState(false)
  const [isPreserving, setIsPreserving] = useState(false)
  const [preservedData, setPreservedData] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Refs
  const isInitialLoadRef = useRef(true)

  // Derived state
  const userData = getUserData()
  const doctorId = userData?.doctorProfile?.id
  const isCompleted = instance?.endTime != null
  const parsedSchema = parseFlowSchema(selectedFlow?.schema || null)
  const filteredSections = getFilteredSections(parsedSchema)
  
  // UPDATED: Include static steps in total count
  const totalSteps = filteredSections.length + STATIC_STEPS.length

  // Auto-save hook
  const { saveStatus, lastSavedDataRef, setHasUnsavedChanges, setSaveStatus } = useAutoSave(
    formData,
    instance,
    isCompleted,
    isInitialLoadRef.current
  )

  // Save on step change
  useEffect(() => {
    if (isInitialLoadRef.current || isCompleted || !instance?.id) return

    const currentData = JSON.stringify(formData)
    if (currentData !== lastSavedDataRef.current) {
      updateFlowInstance(instance.id, { data: currentData })
        .then(() => {
          lastSavedDataRef.current = currentData
          setHasUnsavedChanges(false)
          setSaveStatus('saved')
          setTimeout(() => setSaveStatus(null), SAVE_STATUS_DISPLAY_DURATION)
        })
        .catch((err) => console.error('Error saving instance:', err))
    }
  }, [currentStepIndex, isCompleted, instance, formData, setHasUnsavedChanges, setSaveStatus])

  // Load initial data
  useEffect(() => {
    if (!doctorId || !id) return

    const loadData = async () => {
      setLoading(true)
      isInitialLoadRef.current = true

      try {
        // Load flow instance
        const instRes = await getFlowInstanceByAppointment(id as string)
        const inst = instRes.data

        if (inst) {
          setInstance(inst)

          // Load template
          const templRes = await getTemplateById(inst.templateId)
          setSelectedFlow(templRes.data)

          // Parse and set form data
          const savedData = inst.data || '{}'
          const parsedData = JSON.parse(savedData)
          setFormData(parsedData)
          lastSavedDataRef.current = savedData
        }

        // Load available flows
        const flowsRes = await getTemplatesByDoctor(doctorId)
        if (flowsRes) setFlows(flowsRes.data)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
        isInitialLoadRef.current = false
      }
    }

    loadData()
  }, [doctorId, id, setFormData])

  // Handlers
  const handleChangeFlow = useCallback(() => {
    if (isCompleted) return

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
  }, [isCompleted, formData, instance, setCurrentStepIndex])

  const handleDeleteFlow = useCallback(() => {
    if (isCompleted) return

    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), DELETE_CONFIRMATION_TIMEOUT)
      return
    }

    if (instance?.id) {
      deleteFlowInstance(instance.id).catch(() => { })
      updateAppointment(instance.appointmentId, { status: 'PENDING' })
      router.push('/appointment')
    }
  }, [isCompleted, confirmDelete, instance, router])

  const handleConfirmChange = useCallback((preserve: boolean) => {
    console.log('[DEBUG] handleConfirmChange called, preserve =', preserve)
    setShowChangeModal(false)
    setIsPreserving(preserve)

    if (preserve) {
      console.log('[DEBUG] Preserving data:', formData)
      setPreservedData(JSON.stringify(formData))
    } else {
      console.log('[DEBUG] Resetting data')
      setPreservedData(null)
      setFormData({})
    }

    setCurrentStepIndex(0)
    setSelectedFlow(null)

    if (instance?.id) {
      console.log('[DEBUG] Deleting existing instance', instance.id)
      deleteFlowInstance(instance.id).catch(() => { })
    }
  }, [formData, instance, setFormData, setCurrentStepIndex])


  const handleSelectFlow = useCallback(async (flow: FlowTemplateDto) => {
    try {
      const schemaParsed = parseFlowSchema(flow.schema)
      if (!schemaParsed) throw new Error('Invalid schema')

      const allFields = getAllFieldNames(schemaParsed)

      // Determine data to use
      let dataToUse: Record<string, any> = {}
      if (isPreserving && preservedData) {
        const preserved = JSON.parse(preservedData)
        dataToUse = filterPreservedData(preserved, allFields)
      }

      setFormData(dataToUse)
      setIsPreserving(false)
      setPreservedData(null)

      // Create new instance
      const res = await createFlowInstance({
        templateId: flow.id,
        appointmentId: id as string,
      })
      const instId = res.data
      const dataStr = JSON.stringify(dataToUse)

      const currentInstance: FlowInstanceDto = {
        id: instId,
        templateId: flow.id,
        appointmentId: id as string,
        data: dataStr,
        schema: flow.schema,
      }

      setInstance(currentInstance)
      await updateFlowInstance(instId, { data: dataStr })
      lastSavedDataRef.current = dataStr
      setHasUnsavedChanges(false)
      setSelectedFlow(flow)
    } catch (err) {
      console.error('Error selecting flow:', err)
    }
  }, [isPreserving, preservedData, id, setFormData, setHasUnsavedChanges])

  // Render loading state
  if (loading) {
    return (
      <LoadingState />
    )
  }

  // Main render
  return (
    <div className="pb-32 overflow-hidden p-4 md:p-8">
      <PatientInfoCard
        saveStatus={saveStatus}
        startTime={instance?.startTime}
        endTime={instance?.endTime}
        instanceId={instance?.id}
        isCompleted={isCompleted}
        patientId={appointment?.patientProfileId}
      />

      <Divider />

      {!selectedFlow && !isCompleted && (
        <FlowSelector flows={flows} onSelectFlow={handleSelectFlow} />
      )}

      {selectedFlow && totalSteps > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{selectedFlow.name}</h2>
            <div className="flex flex-row items-center gap-2">
              <DiagnosticsSuiteModal />
              <Button
                onClick={handleChangeFlow}
                className="flex flex-row items-center gap-2"
                variant="secondary"
                disabled={isCompleted}
              >
                <Replace width={18} />
              </Button>
              <Button
                onClick={handleDeleteFlow}
                className="flex flex-row items-center gap-2"
                variant="destructive"
                disabled={isCompleted}
              >
                <RouteOff width={18} />
                {confirmDelete ? "Êtes-vous sûr ?" : ""}
              </Button>
            </div>
          </div>

          <DynamicFormStep selectedFlow={selectedFlow} isCompleted={isCompleted} patientId={appointment?.patientProfileId ?? ''} />
          <StepNavigator totalSteps={totalSteps} instanceId={instance?.id} isCompleted={isCompleted} />
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