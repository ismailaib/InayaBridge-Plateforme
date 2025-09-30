"use client";

import { Card } from "@/components/Card";
import {
  Calendar,
  CreditCard,
  Droplet,
  Mail,
  MapPin,
  Phone,
  User,
  UserCheck,
  Users,
  Pencil,
} from "lucide-react";
import React, { useState } from "react";
import { updatePatient } from "../../api/patients";

interface Patient {
  id:number,
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  cin?: string;
  gender?: string;
  blood_type?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  contact_urgence?: {
    relation: string;
    phone_number: string;
  };
}

interface InfoItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: React.ReactNode;
  valueColor?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({
  icon: Icon,
  label,
  value,
  valueColor = "text-gray-900 dark:text-white",
}) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
    <div className="flex-shrink-0 mt-0.5">
      <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className={`text-sm font-medium ${valueColor} break-words`}>
        {value || "—"}
      </p>
    </div>
  </div>
);

interface SectionHeaderProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  badge?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title, badge }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      <h4 className="font-semibold text-base text-gray-900 dark:text-white">
        {title}
      </h4>
    </div>
    {badge && badge}
  </div>
);

const Details: React.FC<{ patient: Patient | null }> = ({ patient }) => {
  const [editingBlood, setEditingBlood] = useState(false);
  const [editingEmergency, setEditingEmergency] = useState(false);

  const [bloodType, setBloodType] = useState(patient?.blood_type);
  const [emergency, setEmergency] = useState({
    relation: patient?.contact_urgence?.relation,
    phone_number: patient?.contact_urgence?.phone_number,
  });
  React.useEffect(() => {
    setBloodType(patient?.blood_type);
    setEmergency({
      relation: patient?.contact_urgence?.relation ?? "",
      phone_number: patient?.contact_urgence?.phone_number ?? "",
    });
  }, [patient]);

  if (!patient) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
      <User className="h-8 w-8 mb-2 text-emerald-600 dark:text-emerald-400" />
      Veuillez sélectionner un patient pour voir les détails.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full overflow-auto pr-2">
      <div className="bg-gradient-to-r from-emerald-50 to-indigo-50 dark:from-emerald-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-emerald-100 dark:border-emerald-800/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 dark:bg-emerald-500 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {patient.first_name} {patient.last_name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Dossier Patient • CIN: {patient.cin || "—"}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <SectionHeader icon={User} title="Informations Générales" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            icon={User}
            label="Nom complet"
            value={`${patient.first_name} ${patient.last_name}`}
          />
          <InfoItem icon={Calendar} label="Date de naissance" value={patient.date_of_birth} />
          <InfoItem icon={CreditCard} label="CIN" value={patient.cin} />
          <InfoItem icon={Users} label="Genre" value={patient.gender} />
          <div className="md:col-span-2 relative">
            <InfoItem
              icon={Droplet}
              label="Groupe sanguin"
              value={
                editingBlood ? (
                  <input
                    className="bg-transparent outline-none border-b border-emerald-500 text-sm w-full"
                    value={bloodType}
                    autoFocus
                    onChange={(e) => setBloodType(e.target.value)}
                    onBlur={async () => {
                      setEditingBlood(false);
                      await updatePatient(patient.id!, {
                        ...patient,
                        blood_type: bloodType,
                      });
                    }}
                  />
                ) : (
                  bloodType || "—"
                )
              }
            />
            <Pencil
              className="absolute top-2 right-2 h-4 w-4 cursor-pointer text-gray-400 hover:text-emerald-600"
              onClick={() => setEditingBlood(true)}
            />
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader icon={Phone} title="Coordonnées" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem icon={Phone} label="Téléphone" value={patient.phone_number} />
          <InfoItem
            icon={Mail}
            label="Email"
            value={patient.email}
            valueColor="text-emerald-600 dark:text-emerald-400"
          />
          <div className="md:col-span-2">
            <InfoItem icon={MapPin} label="Adresse" value={patient.address} />
          </div>
          <div className="md:col-span-2 relative">
            <InfoItem
              icon={UserCheck}
              label="Contact d'urgence"
              value={
                editingEmergency ? (
                  <div className="flex flex-col gap-1">
                    <input
                      className="bg-transparent outline-none border-b border-emerald-500 text-sm"
                      placeholder="Relation"
                      value={emergency.relation}
                      onChange={(e) =>
                        setEmergency({ ...emergency, relation: e.target.value })
                      }
                    />
                    <input
                      className="bg-transparent outline-none border-b border-emerald-500 text-sm"
                      placeholder="Téléphone"
                      value={emergency.phone_number}
                      onChange={(e) =>
                        setEmergency({ ...emergency, phone_number: e.target.value })
                      }
                      onBlur={async () => {
                        setEditingEmergency(false);
                        await updatePatient(patient.id!, {
                          ...patient,
                          contact_urgence: {
                            relation: String(emergency.relation),
                            phone_number: String(emergency.phone_number),
                          },
                        });
                      }}
                    />
                  </div>
                ) : emergency.relation && emergency.phone_number ? (
                  `${emergency.relation} – ${emergency.phone_number}`
                ) : (
                  "—"
                )
              }
            />
            <Pencil
              className="absolute top-2 right-2 h-4 w-4 cursor-pointer text-gray-400 hover:text-emerald-600"
              onClick={() => setEditingEmergency(true)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Details;
