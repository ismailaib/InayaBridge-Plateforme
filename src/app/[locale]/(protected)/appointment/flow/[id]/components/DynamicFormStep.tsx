'use client'

import { Card } from '@/components/Card'
import { Divider } from '@/components/Divider'
import { useAppointmentFlow } from '../hooks/useAppointmentFlow'
import FormField from './FormField'
import SectionTitle from './SectionTitle'
import Steps from './Steps'
import { motion, AnimatePresence } from 'framer-motion'

interface DynamicFormStepProps {
  selectedFlow: any
  isCompleted: boolean
}

export default function DynamicFormStep({ selectedFlow, isCompleted }: DynamicFormStepProps) {
  const { formData, updateField, currentStepIndex } = useAppointmentFlow()

  const handleChange = (name: string, value: any) => {
    updateField(name, value)
  }

  const parsedSchema = selectedFlow?.schema ? JSON.parse(selectedFlow.schema) : null
  const allSections = parsedSchema?.sections || []
  
  const schemaSteps = allSections.filter((section: any) => 
    section.title !== "Start Node" && section.id !== "1"
  )

  const currentStep = schemaSteps[currentStepIndex]

  if (!currentStep) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Aucun schéma de flow trouvé.
      </div>
    )
  }

  return (
    <div className="relative flex flex-row gap-4 mt-4 mb-24">
      <div className="w-96 overflow-y-auto">
        <Steps selectedFlow={selectedFlow} />
      </div>
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-start gap-6 w-full">
              {currentStep.fields && currentStep.fields.length > 0 ? (
                <Card className="w-full">
                  <SectionTitle title={currentStep.title} />
                  <Divider />
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {currentStep.fields.map((field: any) => (
                      <FormField
                        key={field.name}
                        field={field}
                        value={formData[field.name] ?? ''}
                        onChange={handleChange}
                        isCompleted={isCompleted}
                      />
                    ))}
                  </div>
                </Card>
              ) : (
                <Card className="w-full">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                      Aucun champ défini
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                      Cette étape ne contient pas de champs à remplir.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}