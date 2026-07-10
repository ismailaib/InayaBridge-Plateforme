'use client'

import { RiCheckLine } from '@remixicon/react'
import { cx } from '@/lib/utils'
import { useAppointmentFlow } from '../hooks/useAppointmentFlow'
import { Card } from '@/components/Card'
import { STATIC_STEPS } from './staticSteps'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs'

interface StepsProps {
  selectedFlow: any
}

export default function Steps({ selectedFlow }: StepsProps) {
  const { currentStepIndex, setCurrentStepIndex } = useAppointmentFlow()

  const parsedSchema = selectedFlow?.schema ? JSON.parse(selectedFlow.schema) : null
  const allSections = parsedSchema?.sections || []

  const dynamicSteps = allSections.filter(
    (section: any) => section.title !== 'Start Node' && section.id !== '1'
  )

  const getStatus = (index: number) =>
    index < currentStepIndex ? 'done' : index === currentStepIndex ? 'in progress' : 'open'

  const renderStepCard = (step: any, index: number) => {
    const status = getStatus(index)
    return (
      <Card
        key={step.id}
        className={cx(
          'p-4 border-l-4 transition-all cursor-pointer rounded-lg',
          status === 'in progress' && 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
          status === 'open' && 'border-gray-200 dark:border-gray-800'
        )}
        onClick={() => setCurrentStepIndex(index)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50">{step.title}</h4>
            {step.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
            )}
          </div>
          {status === 'done' && <RiCheckLine className="h-5 w-5 text-green-500" />}
          {status === 'in progress' && <span className="h-2 w-2 bg-blue-500 rounded-full" />}
        </div>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="doctorFlow" >
      <TabsList className="grid w-full grid-cols-2" variant="line" >
        <TabsTrigger value="doctorFlow">Appointments Records</TabsTrigger>
        <TabsTrigger value="patientRecords">Patient Records</TabsTrigger>
      </TabsList>

      <div className="mt-4 space-y-6">
        <TabsContent value="doctorFlow">
          <div className="flex flex-col gap-2">
            {dynamicSteps.map((step: any, index: number) => renderStepCard(step, index))}
          </div>
        </TabsContent>

        <TabsContent value="patientRecords">
          <div className="flex flex-col gap-2">
            {STATIC_STEPS.map((step, index) =>
              renderStepCard(step, dynamicSteps.length + index)
            )}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  )
}
