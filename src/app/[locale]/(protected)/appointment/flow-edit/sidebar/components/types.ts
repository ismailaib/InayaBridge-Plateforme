export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'radio';

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  min?: number;
  max?: number;
  options?: string[];
}
