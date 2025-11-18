// app/appointment/[id]/staticSteps.ts

import DocumentsNotes from '@/app/[locale]/(protected)/mes-patients/root/[id]/components/DocumentsNotes';
import AllergiesTable from '@/app/[locale]/(protected)/mes-patients/root/[id]/components/medical-history/Allergies';
import PastDiseasesTable from '@/app/[locale]/(protected)/mes-patients/root/[id]/components/medical-history/PastDiseasesTable';
import SocialHistory from '@/app/[locale]/(protected)/mes-patients/root/[id]/components/medical-history/SocialHistory';
import SurgeriesTable from '@/app/[locale]/(protected)/mes-patients/root/[id]/components/medical-history/SurgeriesTable';
import Vaccines from '@/app/[locale]/(protected)/mes-patients/root/[id]/components/medical-history/Vaccines';
import Treatments from '@/app/[locale]/(protected)/mes-patients/root/[id]/components/Treatments';
import { ComponentType } from 'react';

export interface StaticStep {
  id: string;
  title: string;
  description?: string;
  component: ComponentType<any>;
}

export const STATIC_STEPS: StaticStep[] = [
  {
    id: 'allergies',
    title: 'Allergies',
    description: 'View and manage the patient’s allergies',
    component: AllergiesTable,
  },
  {
    id: 'past-diseases',
    title: 'Medical History',
    description: 'Review the patient’s past illnesses and conditions',
    component: PastDiseasesTable,
  },
  {
    id: 'vaccines',
    title: 'Vaccinations',
    description: 'Track the patient’s vaccination record',
    component: Vaccines,
  },
  {
    id: 'social-history',
    title: 'Social History',
    description: 'Information about lifestyle, habits, and social background',
    component: SocialHistory,
  },
  {
    id: 'surgeries',
    title: 'Surgeries',
    description: 'Record of past surgeries and procedures',
    component: SurgeriesTable,
  },
  {
    id: 'documents',
    title: 'Documents',
    description: 'Upload and view patient-related documents',
    component: DocumentsNotes,
  },
  {
    id: 'treatments',
    title: 'Treatments',
    description: 'Current and past treatments for the patient',
    component: Treatments,
  },
];
