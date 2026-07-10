"use client";

import { Card } from "@/components/Card";
import { Divider } from "@/components/Divider";
import { useState } from "react";

import { PastDisease } from "@/api/medic/PastDisease";
import PastDiseasesTable from "./medical-history/PastDiseasesTable";
import SurgeriesTable from "./medical-history/SurgeriesTable";

interface Surgery { name: string; date: string; notes: string }
interface Medication { name: string; dosage: string; frequency: string }
interface Allergy { allergen: string; reaction: string; severity: string }

interface MedicalHistoryFormData {
  pastDiseases: PastDisease[];
  surgeries: Surgery[];
  chronicConditions: string[];
  hospitalizations: any[];
  familyHistory: string[];
  smoking: boolean;
  alcohol: boolean;
  drugs: boolean;
  diet: string;
  exercise: string;
  medications: Medication[];
  allergies: Allergy[];
  immunizationsHistory: any[];
}

export default function MedicalHistory({ patientId }: { patientId: string }) {
  const [formData, setFormData] = useState<MedicalHistoryFormData>({
    pastDiseases: [],
    surgeries: [],
    chronicConditions: [],
    hospitalizations: [],
    familyHistory: [],
    smoking: false,
    alcohol: false,
    drugs: false,
    diet: "",
    exercise: "",
    medications: [],
    allergies: [],
    immunizationsHistory: [],
  });

  return (
    <div className="min-h-screen">
      <div className="space-y-6">
        <div className="space-y-6 mb-8">

          <PastDiseasesTable patientId={patientId} />

          <SurgeriesTable patientId={patientId} />
        </div>
      </div>
    </div>
  );
}
