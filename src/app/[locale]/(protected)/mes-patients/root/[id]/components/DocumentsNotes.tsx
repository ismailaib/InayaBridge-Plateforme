import { Card } from "@/components/Card";
import useTranslations from "@/lib/i18n/useTranslations";


// No API, static/placeholder
const mockDocuments = [
  { name: "Rapport de laboratoire.pdf", date: "2023-05-10", type: "Lab Report" },
  { name: "Note du médecin.txt", date: "2023-04-02", type: "Note" },
];

interface DocumentsNotesProps {
  patientId: string;
}

export default function DocumentsNotes({ patientId }: DocumentsNotesProps) {
  const t = useTranslations("patients.documentsNotes");

  return (
    <Card>
      <div>
        <h2>{t("title")}</h2>
      </div>
      <div>
        <ul className="space-y-4">
          {mockDocuments.map((doc, index) => (
            <li key={index} className="border-b pb-2">
              <p className="font-semibold">{doc.name}</p>
              <p className="text-sm text-gray-600">{doc.date} - {doc.type}</p>
            </li>
          ))}
          {mockDocuments.length === 0 && <p>{t("noDocuments")}</p>}
        </ul>
      </div>
    </Card>
  );
}