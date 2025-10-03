"use client";

import { Card } from "@/components/Card";
import {
  Calendar,
  CreditCard,
  Droplet,
  Mail,
  MapPin,
  Pencil,
  Phone,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { updatePatient } from "../../api/patients";

interface Patient {
  id: number,
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
      <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className={`text-sm font-medium ${valueColor} break-words`}>
        {value ?? "N/A"}
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
      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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
        <User className="h-8 w-8 mb-2 text-blue-600 dark:text-blue-400" />
        Please select a patient to view their details.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full overflow-auto pr-2">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-100 dark:border-blue-800/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {patient.first_name} {patient.last_name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Patient Record - CIN: {patient.cin || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <SectionHeader icon={User} title="General Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            icon={User}
            label="Full name"
            value={`${patient.first_name} ${patient.last_name}`}
          />
          <InfoItem icon={Calendar} label="Date of birth" value={patient.date_of_birth} />
          <InfoItem icon={CreditCard} label="CIN" value={patient.cin} />
          <InfoItem icon={Users} label="Gender" value={patient.gender} />
          <div className="md:col-span-2 relative">
            <InfoItem
              icon={Droplet}
              label="Blood type"
              value={
                editingBlood ? (
                  <input
                    className="bg-transparent outline-none border-b border-blue-500 text-sm w-full"
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
                  bloodType ?? "N/A"
                )
              }
            />
            <Pencil
              className="absolute top-2 right-2 h-4 w-4 cursor-pointer text-gray-400 hover:text-blue-600"
              onClick={() => setEditingBlood(true)}
            />
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader icon={Phone} title="Contact Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem icon={Phone} label="Phone" value={patient.phone_number} />
          <InfoItem
            icon={Mail}
            label="Email"
            value={patient.email}
            valueColor="text-blue-600 dark:text-blue-400"
          />
          <div className="md:col-span-2">
            <InfoItem icon={MapPin} label="Address" value={patient.address} />
          </div>
          <div className="md:col-span-2 relative">
            <InfoItem
              icon={UserCheck}
              label="Emergency contact"
              value={
                editingEmergency ? (
                  <div className="flex flex-col gap-1">
                    <input
                      className="bg-transparent outline-none border-b border-blue-500 text-sm"
                      placeholder="Relationship"
                      value={emergency.relation}
                      onChange={(e) =>
                        setEmergency({ ...emergency, relation: e.target.value })
                      }
                    />
                    <input
                      className="bg-transparent outline-none border-b border-blue-500 text-sm"
                      placeholder="Phone"
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
                  `${emergency.relation} - ${emergency.phone_number}`
                ) : (
                  "N/A"
                )
              }
            />
            <Pencil
              className="absolute top-2 right-2 h-4 w-4 cursor-pointer text-gray-400 hover:text-blue-600"
              onClick={() => setEditingEmergency(true)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Details;
