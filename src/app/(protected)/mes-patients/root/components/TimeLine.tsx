"use client";

import { useState } from 'react';
import {
  RiCheckLine,
  RiAddLine,
  RiDeleteBin6Line,
  RiSaveLine,
  RiCloseLine,
} from '@remixicon/react';

import { cx } from '@/lib/utils';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs';
import { FileCheck2, Phone, User, Heart, Shield, AlertTriangle, Pill, Activity } from 'lucide-react';
import jsPDF from 'jspdf';
import axios from '@/lib/axios';

interface Patient {
  id?: number;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  address?: string;
  email?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | string;
  cin?: string;
  medical_history?: {
    allergies?: string[];
    past_conditions?: string[];
    chronic_illnesses?: string[] | null;
    current_medications?: {
      name: string;
      dosage: string;
    }[];
  };
  blood_type?: string;
  contact_urgence?: {
    relation: string;
    phone_number: string;
  };
  documents?: { type: string; url: string }[];
}

interface MedicalHistoryEntry {
  id: string;
  category: 'allergies' | 'past_conditions' | 'chronic_illnesses' | 'current_medications';
  title: string;
  description: string;
  type: 'allergy' | 'condition' | 'chronic' | 'medication';
}

const PatientHistorySidebar = ({ 
  patient, 
  onPatientUpdate,
  onSuccess 
}: { 
  patient: Patient | null;
  onPatientUpdate?: (updatedPatient: Patient) => void;
  onSuccess?: () => void 
}) => {
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [newEntry, setNewEntry] = useState<{
    category: 'allergies' | 'past_conditions' | 'chronic_illnesses' | 'current_medications';
    title: string;
    description: string;
    dosage?: string;
  }>({
    category: 'allergies',
    title: '',
    description: '',
    dosage: ''
  });

  if (!patient) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Veuillez sélectionner un patient pour voir son historique médical.
        </p>
      </Card>
    );
  }

  const medicalHistory = patient.medical_history || {};

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;
    const lineHeight = 7;
    const margin = 20;

    // Header
    doc.setFontSize(18);
    doc.setFont('Elvetica', 'bold');
    doc.text('RAPPORT MÉDICAL DU PATIENT', margin, yPosition);
    yPosition += lineHeight * 2;

    // Patient Information Section
    doc.setFontSize(14);
    doc.setFont('Elvetica', 'bold');
    doc.text('INFORMATIONS PERSONNELLES', margin, yPosition);
    yPosition += lineHeight;

    doc.setFontSize(10);
    doc.setFont('Elvetica', 'normal');
    
    const personalInfo = [
      `Nom complet: ${patient.first_name || ''} ${patient.last_name || ''}`,
      `CIN: ${patient.cin || 'N/A'}`,
      `Date de naissance: ${patient.date_of_birth || 'N/A'}`,
      `Genre: ${patient.gender === 'male' ? 'Masculin' : patient.gender === 'female' ? 'Féminin' : patient.gender || 'N/A'}`,
      `Groupe sanguin: ${patient.blood_type || 'N/A'}`,
      `Téléphone: ${patient.phone_number || 'N/A'}`,
      `Email: ${patient.email || 'N/A'}`,
      `Adresse: ${patient.address || 'N/A'}`
    ];

    personalInfo.forEach(info => {
      doc.text(info, margin, yPosition);
      yPosition += lineHeight;
    });

    // Emergency Contact
    if (patient.contact_urgence) {
      yPosition += lineHeight;
      doc.setFontSize(12);
      doc.setFont('Elvetica', 'bold');
      doc.text('CONTACT D\'URGENCE', margin, yPosition);
      yPosition += lineHeight;
      
      doc.setFontSize(10);
      doc.setFont('Elvetica', 'normal');
      doc.text(`Relation: ${patient.contact_urgence.relation}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Téléphone: ${patient.contact_urgence.phone_number}`, margin, yPosition);
      yPosition += lineHeight * 1.5;
    }

    // Medical History
    if (medicalHistory) {
      doc.setFontSize(12);
      doc.setFont('Elvetica', 'bold');
      doc.text('HISTORIQUE MÉDICAL', margin, yPosition);
      yPosition += lineHeight;
      
      doc.setFontSize(10);
      doc.setFont('Elvetica', 'normal');

      if (medicalHistory.allergies && medicalHistory.allergies.length > 0) {
        doc.setFont('Elvetica', 'bold');
        doc.text('Allergies:', margin, yPosition);
        doc.setFont('Elvetica', 'normal');
        yPosition += lineHeight;
        medicalHistory.allergies.forEach(allergy => {
          doc.text(`• ${allergy}`, margin + 5, yPosition);
          yPosition += lineHeight;
        });
      }

      if (medicalHistory.past_conditions && medicalHistory.past_conditions.length > 0) {
        doc.setFont('Elvetica', 'bold');
        doc.text('Antécédents médicaux:', margin, yPosition);
        doc.setFont('Elvetica', 'normal');
        yPosition += lineHeight;
        medicalHistory.past_conditions.forEach(condition => {
          doc.text(`• ${condition}`, margin + 5, yPosition);
          yPosition += lineHeight;
        });
      }

      if (medicalHistory.current_medications && medicalHistory.current_medications.length > 0) {
        doc.setFont('Elvetica', 'bold');
        doc.text('Médicaments actuels:', margin, yPosition);
        doc.setFont('Elvetica', 'normal');
        yPosition += lineHeight;
        medicalHistory.current_medications.forEach(med => {
          doc.text(`• ${med.name} - ${med.dosage}`, margin + 5, yPosition);
          yPosition += lineHeight;
        });
      }

      if (medicalHistory.chronic_illnesses && medicalHistory.chronic_illnesses.length > 0) {
        doc.setFont('Elvetica', 'bold');
        doc.text('Maladies chroniques:', margin, yPosition);
        doc.setFont('Elvetica', 'normal');
        yPosition += lineHeight;
        medicalHistory.chronic_illnesses.forEach(illness => {
          doc.text(`• ${illness}`, margin + 5, yPosition);
          yPosition += lineHeight;
        });
      }
    }

    // Documents
    if (patient.documents && patient.documents.length > 0) {
      yPosition += lineHeight;
      doc.setFontSize(12);
      doc.setFont('Elvetica', 'bold');
      doc.text('DOCUMENTS', margin, yPosition);
      yPosition += lineHeight;
      
      doc.setFontSize(10);
      doc.setFont('Elvetica', 'normal');
      patient.documents.forEach(doc_item => {
        doc.text(`• ${doc_item.type}`, margin, yPosition);
        yPosition += lineHeight;
      });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} sur ${pageCount}`, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 10);
      doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, margin, doc.internal.pageSize.height - 10);
    }

    doc.save(`rapport_medical_${patient.last_name || 'inconnu'}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleAddMedicalEntry = async () => {
    if (!newEntry.title || !patient.id) return;

    const updatedMedicalHistory = { ...medicalHistory };

    switch (newEntry.category) {
      case 'allergies':
        updatedMedicalHistory.allergies = [...(updatedMedicalHistory.allergies || []), newEntry.title];
        break;
      case 'past_conditions':
        updatedMedicalHistory.past_conditions = [...(updatedMedicalHistory.past_conditions || []), newEntry.title];
        break;
      case 'chronic_illnesses':
        updatedMedicalHistory.chronic_illnesses = [...(updatedMedicalHistory.chronic_illnesses || []), newEntry.title];
        break;
      case 'current_medications':
        updatedMedicalHistory.current_medications = [
          ...(updatedMedicalHistory.current_medications || []),
          { name: newEntry.title, dosage: newEntry.dosage || 'Non spécifié' }
        ];
        break;
    }

    const updatedPatient = { ...patient, medical_history: updatedMedicalHistory };

    try {
      await axios.put(`/patientsDoctor/${patient.id}`, updatedPatient);
      onPatientUpdate?.(updatedPatient);
      setNewEntry({ category: 'allergies', title: '', description: '', dosage: '' });
      setIsAddingEntry(false);
      onSuccess?.()
    } catch (error) {
      console.error('Error adding medical entry:', error);
    }
  };

  const handleDeleteMedicalEntry = async (category: string, index: number ) => {
    if (!patient.id) return;

    const updatedMedicalHistory = { ...medicalHistory };

    switch (category) {
      case 'allergies':
        updatedMedicalHistory.allergies = updatedMedicalHistory.allergies?.filter((_, i) => i !== index);
        break;
      case 'past_conditions':
        updatedMedicalHistory.past_conditions = updatedMedicalHistory.past_conditions?.filter((_, i) => i !== index);
        break;
      case 'chronic_illnesses':
        updatedMedicalHistory.chronic_illnesses = updatedMedicalHistory.chronic_illnesses?.filter((_, i) => i !== index);
        break;
      case 'current_medications':
        updatedMedicalHistory.current_medications = updatedMedicalHistory.current_medications?.filter((_, i) => i !== index);
        break;
    }

    const updatedPatient = { ...patient, medical_history: updatedMedicalHistory };

    try {
      await axios.put(`/patientsDoctor/${patient.id}`, updatedPatient);
      onPatientUpdate?.(updatedPatient);
      onSuccess?.()
    } catch (error) {
      console.error('Error deleting medical entry:', error);
    }
  };

  const renderMedicalHistoryTimeline = () => {
    const timelineEntries: MedicalHistoryEntry[] = [];

    // Add allergies
    medicalHistory.allergies?.forEach((allergy, index) => {
      timelineEntries.push({
        id: `allergy-${index}`,
        category: 'allergies',
        title: allergy,
        description: 'Allergie connue',
        type: 'allergy'
      });
    });

    // Add past conditions
    medicalHistory.past_conditions?.forEach((condition, index) => {
      timelineEntries.push({
        id: `past-${index}`,
        category: 'past_conditions',
        title: condition,
        description: 'Antécédent médical',
        type: 'condition'
      });
    });

    // Add chronic illnesses
    medicalHistory.chronic_illnesses?.forEach((illness, index) => {
      timelineEntries.push({
        id: `chronic-${index}`,
        category: 'chronic_illnesses',
        title: illness,
        description: 'Maladie chronique',
        type: 'chronic'
      });
    });

    // Add current medications
    medicalHistory.current_medications?.forEach((med, index) => {
      timelineEntries.push({
        id: `medication-${index}`,
        category: 'current_medications',
        title: med.name,
        description: `Posologie: ${med.dosage}`,
        type: 'medication'
      });
    });

    return timelineEntries;
  };

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'allergy':
        return <AlertTriangle className="size-5 text-red-500" />;
      case 'condition':
        return <RiCheckLine className="size-5 text-blue-500" />;
      case 'chronic':
        return <Activity className="size-5 text-orange-500" />;
      case 'medication':
        return <Pill className="size-5 text-green-500" />;
      default:
        return <RiCheckLine className="size-5 text-gray-500" />;
    }
  };

  const getEntryColor = (type: string) => {
    switch (type) {
      case 'allergy':
        return 'text-red-600 dark:text-red-400';
      case 'condition':
        return 'text-blue-600 dark:text-blue-400';
      case 'chronic':
        return 'text-orange-600 dark:text-orange-400';
      case 'medication':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const timelineEntries = renderMedicalHistoryTimeline();

  const getPatientInfo = () => [
    { 
      label: 'Informations personnelles', 
      value: 'Complètes', 
      icon: <User className="size-4 text-blue-500" /> 
    },
    { 
      label: 'Contact d\'urgence', 
      value: patient.contact_urgence ? 'Configuré' : 'Non configuré', 
      icon: <Phone className="size-4 text-green-500" /> 
    },
    { 
      label: 'Groupe sanguin', 
      value: patient.blood_type || 'Non spécifié', 
      icon: <Heart className="size-4 text-red-500" /> 
    },
    { 
      label: 'Documents', 
      value: `${patient.documents?.length || 0} document(s)`, 
      icon: <Shield className="size-4 text-purple-500" /> 
    }
  ];

  return (
    <div className="w-full">
      <Card className="overflow-hidden p-0">
        <div className="flex flex-col space-y-4 border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-900 dark:bg-[#090E1A]">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-50">
              Historique médical du patient
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {patient.first_name} {patient.last_name} - CIN: {patient.cin}
            </p>
          </div>
        </div>
        <Tabs defaultValue="history" className="p-6">
          <TabsList className="w-full" variant="solid">
            <TabsTrigger value="history" className="w-full">
              Historique médical
            </TabsTrigger>
            <TabsTrigger value="details" className="w-full">
              Informations
            </TabsTrigger>
          </TabsList>

          {/* Medical History Tab */}
          <TabsContent value="history">
            <div className="flex items-center justify-between mb-4 mt-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                Entrées médicales ({timelineEntries.length})
              </h4>
              <Button
                onClick={() => setIsAddingEntry(true)}
                variant="secondary"
                className="h-8"
              >
                <RiAddLine className="size-4 mr-1" />
                Ajouter
              </Button>
            </div>

            {/* Add New Entry Form */}
            {isAddingEntry && (
              <Card className="p-4 mb-6 border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="space-y-3">
                  <select
                    value={newEntry.category}
                    onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm dark:border-gray-600 dark:bg-gray-800"
                  >
                    <option value="allergies">Allergie</option>
                    <option value="past_conditions">Antécédent médical</option>
                    <option value="chronic_illnesses">Maladie chronique</option>
                    <option value="current_medications">Médicament actuel</option>
                  </select>
                  <input
                    type="text"
                    placeholder={newEntry.category === 'current_medications' ? 'Nom du médicament' : 'Titre'}
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm dark:border-gray-600 dark:bg-gray-800"
                  />
                  {newEntry.category === 'current_medications' && (
                    <input
                      type="text"
                      placeholder="Posologie (ex: 2 comprimés par jour)"
                      value={newEntry.dosage}
                      onChange={(e) => setNewEntry({ ...newEntry, dosage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm dark:border-gray-600 dark:bg-gray-800"
                    />
                  )}
                  <textarea
                    placeholder="Description (optionnel)"
                    value={newEntry.description}
                    onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-16 dark:border-gray-600 dark:bg-gray-800"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleAddMedicalEntry}   className="h-8">
                      <RiSaveLine className="size-4 mr-1" />
                      Sauvegarder
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsAddingEntry(false);
                        setNewEntry({ category: 'allergies', title: '', description: '', dosage: '' });
                      }}
                        
                      variant="secondary" 
                      className="h-8"
                    >
                      <RiCloseLine className="size-4 mr-1" />
                      Annuler
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            <ul role="list" className="mt-6 space-y-6">
              {timelineEntries.map((entry, entryIndex) => {
                const categoryIndex = entry.id.split('-')[1];
                return (
                  <li key={entry.id} className="relative flex gap-x-3">
                    <div
                      className={cx(
                        entryIndex === timelineEntries.length - 1 ? 'h-6' : '-bottom-6',
                        'absolute left-0 top-0 flex w-6 justify-center',
                      )}
                    >
                      <span
                        className="w-px bg-gray-200 dark:bg-gray-700"
                        aria-hidden={true}
                      />
                    </div>
                    <div className="flex items-start space-x-2.5 w-full">
                      <div className="relative flex size-6 flex-none items-center justify-center bg-white dark:bg-[#090E1A]">
                        {getEntryIcon(entry.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className={cx(
                              "mt-0.5 text-sm font-medium",
                              getEntryColor(entry.type)
                            )}>
                              {entry.title}
                              <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                {entry.type === 'allergy' ? 'Allergie' : 
                                 entry.type === 'condition' ? 'Antécédent' :
                                 entry.type === 'chronic' ? 'Chronique' : 'Médicament'}
                              </span>
                            </p>
                            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                              {entry.description}
                            </p>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              onClick={() => handleDeleteMedicalEntry(entry.category, parseInt(categoryIndex))}
                               
                              variant="ghost"
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                            >
                              <RiDeleteBin6Line className="size-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            
            {timelineEntries.length === 0 && !isAddingEntry && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                Aucun historique médical disponible. Cliquez sur Ajouter pour créer une entrée.
              </p>
            )}

            <Button onClick={handleGeneratePDF} className="mt-6 h-10 w-full" variant="secondary">
              <FileCheck2 className="mr-2 size-5" />
              Générer Un Rapport Médical
            </Button>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details">
            <h4 className="mt-6 text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-600">
              Informations du Patient
            </h4>
            <ul className="mt-3 divide-y divide-gray-200 rounded-md bg-gray-50 text-sm text-gray-500 dark:divide-gray-700 dark:bg-gray-800 dark:text-gray-400">
              {getPatientInfo().map((item) => (
                <li key={item.label} className="flex h-14 items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-50">{item.value}</span>
                </li>
              ))}
            </ul>

            {/* Medical History Details */}
            <h4 className="mt-6 text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-600">
              Résumé Médical
            </h4>
            <div className="mt-3 space-y-3">
              {medicalHistory.allergies && medicalHistory.allergies.length > 0 && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <h5 className="text-sm font-medium text-red-800 dark:text-red-400 flex items-center gap-2">
                    <AlertTriangle className="size-4" />
                    Allergies ({medicalHistory.allergies.length})
                  </h5>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    {medicalHistory.allergies.join(', ')}
                  </p>
                </div>
              )}
              
              {medicalHistory.current_medications && medicalHistory.current_medications.length > 0 && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <h5 className="text-sm font-medium text-green-800 dark:text-green-400 flex items-center gap-2">
                    <Pill className="size-4" />
                    Médicaments Actuels ({medicalHistory.current_medications.length})
                  </h5>
                  <div className="text-sm text-green-600 dark:text-green-300">
                    {medicalHistory.current_medications.map((med, idx) => (
                      <div key={idx}>{med.name} - {med.dosage}</div>
                    ))}
                  </div>
                </div>
              )}

              {medicalHistory.past_conditions && medicalHistory.past_conditions.length > 0 && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <h5 className="text-sm font-medium text-blue-800 dark:text-blue-400 flex items-center gap-2">
                    <Activity className="size-4" />
                    Antécédents ({medicalHistory.past_conditions.length})
                  </h5>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    {medicalHistory.past_conditions.join(', ')}
                  </p>
                </div>
              )}

              {medicalHistory.chronic_illnesses && medicalHistory.chronic_illnesses.length > 0 && (
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-md">
                  <h5 className="text-sm font-medium text-orange-800 dark:text-orange-400 flex items-center gap-2">
                    <Heart className="size-4" />
                    Maladies Chroniques ({medicalHistory.chronic_illnesses.length})
                  </h5>
                  <p className="text-sm text-orange-600 dark:text-orange-300">
                    {medicalHistory.chronic_illnesses.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default PatientHistorySidebar;