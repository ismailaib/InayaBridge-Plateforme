'use client'

import { RiCheckLine } from '@remixicon/react'
import { cx } from '@/lib/utils'
import { useAppointmentFlow } from '../hooks/useAppointmentFlow'
import { Card } from '@/components/Card'
import { Divider } from '@/components/Divider'
import { STATIC_STEPS } from './staticSteps'

interface StepsProps {
  selectedFlow: any
}

export default function Steps({ selectedFlow }: StepsProps) {
  const { currentStepIndex, setCurrentStepIndex } = useAppointmentFlow()

  const parsedSchema = selectedFlow?.schema ? JSON.parse(selectedFlow.schema) : null
  const allSections = parsedSchema?.sections || []

  const schemaSteps = allSections.filter(
    (section: any) => section.title !== 'Start Node' && section.id !== '1'
  )

  const getStatus = (index: number) =>
    index < currentStepIndex ? 'done' : index === currentStepIndex ? 'in progress' : 'open'

  return (
    <div className="space-y-6 sm:mx-auto sm:max-w-lg overflow-hidden h-fit">
      {/* Dynamic Steps */}
      <div className="flex flex-col gap-2">
        {schemaSteps.map((step: any, index: number) => {
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
                  {step.description && <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>}
                </div>
                {status === 'done' && <RiCheckLine className="h-5 w-5 text-green-500" />}
                {status === 'in progress' && <span className="h-2 w-2 bg-blue-500 rounded-full" />}
              </div>
            </Card>
          )
        })}
      </div>

      <Divider className="my-4" />

      {/* Static Steps */}
      <div className="flex flex-col gap-2">
        {STATIC_STEPS.map((step, index) => {
          const stepIndex = schemaSteps.length + index
          const status = getStatus(stepIndex)
          return (
            <Card
              key={step.id}
              className={cx(
                'p-4 border-l-4 transition-all cursor-pointer rounded-lg',
                status === 'in progress' && 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
                status === 'open' && 'border-gray-200 dark:border-gray-800'
              )}
              onClick={() => setCurrentStepIndex(stepIndex)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50">{step.title}</h4>
                  {step.description && <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>}
                </div>
                {status === 'done' && <RiCheckLine className="h-5 w-5 text-green-500" />}
                {status === 'in progress' && <span className="h-2 w-2 bg-blue-500 rounded-full" />}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
