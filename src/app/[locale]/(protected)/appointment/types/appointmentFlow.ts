// flow/types/appointmentFlow.ts
export type FieldType = 'text' | 'number' | 'select' | 'date' | 'textarea' | 'checkbox' | 'radio' | 'email';

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  disabled?: boolean;
  // Can add validation, layout, conditional here if needed
}

export interface Section {
  title: string;
  fields: Field[];
}

export interface Step {
  id: string;
  title: string;
  description: string;
  sections: Section[];
}