import { Button } from '@/components/Button';
import { useAppointmentFlow } from '../hooks/useAppointmentFlow';
import { MoveLeft, MoveRight } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import { updateAppointment } from '@/api/appointments';

interface StepNavigatorProps {
  totalSteps: number;
}

export default function StepNavigator({ totalSteps }: StepNavigatorProps) {
  const { currentStepIndex, nextStep, prevStep } = useAppointmentFlow();
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const router = useRouter()
  const { id } = useParams()

  const handleNext = async () => {
    if (isLastStep) {
      try {
        await updateAppointment(id as string, { status: "COMPLETED" });
        // router.push(`/flow/${id}/details`)
      } catch (error) {
        console.error('Error updating appointment status:', error);
      }
    } else {
      nextStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const handlePrev = () => {
    prevStep()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="fixed bottom-0 left-[256px] right-0 bg-white dark:bg-gray-900/20 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 z-50 p-4">
      <div className="flex flex-row items-center gap-4">
        <Button
          onClick={handlePrev}
          disabled={isFirstStep}
          variant='secondary'
          className='flex flex-row items-center gap-2 whitespace-nowrap'
        >
          <MoveLeft /> Previous
        </Button>
        <Button
          onClick={handleNext}
          variant= {isLastStep ? 'success' : 'primary'}
          className='flex-1 flex flex-row items-center justify-center gap-2'
        >
          {isLastStep ? 'Confirmer & Clôturer le rendez-vous' : 'Next'} <MoveRight />
        </Button>
      </div>
    </div>
  );
}