'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { Switch } from "@/components/Switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { Plus, Trash2, Pill } from 'lucide-react';
import useTranslations from "@/lib/i18n/useTranslations";

// APIs
import {
  getTreatmentsByPatient,
  deleteTreatment,
  addTreatmentToPatient,
  PatientMedication
} from '@/api/medic/treatments';
import { getMedicamentsByTenant, Medicament } from '@/api/pharmacie/medicaments';
import { Textarea } from '@/components/Textarea ';

interface TreatmentsProps {
  patientId: string;
}

export default function Treatments({ patientId }: TreatmentsProps) {
  const t = useTranslations("patients.treatments");
  const [treatments, setTreatments] = useState<PatientMedication[]>([]);
  const [loading, setLoading] = useState(true);
  
  // FIXED: Added state for tenantId so it can be used in other functions
  const [tenantId, setTenantId] = useState<string>(""); 

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const parsed = stored ? JSON.parse(stored) : null;
    const id = parsed?.doctorProfile?.tenantId;
    
    // FIXED: Set the state variable
    if (id) {
      setTenantId(id);
    }
  }, []); // Removed patientId dependency as user data doesn't change based on patient


  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [medicaments, setMedicaments] = useState<Medicament[]>([]);
  const [formData, setFormData] = useState({
    medicamentId: '',
    quantity: '1',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
    fromStock: true
  });

  // Fetch Treatments
  const fetchTreatments = async () => {
    try {
      const { data } = await getTreatmentsByPatient(patientId);
      setTreatments(data);
    } catch (error) {
      console.error("Failed to fetch treatments", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Available Medicaments for the Dropdown
  const fetchMedicaments = async () => {
    // FIXED: Check against state variable
    if (!tenantId) return; 

    try {
      const { data } = await getMedicamentsByTenant(tenantId);
      // Only show active medicaments
      setMedicaments(data.filter(m => m.status === 'ACTIVE'));
    } catch (error) {
      console.error("Failed to fetch medicaments", error);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, [patientId]);

  // Load medicaments only when opening the dialog to save resources
  useEffect(() => {
    if (isDialogOpen && tenantId) {
      fetchMedicaments();
    }
  }, [isDialogOpen, tenantId]);

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      await deleteTreatment(id);
      setTreatments(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Failed to delete treatment", error);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // FIXED: Check if tenantId is available before submitting
    if (!tenantId) {
        console.error("Tenant ID not found");
        return;
    }

    try {
      const { data: newTreatment } = await addTreatmentToPatient({
        patientId,
        tenantId, // FIXED: passing the state variable
        medicamentId: formData.medicamentId,
        quantity: parseInt(formData.quantity),
        dosage: formData.dosage,
        frequency: formData.frequency,
        startDate: formData.startDate,
        notes: formData.notes,
        fromStock: formData.fromStock
      });

      setTreatments(prev => [...prev, newTreatment]);
      setIsDialogOpen(false);
      // Reset form
      setFormData({
        medicamentId: '',
        quantity: '1',
        dosage: '',
        frequency: '',
        startDate: new Date().toISOString().split('T')[0],
        notes: '',
        fromStock: true
      });
    } catch (error) {
      console.error("Failed to add treatment", error);
      alert("Failed to add treatment. Check stock levels if 'From Stock' is selected.");
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Pill className="h-5 w-5 text-primary-500" />
          {t("title")}
        </h2>

        {/* Add Treatment Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("add")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t("addTitle")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">

              {/* Medicament Select */}
              <div className="space-y-2">
                <Label>{t("medication")}</Label>
                <Select
                  value={formData.medicamentId}
                  onValueChange={(val) => {
                    const med = medicaments.find(m => m.id === val);
                    setFormData(prev => ({
                      ...prev,
                      medicamentId: val,
                      dosage: med?.dosage || prev.dosage
                    }));
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectMedication")} />
                  </SelectTrigger>
                  <SelectContent className='max-h-[200px] overflow-y-auto'>
                    {medicaments.map((med) => (
                      <SelectItem key={med.id} value={med.id}>
                        {med.name} (Stock: {med.stockQuantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("dosage")}</Label>
                  <Input
                    placeholder="e.g. 500mg"
                    value={formData.dosage}
                    onChange={e => setFormData({ ...formData, dosage: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("frequency")}</Label>
                  <Input
                    placeholder="e.g. 3x/day"
                    value={formData.frequency}
                    onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("startDate")}</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("quantity")}</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Card className="flex items-center justify-between p-3">
                <div className="space-y-0.5">
                  <Label className="text-base">{t("fromStock")}</Label>
                  <p className="text-xs text-gray-500">
                    {t("stockDesc")}
                  </p>
                </div>
                <Switch
                  checked={formData.fromStock}
                  onCheckedChange={(checked) => setFormData({ ...formData, fromStock: checked })}
                />
              </Card>

              <div className="space-y-2">
                <Label>{t("notes")}</Label>
                <Textarea
                  placeholder={t("notesPlaceholder")}
                  value={formData.notes}
                  onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full">
                {t("save")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* List Area */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 py-4">{t("loading")}</p>
        ) : treatments.length === 0 ? (
          <div className="text-center py-8 border-2 border-gray-500 border-dashed rounded-lg text-gray-500">
            <Pill className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>{t("noTreatments")}</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {treatments.map((treatment) => (
              <li key={treatment.id} className="py-4 first:pt-0 last:pb-0 group">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {treatment.medicamentName}
                    </h3>
                    <div className="mt-1 text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{t("dose")}</span>
                        {treatment.dosage}
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{t("freq")}</span>
                        {treatment.frequency}
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{t("start")}</span>
                        {treatment.startDate}
                      </span>
                    </div>
                    {treatment.notes && (
                      <p className="mt-2 text-xs text-gray-500 italic bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
                        {treatment.notes}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(treatment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}