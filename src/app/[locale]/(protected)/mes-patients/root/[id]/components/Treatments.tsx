

// No direct API for treatments, static/placeholder

import { Card } from "@/components/Card";
import useTranslations from "@/lib/i18n/useTranslations";

// Could potentially fetch services, but no patient link, so static
const mockTreatments = [
  { name: "Paracétamol", dosage: "500mg", frequency: "3x/jour", startDate: "2023-07-01" },
  { name: "Vaccin antigrippal", dosage: "1 dose", frequency: "Annuel", startDate: "2022-10-15" },
];

interface TreatmentsProps {
  patientId: string;
}

export default function Treatments({ patientId }: TreatmentsProps) {
  const t = useTranslations("patients.treatments");

  return (
    <Card>
      <div>
        <h2>{t("title")}</h2>
      </div>
      <div>
        <ul className="space-y-4">
          {mockTreatments.map((treatment, index) => (
            <li key={index} className="border-b pb-2">
              <p className="font-semibold">{treatment.name}</p>
              <p className="text-sm text-gray-600">
                Dosage: {treatment.dosage} | Fréquence: {treatment.frequency} | Début: {treatment.startDate}
              </p>
            </li>
          ))}
          {mockTreatments.length === 0 && <p>{t("noTreatments")}</p>}
        </ul>
      </div>
    </Card>
  );
}