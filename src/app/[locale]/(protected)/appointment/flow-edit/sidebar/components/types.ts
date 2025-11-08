export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'radio';

export interface Field {
  id: string;
  name: string;
  label: string;
  description?: string;
  type: FieldType;
  placeholder?: string;
  min?: number;
  max?: number;
  options?: string[];
}
