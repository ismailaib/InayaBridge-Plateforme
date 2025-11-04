import { useAppointmentFlow } from '../hooks/useAppointmentFlow';
import { Key } from 'react';
import SectionTitle from './SectionTitle';
import FormField from './FormField';
import { Step } from '../../types/appointmentFlow';
import { Card } from '@/components/Card';
import Steps from './Steps';

interface DynamicFormStepProps {
  step: Step;
}

export default function DynamicFormStep({ step }: DynamicFormStepProps) {
  const { formData, updateField } = useAppointmentFlow();

  const handleChange = (name: string, value: any) => {
    updateField(name, value);
  };

  return (
    <div className="relative flex flex-row gap-4 mt-4">
      <div className="w-96 overflow-y-auto">
        <Steps />
      </div>
      <div className="flex-1">
        <div className="">
          <h2 className="text-xl font-semibold mb-2">{step.title}</h2>
          <p className="text-gray-600 mb-4">{step.description}</p>
          <div className='flex flex-col items-start gap-6'>
            {step.sections.map(
            (section: { title: any; fields: any[] }, sectionIndex: Key | null | undefined) => (
              <Card key={sectionIndex} >
                <SectionTitle title={section.title} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields.map((field) => (
                    <FormField
                      key={field.name}
                      field={field}
                      value={formData[field.name] ?? ''}
                      onChange={handleChange}
                    />
                  ))}
                </div>
              </Card>
            ),
          )}
          </div>
        </div>
      </div>
    </div>
  );
}