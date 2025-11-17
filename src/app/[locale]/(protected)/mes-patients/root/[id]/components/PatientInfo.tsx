import { updatePatient } from "@/api/patients";
import { showToast } from "@/app/[locale]/(protected)/dashboard/hooks/utils";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { DatePickerBirthDateExample } from "@/components/DateBirth";
import { Divider } from "@/components/Divider";
import { Input } from "@/components/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import useTranslations from "@/lib/i18n/useTranslations";
import { useToast } from "@/lib/useToast";
import { Contact, RotateCcw, Save, Trash } from "lucide-react";
import { useState } from "react";

interface PatientInfoProps {
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    cin: string;
    phone?: string;
    email?: string;
    gender: string;
    dateOfBirth?: string;
    address?: string;
    insuranceType?: string;
    insuranceNumber?: string;
    bloodGroup?: string;
    emergencyContacts?: { name: string; phone: string }[];
    createdAt: string;
    updatedAt: string;
  };
}

interface FormData {
  firstName: string;
  lastName: string;
  cin: string;
  phone: string;
  email: string;
  gender: string;
  dateOfBirth: string | undefined;
  address: string;
  insuranceType: string;
  insuranceNumber: string;
  bloodGroup: string;
  emergencyContacts: { name: string; phone: string }[];
}

const INSURANCE_OPTIONS = [
  { value: "NONE", label: "Aucune" },
  { value: "AMO", label: "AMO" },
  { value: "CNSS", label: "CNSS" },
  { value: "RAMED", label: "RAMED" },
  { value: "PRIVATE", label: "Privée" },
];

const BLOOD_GROUP_OPTIONS = [
  { value: "A_POS", label: "A+" },
  { value: "A_NEG", label: "A-" },
  { value: "B_POS", label: "B+" },
  { value: "B_NEG", label: "B-" },
  { value: "AB_POS", label: "AB+" },
  { value: "AB_NEG", label: "AB-" },
  { value: "O_POS", label: "O+" },
  { value: "O_NEG", label: "O-" },
];

export default function PatientInfo({ patient }: PatientInfoProps) {
  const t = useTranslations("patients.patientInfo");

  const initialFormData: FormData = {
    firstName: patient.firstName,
    lastName: patient.lastName,
    cin: patient.cin,
    phone: patient.phone || "",
    email: patient.email || "",
    gender: patient.gender,
    dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth : undefined,
    address: patient.address || "",
    insuranceType: patient.insuranceType || "",
    insuranceNumber: patient.insuranceNumber || "",
    bloodGroup: patient.bloodGroup || "",
    emergencyContacts: patient.emergencyContacts || [],
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "dateOfBirth"
          ? value instanceof Date
            ? value.toISOString()
            : undefined
          : value,
    }));
  };

  const handleEmergencyContactChange = (index: number, field: "name" | "phone", value: string) => {
    const updatedContacts = [...formData.emergencyContacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setFormData((prev) => ({ ...prev, emergencyContacts: updatedContacts }));
  };

  const addEmergencyContact = () => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: "", phone: "" }],
    }));
  };

  const removeEmergencyContact = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    await updatePatient(patient.id, formData);
    showToast('success', 'Succées', 'Informations modifiée avec succès');

  };

  const handleReset = () => {
    setFormData(initialFormData);
  };

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{t("title")}</h2>
      </div>

      <div className="grid gap-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t("firstName")}</label>
            <Input
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t("lastName")}</label>
            <Input
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t("cin")}</label>
            <Input
              value={formData.cin}
              onChange={(e) => handleChange("cin", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t("gender")}</label>
            <Input
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t("dateOfBirth")}</label>
            <DatePickerBirthDateExample
              value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
              onChange={(date) => handleChange("dateOfBirth", date)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t("phone")}</label>
            <Input
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t("email")}</label>
            <Input
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t("address")}</label>
            <Input
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
        </div>

        <Divider />

        {/* Insurance Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t("insuranceType")}</label>
            <Select
              value={formData.insuranceType}
              onValueChange={(val) => handleChange("insuranceType", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectInsuranceType")} />
              </SelectTrigger>
              <SelectContent>
                {INSURANCE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t("insuranceNumber")}</label>
            <Input
              value={formData.insuranceNumber}
              onChange={(e) => handleChange("insuranceNumber", e.target.value)}
            />
          </div>
        </div>

        {/* Blood Group */}
        <div>
          <label className="block text-sm font-medium mb-2">{t("bloodGroup")}</label>
          <Select
            value={formData.bloodGroup}
            onValueChange={(val) => handleChange("bloodGroup", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectBloodGroup")} />
            </SelectTrigger>
            <SelectContent>
              {BLOOD_GROUP_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Divider />

        {/* Emergency Contacts */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-medium">{t("emergencyContacts")}</label>
            <Button variant="secondary" onClick={addEmergencyContact}>
              <Contact width={18} className="mr-2" />
              {t("addEmergencyContact")}
            </Button>
          </div>
          <div className="grid gap-4">
            {formData.emergencyContacts.map((contact, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-center">
                <Input
                  placeholder={t("emergencyNamePlaceholder")}
                  value={contact.name}
                  onChange={(e) => handleEmergencyContactChange(index, "name", e.target.value)}
                />
                <Input
                  placeholder={t("emergencyPhonePlaceholder")}
                  value={contact.phone}
                  onChange={(e) => handleEmergencyContactChange(index, "phone", e.target.value)}
                />
                <Button variant="destructive" onClick={() => removeEmergencyContact(index)}>
                  <Trash width={18} />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={handleReset}>
            <RotateCcw width={18} className="mr-2" />
            {t("reset")}
          </Button>
          <Button onClick={handleSave}>
            <Save width={18} className="mr-2" />
            {t("save")}
          </Button>
        </div>
      </div>
    </Card>
  );
}