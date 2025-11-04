'use client';

import { RiCheckLine } from '@remixicon/react';
import { cx } from '@/lib/utils';
import { useAppointmentFlow } from '../hooks/useAppointmentFlow';
import { appointmentFlowSchema } from '../schema/appointmentFlowSchema';
import { Card } from '@/components/Card';

export default function Steps() {
  const { currentStepIndex, setCurrentStepIndex } = useAppointmentFlow();

  const steps = appointmentFlowSchema.map((schemaStep, index) => {
    let type: 'done' | 'in progress' | 'open';
    if (index < currentStepIndex) {
      type = 'done';
    } else if (index === currentStepIndex) {
      type = 'in progress';
    } else {
      type = 'open';
    }
    return {
      id: index + 1,
      type,
      title: schemaStep.title,
      description: schemaStep.description,
      activityTime: '', // Omit or leave empty since we don't have time data
    };
  });

  return (
    <Card className="sm:mx-auto sm:max-w-lg overflow-hidden  h-[calc(100vh-10rem)] overflow-y-auto">
      <h3 className="font-medium text-gray-900 dark:text-gray-50">Appointment Flow Progress</h3>
      <ul role="list" className="mt-6 space-y-6 pb-4">
        {steps.map((step, stepIndex) => (
          <li
            key={step.id}
            className="relative flex gap-x-3 cursor-pointer"
            onClick={() => setCurrentStepIndex(stepIndex)}
          >
            <div
              className={cx(
                stepIndex === steps.length - 1 ? 'h-6' : '-bottom-6',
                'absolute left-0 top-0 flex w-6 justify-center',
              )}
            >
              <span className="w-px bg-gray-200 dark:bg-gray-700" aria-hidden={true} />
            </div>
            <div className="flex items-start space-x-2.5">
              <div className="relative flex size-6 flex-none items-center justify-center bg-white transition dark:bg-gray-950 rounded-full">
                {step.type === 'done' ? (
                  <RiCheckLine className="size-5 text-blue-500 dark:text-blue-500" aria-hidden={true} />
                ) : step.type === 'in progress' ? (
                  <div className="size-2.5 bg-blue-500 ring-4 ring-white transition dark:bg-blue-500 dark:ring-gray-950 rounded-full" aria-hidden={true} />
                ) : (
                  <div className="size-3 rounded-full border border-gray-200 bg-white ring-4 ring-white transition dark:border-gray-800 dark:bg-gray-950 dark:ring-gray-950" aria-hidden={true} />
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
                <p className="mt-0.5 text-sm/6 text-gray-500 dark:text-gray-500">
                  {step.description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}