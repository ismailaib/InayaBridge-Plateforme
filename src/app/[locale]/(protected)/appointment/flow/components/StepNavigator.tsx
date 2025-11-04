import { Button } from '@/components/Button';
import { useAppointmentFlow } from '../hooks/useAppointmentFlow';
import { MoveLeft, MoveRight } from 'lucide-react';

interface StepNavigatorProps {
  totalSteps: number;
}

export default function StepNavigator({ totalSteps }: StepNavigatorProps) {
  const { currentStepIndex, nextStep, prevStep } = useAppointmentFlow();
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <div className="fixed bottom-0 left-[256px] right-0 bg-white dark:bg-gray-900/20 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 z-50 p-4">
      <div className="flex flex-row items-center gap-4">
        <Button
          onClick={prevStep}
          disabled={isFirstStep}
          variant='secondary'
          className='flex flex-row items-center gap-2 whitespace-nowrap'
        >
          <MoveLeft /> Previous
        </Button>
        <Button
          onClick={nextStep}
          disabled={isLastStep}
          variant='primary'
          className='flex-1 flex flex-row items-center justify-center gap-2'
        >
          {isLastStep ? 'Submit' : 'Next'} <MoveRight />
        </Button>
      </div>
    </div>
  );
}