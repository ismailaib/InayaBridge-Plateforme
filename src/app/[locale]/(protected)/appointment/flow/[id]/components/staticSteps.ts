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
    description: 'Gestion des allergies du patient',
    component: AllergiesTable, 
  },
  {
    id: 'past-diseases',
    title: 'Antécédents Médicaux',
    description: 'Historique des maladies',
    component: PastDiseasesTable,
  },
  {
    id: 'vaccines',
    title: 'Vaccines',
    description: 'Historique des maladies',
    component: Vaccines,
  },
  {
    id: 'social-history',
    title: 'Social History',
    description: 'Historique des maladies',
    component: SocialHistory,
  },
  {
    id: 'surgeries',
    title: 'SurgeriesTable',
    description: 'Historique des maladies',
    component: SurgeriesTable,
  },
  {
    id: 'docs',
    title: 'Documents',
    description: 'Historique des maladies',
    component: DocumentsNotes,
  },
  {
    id: 'treatments',
    title: 'Treatments',
    description: 'Historique des maladies',
    component: Treatments,
  },
];