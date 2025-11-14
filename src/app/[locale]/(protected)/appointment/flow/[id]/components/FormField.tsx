import { Checkbox } from "@/components/Checkbox";
import { DatePicker } from "@/components/DatePicker";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { RadioGroup, RadioGroupItem } from "@/components/RadioGroup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import { Textarea } from "@/components/Textarea ";
import { Field } from "../../../types/appointmentFlow";

interface FormFieldProps {
  field: Field;
  value: any;
  onChange: (name: string, value: any) => void;
  isCompleted?: boolean;
}

export default function FormField({ field, value, onChange, isCompleted }: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const newValue = field.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    onChange(field.name, newValue);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return onChange(field.name, '');

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    onChange(field.name, `${year}-${month}-${day}`);
  };


  const handleSelectChange = (val: string) => {
    onChange(field.name, val);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onChange(field.name, checked);
  };

  const handleRadioChange = (val: string) => {
    onChange(field.name, val);
  };

  switch (field.type) {
    case 'text':
    case 'email':
    case 'number':
      return (
        <div className="flex flex-col">
          <Label htmlFor={field.name} className="mb-1 text-sm font-medium">
            {field.label}
          </Label>
          <Input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={handleChange}
            min={field.min}
            max={field.max}
            disabled={field.disabled || isCompleted}
          />
        </div>
      );
    case 'date':
      return (
        <div className="flex flex-col">
          <Label htmlFor={field.name} className="mb-1 text-sm font-medium">
            {field.label}
          </Label>
          <DatePicker
            value={value ? new Date(value) : undefined}
            onChange={handleDateChange}
            showTimePicker
            disabled={field.disabled || isCompleted}
          />
        </div>
      );
    case 'select':
      return (
        <div className="flex flex-col">
          <Label htmlFor={field.name} className="mb-1 text-sm font-medium">
            {field.label}
          </Label>
          <Select value={value} onValueChange={handleSelectChange} disabled={field.disabled || isCompleted}>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    case 'textarea':
      return (
        <div className="flex flex-col">
          <Label htmlFor={field.name} className="mb-1 text-sm font-medium">
            {field.label}
          </Label>
          <Textarea
            id={field.name}
            placeholder={field.placeholder}
            value={value}
            onChange={handleChange}
            disabled={field.disabled || isCompleted}
          />
        </div>
      );
    case 'checkbox':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={field.name}
            checked={value}
            onCheckedChange={handleCheckboxChange}
            disabled={field.disabled || isCompleted}
          />
          <Label htmlFor={field.name} className="text-sm font-medium">
            {field.label}
          </Label>
        </div>
      );
    case 'radio':
      return (
        <div className="flex flex-col">
          <Label className="mb-1 text-sm font-medium">{field.label}</Label>
          <RadioGroup value={value} onValueChange={handleRadioChange} disabled={field.disabled || isCompleted}>
            {field.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.name}-${option}`} />
                <Label htmlFor={`${field.name}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    default:
      return null;
  }
}