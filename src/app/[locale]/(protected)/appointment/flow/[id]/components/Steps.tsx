'use client'

import { RiCheckLine } from '@remixicon/react'
import { cx } from '@/lib/utils'
import { useAppointmentFlow } from '../hooks/useAppointmentFlow'
import { Card } from '@/components/Card'
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react'

interface StepsProps {
  selectedFlow: any
}

export default function Steps({ selectedFlow }: StepsProps) {
  const { currentStepIndex, setCurrentStepIndex } = useAppointmentFlow()

  const parsedSchema = selectedFlow?.schema ? JSON.parse(selectedFlow.schema) : null
  const allSections = parsedSchema?.sections || []
  
  // Filter out "Start Node" sections
  const schemaSteps = allSections.filter((section: any) => 
    section.title !== "Start Node" && section.id !== "1"
  )

  const steps = schemaSteps.map((section: any, index: number) => {
    let type: 'done' | 'in progress' | 'open'
    if (index < currentStepIndex) type = 'done'
    else if (index === currentStepIndex) type = 'in progress'
    else type = 'open'

    return {
      id: index + 1,
      type,
      title: section.title || `Step ${index + 1}`,
      description: section.description || '',
      activityTime: '',
    }
  })

  return (
    <Card className="sm:mx-auto sm:max-w-lg overflow-hidden h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900 dark:text-gray-50">Flow Progress</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
          {steps.filter((s: { type: string }) => s.type === 'done').length} / {steps.length}
        </span>
      </div>
      <ul role="list" className="mt-6 space-y-6 pb-4">
        {steps.map((step: { id: Key | null | undefined; type: string; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; activityTime: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, stepIndex: number) => (
          <li
            key={step.id}
            className={cx(
              "relative flex gap-x-3 cursor-pointer transition-all duration-200 rounded-lg p-2 -mx-2",
              step.type === 'in progress' && "bg-blue-50 dark:bg-blue-900/20",
              "hover:bg-gray-50 dark:hover:bg-gray-800/50"
            )}
            onClick={() => setCurrentStepIndex(stepIndex)}
          >
            <div
              className={cx(
                stepIndex === steps.length - 1 ? 'h-6' : '-bottom-6',
                'absolute left-2 top-0 flex w-6 justify-center ',
              )}
            >
              <span className="w-px bg-gray-200 dark:bg-gray-950" aria-hidden={true} />
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="relative flex size-6 flex-none items-center justify-center bg-white transition dark:bg-gray-950 rounded-full">
                {step.type === 'done' ? (
                  <RiCheckLine className="size-5 text-blue-500 dark:text-blue-500" aria-hidden={true} />
                ) : step.type === 'in progress' ? (
                  <div
                    className="size-2.5 bg-blue-500 ring-4 ring-white transition dark:bg-blue-500 dark:ring-gray-950 rounded-full"
                    aria-hidden={true}
                  />
                ) : (
                  <div
                    className="size-3 rounded-full border border-gray-200 bg-white ring-4 ring-white transition dark:border-gray-800 dark:bg-gray-950 dark:ring-gray-950"
                    aria-hidden={true}
                  />
                )}
              </div>

              <div>
                <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-gray-50">
                  {step.title}{' '}
                  {step.activityTime && (
                    <span className="font-normal text-gray-400 dark:text-gray-600">
                      &#8729; {step.activityTime}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}