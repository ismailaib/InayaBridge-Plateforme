import { useContext } from 'react';
import { AppointmentFlowContext } from '../context/AppointmentFlowContext';

export function useAppointmentFlow() {
  const context = useContext(AppointmentFlowContext);
  if (!context) {
    throw new Error('useAppointmentFlow must be used within AppointmentFlowProvider');
  }
  return context;
}