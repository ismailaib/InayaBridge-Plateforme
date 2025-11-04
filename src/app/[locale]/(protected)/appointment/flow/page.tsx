'use client';

import { Divider } from "@/components/Divider";
import DynamicFormStep from "./components/DynamicFormStep";
import PatientInfoCard from "./components/PatientInfoCard";
import StepNavigator from "./components/StepNavigator";
import { AppointmentFlowProvider } from "./context/AppointmentFlowContext";
import { useAppointmentFlow } from "./hooks/useAppointmentFlow";
import { appointmentFlowSchema } from "./schema/appointmentFlowSchema";
import Steps from "./components/Steps";



export default function AppointmentFlowPage() {
  return (
    <AppointmentFlowProvider>
      <AppointmentFlowContent />
    </AppointmentFlowProvider>
  );
}

function AppointmentFlowContent() {
  const { currentStepIndex } = useAppointmentFlow();
  const currentStep = appointmentFlowSchema[currentStepIndex];
  
  const patient = {
    name: 'Fatima Zahra Benali',
    age: 34,
    cin: 'AB123456',
    phone: '+212 612345678',
    email: 'fatimazahra@example.com',
    status: 'active' as 'active',
  }

  return (
    <div className="pb-24 overflow-hidden">
      <PatientInfoCard patient={patient} />
      <Divider />
      {currentStep && <DynamicFormStep step={currentStep} />}
      <StepNavigator totalSteps={appointmentFlowSchema.length} />
    </div>
  );
}