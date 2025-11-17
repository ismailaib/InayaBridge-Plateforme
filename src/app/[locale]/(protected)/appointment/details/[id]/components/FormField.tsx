import { Checkbox } from "@/components/Checkbox";
import { DatePicker } from "@/components/DatePicker";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { RadioGroup, RadioGroupItem } from "@/components/RadioGroup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import { Field } from "../../../types/appointmentFlow";
import { Textarea } from "@/components/Textarea ";

interface FormFieldProps {
  field: Field;
  value: any;
  onChange: (value: any) => void; // FIXED
  isCompleted?: boolean;
}

export default function FormField({
  field,
  value,
  onChange,
  isCompleted
}: FormFieldProps) {

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const newValue =
      field.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    onChange(newValue);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return onChange("");

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    onChange(`${y}-${m}-${d}`);
  };

  const handleSelectChange = (val: string) => {
    onChange(val);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onChange(checked);
  };

  const handleRadioChange = (val: string) => {
    onChange(val);
  };

  switch (field.type) {
    case "text":
    case "email":
    case "number":
      return (
        <div className="flex flex-col">
          <Label htmlFor={field.name} className="mb-1">
            {field.label}
          </Label>
          <Input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={value ?? ""}
            onChange={handleChange}
            disabled={field.disabled || isCompleted}
            min={field.min}
            max={field.max}
          />
        </div>
      );

    case "date":
      return (
        <div className="flex flex-col">
          <Label className="mb-1">{field.label}</Label>
          <DatePicker
            value={value ? new Date(value) : undefined}
            onChange={handleDateChange}
            showTimePicker
            disabled={field.disabled || isCompleted}
          />
        </div>
      );

    case "select":
      return (
        <div className="flex flex-col">
          <Label className="mb-1">{field.label}</Label>
          <Select
            value={value ?? ""}
            onValueChange={handleSelectChange}
            disabled={field.disabled || isCompleted}
          >
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

    case "textarea":
      return (
        <div className="flex flex-col">
          <Label className="mb-1">{field.label}</Label>
          <Textarea
            id={field.name}
            placeholder={field.placeholder}
            value={value ?? ""}
            onChange={handleChange}
            disabled={field.disabled || isCompleted}
          />
        </div>
      );

    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={field.name}
            checked={!!value}
            onCheckedChange={handleCheckboxChange}
            disabled={field.disabled || isCompleted}
          />
          <Label htmlFor={field.name}>{field.label}</Label>
        </div>
      );

    case "radio":
      return (
        <div className="flex flex-col">
          <Label className="mb-1">{field.label}</Label>
          <RadioGroup
            value={value}
            onValueChange={handleRadioChange}
            disabled={field.disabled || isCompleted}
          >
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
