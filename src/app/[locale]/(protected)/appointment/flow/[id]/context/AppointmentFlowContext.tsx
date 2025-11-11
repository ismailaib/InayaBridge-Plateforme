import { createContext, useState, ReactNode, useCallback } from 'react';

interface AppointmentFlowContextType {
  setCurrentStepIndex: (index: number) => void;
  currentStepIndex: number;
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateField: (name: string, value: any) => void;
}

export const AppointmentFlowContext = createContext<AppointmentFlowContextType | undefined>(undefined);

export function AppointmentFlowProvider({ children }: { children: ReactNode }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const updateField = useCallback((name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <AppointmentFlowContext.Provider
      value={{ currentStepIndex, formData, setFormData, nextStep, prevStep, updateField, setCurrentStepIndex }}
    >
      {children}
    </AppointmentFlowContext.Provider>
  );
}