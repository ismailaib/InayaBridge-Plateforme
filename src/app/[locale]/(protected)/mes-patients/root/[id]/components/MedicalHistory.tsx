import { useState } from "react";
import { Trash2, Edit } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import { Button } from "@/components/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table";
import { Input } from "@/components/Input";
import { Card } from "@/components/Card";
import { Checkbox } from "@/components/Checkbox";

// ============= TYPES =============
interface Surgery {
  name: string;
  date: string;
  notes: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

interface Allergy {
  type: string;
  allergen: string;
  reaction: string;
}

interface Hospitalization {
  reason: string;
  date: string;
  hospital: string;
}

interface Immunization {
  vaccine: string;
  date: string;
  notes: string;
}

interface MedicalHistoryFormData {
  pastDiseases: string[];
  surgeries: Surgery[];
  chronicConditions: string[];
  hospitalizations: Hospitalization[];
  familyHistory: string[];
  smoking: boolean;
  alcohol: boolean;
  drugs: boolean;
  diet: string;
  exercise: string;
  medications: Medication[];
  allergies: Allergy[];
  immunizationsHistory: Immunization[];
}

// ============= PAST DISEASES TABLE =============
interface PastDiseasesTableProps {
  diseases: string[];
  onEdit: (index: number, disease: string) => void;
  onDelete: (index: number) => void;
  onAdd: (disease: string) => void;
}

function PastDiseasesTable({ diseases, onEdit, onDelete, onAdd }: PastDiseasesTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ disease: "", index: -1 });

  const handleSave = () => {
    if (modalData.disease.trim()) {
      if (modalData.index >= 0) {
        onEdit(modalData.index, modalData.disease);
      } else {
        onAdd(modalData.disease);
      }
      setModalData({ disease: "", index: -1 });
      setIsModalOpen(false);
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Past Diseases
        </label>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setModalData({ disease: "", index: -1 })}>
              Add Disease
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{modalData.index >= 0 ? "Edit Disease" : "Add Disease"}</DialogTitle>
              <DialogDescription className="mt-1 text-sm leading-6">
                {modalData.index >= 0 ? "Update the disease information" : "Add a new disease to the medical history"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 my-4">
              <Input
                placeholder="Enter disease name"
                value={modalData.disease}
                onChange={(e) => setModalData({ ...modalData, disease: e.target.value })}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <TableRoot>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Disease</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {diseases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-gray-500 dark:text-gray-400">
                  No diseases recorded
                </TableCell>
              </TableRow>
            ) : (
              diseases.map((disease, index) => (
                <TableRow key={index}>
                  <TableCell>{disease}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setModalData({ disease, index });
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => onDelete(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableRoot>
    </Card>
  );
}

// ============= SURGERIES TABLE =============
interface SurgeriesTableProps {
  surgeries: Surgery[];
  onEdit: (index: number, surgery: Surgery) => void;
  onDelete: (index: number) => void;
  onAdd: (surgery: Surgery) => void;
}

function SurgeriesTable({ surgeries, onEdit, onDelete, onAdd }: SurgeriesTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ name: "", date: "", notes: "", index: -1 });

  const handleSave = () => {
    if (modalData.name.trim()) {
      const { index, ...data } = modalData;
      if (index >= 0) {
        onEdit(index, data);
      } else {
        onAdd(data);
      }
      setModalData({ name: "", date: "", notes: "", index: -1 });
      setIsModalOpen(false);
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Surgeries
        </label>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setModalData({ name: "", date: "", notes: "", index: -1 })}>
              Add Surgery
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{modalData.index >= 0 ? "Edit Surgery" : "Add Surgery"}</DialogTitle>
              <DialogDescription className="mt-1 text-sm leading-6">
                {modalData.index >= 0 ? "Update the surgery information" : "Add a new surgery to the medical history"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 my-4">
              <Input
                placeholder="Surgery name"
                value={modalData.name}
                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
              />
              <Input
                type="date"
                value={modalData.date}
                onChange={(e) => setModalData({ ...modalData, date: e.target.value })}
              />
              <Input
                placeholder="Notes"
                value={modalData.notes}
                onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <TableRoot>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Notes</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {surgeries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 dark:text-gray-400">
                  No surgeries recorded
                </TableCell>
              </TableRow>
            ) : (
              surgeries.map((surgery, index) => (
                <TableRow key={index}>
                  <TableCell>{surgery.name}</TableCell>
                  <TableCell>{surgery.date}</TableCell>
                  <TableCell>{surgery.notes}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setModalData({ ...surgery, index });
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => onDelete(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableRoot>
    </Card>
  );
}

// ============= MEDICATIONS TABLE =============
interface MedicationsTableProps {
  medications: Medication[];
  onEdit: (index: number, medication: Medication) => void;
  onDelete: (index: number) => void;
  onAdd: (medication: Medication) => void;
}

function MedicationsTable({ medications, onEdit, onDelete, onAdd }: MedicationsTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ name: "", dosage: "", frequency: "", index: -1 });

  const handleSave = () => {
    if (modalData.name.trim()) {
      const { index, ...data } = modalData;
      if (index >= 0) {
        onEdit(index, data);
      } else {
        onAdd(data);
      }
      setModalData({ name: "", dosage: "", frequency: "", index: -1 });
      setIsModalOpen(false);
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Medications
        </label>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setModalData({ name: "", dosage: "", frequency: "", index: -1 })}>
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{modalData.index >= 0 ? "Edit Medication" : "Add Medication"}</DialogTitle>
              <DialogDescription className="mt-1 text-sm leading-6">
                {modalData.index >= 0 ? "Update the medication information" : "Add a new medication to the record"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 my-4">
              <Input
                placeholder="Medication name"
                value={modalData.name}
                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
              />
              <Input
                placeholder="Dosage (e.g., 500mg)"
                value={modalData.dosage}
                onChange={(e) => setModalData({ ...modalData, dosage: e.target.value })}
              />
              <Input
                placeholder="Frequency (e.g., twice daily)"
                value={modalData.frequency}
                onChange={(e) => setModalData({ ...modalData, frequency: e.target.value })}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <TableRoot>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Dosage</TableHeaderCell>
              <TableHeaderCell>Frequency</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 dark:text-gray-400">
                  No medications recorded
                </TableCell>
              </TableRow>
            ) : (
              medications.map((med, index) => (
                <TableRow key={index}>
                  <TableCell>{med.name}</TableCell>
                  <TableCell>{med.dosage}</TableCell>
                  <TableCell>{med.frequency}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setModalData({ ...med, index });
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => onDelete(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableRoot>
    </Card>
  );
}

// ============= MAIN COMPONENT =============
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

  // Past Diseases Handlers
  const handleAddPastDisease = (disease: string) => {
    setFormData((prev) => ({
      ...prev,
      pastDiseases: [...prev.pastDiseases, disease],
    }));
  };

  const handleEditPastDisease = (index: number, disease: string) => {
    const updated = [...formData.pastDiseases];
    updated[index] = disease;
    setFormData((prev) => ({ ...prev, pastDiseases: updated }));
  };

  const handleDeletePastDisease = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pastDiseases: prev.pastDiseases.filter((_, i) => i !== index),
    }));
  };

  // Surgeries Handlers
  const handleAddSurgery = (surgery: Surgery) => {
    setFormData((prev) => ({
      ...prev,
      surgeries: [...prev.surgeries, surgery],
    }));
  };

  const handleEditSurgery = (index: number, surgery: Surgery) => {
    const updated = [...formData.surgeries];
    updated[index] = surgery;
    setFormData((prev) => ({ ...prev, surgeries: updated }));
  };

  const handleDeleteSurgery = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      surgeries: prev.surgeries.filter((_, i) => i !== index),
    }));
  };

  // Medications Handlers
  const handleAddMedication = (medication: Medication) => {
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, medication],
    }));
  };

  const handleEditMedication = (index: number, medication: Medication) => {
    const updated = [...formData.medications];
    updated[index] = medication;
    setFormData((prev) => ({ ...prev, medications: updated }));
  };

  const handleDeleteMedication = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    console.log("Saving medical history:", formData);
    alert("Medical history saved successfully!");
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data?")) {
      setFormData({
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
    }
  };

  return (
    <div className="min-h-screen">
      <div className="space-y-6">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Medical Background
          </h2>

          {/* History Section */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b dark:border-gray-700 pb-2">
              Medical History
            </h3>

            <PastDiseasesTable
              diseases={formData.pastDiseases}
              onAdd={handleAddPastDisease}
              onEdit={handleEditPastDisease}
              onDelete={handleDeletePastDisease}
            />

            <SurgeriesTable
              surgeries={formData.surgeries}
              onAdd={handleAddSurgery}
              onEdit={handleEditSurgery}
              onDelete={handleDeleteSurgery}
            />
          </div>

          {/* Social History Section */}
          <Card className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b dark:border-gray-700 pb-2">
              Social History
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <Checkbox
                  checked={formData.smoking}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, smoking: checked as boolean }))}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Smoking
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <Checkbox
                  checked={formData.alcohol}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, alcohol: checked as boolean }))}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Alcohol
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <Checkbox
                  checked={formData.drugs}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, drugs: checked as boolean }))}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Drugs
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Diet
                </label>
                <Input
                  value={formData.diet}
                  onChange={(e) => setFormData((prev) => ({ ...prev, diet: e.target.value }))}
                  placeholder="Describe diet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Exercise
                </label>
                <Input
                  value={formData.exercise}
                  onChange={(e) => setFormData((prev) => ({ ...prev, exercise: e.target.value }))}
                  placeholder="Describe exercise routine"
                />
              </div>
            </div>
          </Card>

          {/* Medications Section */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b dark:border-gray-700 pb-2">
              Medications & Allergies
            </h3>

            <MedicationsTable
              medications={formData.medications}
              onAdd={handleAddMedication}
              onEdit={handleEditMedication}
              onDelete={handleDeleteMedication}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 dark:border-gray-700">
            <Button variant="secondary" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}