"use client";

import { Button } from "@/components/Button";
import {
  Dialog, DialogClose, DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/Dialog";
import { Input } from "@/components/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeaderCell, TableRoot,
  TableRow
} from "@/components/Table";
import { ClipboardPlus, Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import {
  PastDisease, PastDiseaseCreateDTO, PastDiseaseUpdateDTO,
  createPastDisease,
  deletePastDisease,
  getPastDiseasesByPatient,
  updatePastDisease
} from "@/api/medic/PastDisease";
import { showToast } from "@/app/[locale]/(protected)/dashboard/hooks/utils";
import { Card } from "@/components/Card";
import { Divider } from "@/components/Divider";
import { DatePickerBirthDateExample } from "@/components/DateBirth";
import LoadingState from "@/components/custom/LoadingState";

export default function PastDiseasesTable({ patientId }: { patientId: string }) {
  const [diseases, setDiseases] = useState<PastDisease[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{ id?: string; name: string; severity: PastDisease["severity"]; diagnosisDate: string; status: PastDisease["status"]; notes: string; }>({
    name: "",
    severity: "mild",
    diagnosisDate: "",
    status: "active",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const rowsPerPage = 10;

  const fetchDiseases = async () => {
    setLoading(true);
    try {
      const { data } = await getPastDiseasesByPatient(patientId);
      setDiseases(data);
    } catch (err) {
      console.error("Failed to fetch diseases:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (patientId) fetchDiseases();
  }, [patientId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSave = async () => {
    if (!modalData.name.trim() || !modalData.diagnosisDate) return;

    setSaving(true);
    try {
      if (modalData.id) {
        await updatePastDisease(modalData.id, { name: modalData.name, severity: modalData.severity, diagnosisDate: modalData.diagnosisDate, status: modalData.status, notes: modalData.notes , patientProfileId: patientId} as PastDiseaseUpdateDTO);
        showToast("success", "Succès", "Disease updated successfully");
      } else {
        await createPastDisease({ patientProfileId: patientId, name: modalData.name, severity: modalData.severity, diagnosisDate: modalData.diagnosisDate, status: modalData.status, notes: modalData.notes } as PastDiseaseCreateDTO);
        showToast("success", "Succès", "Disease saved successfully");
      }
      await fetchDiseases();
      setIsModalOpen(false);
      setModalData({ name: "", severity: "mild", diagnosisDate: "", status: "active", notes: "" });
    } catch (err) {
      console.error("Failed to save disease:", err);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePastDisease(id);
      await fetchDiseases();
      showToast("success", "Succès", "Disease deleted successfully");
    } catch (err) {
      console.error("Failed to delete disease:", err);
    }
  };

  const filteredDiseases = diseases.filter(disease =>
    disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease?.severity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.diagnosisDate.includes(searchTerm) ||
    disease?.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (disease.notes && disease.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredDiseases.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentDiseases = filteredDiseases.slice(indexOfFirst, indexOfLast);

  if (loading) return <LoadingState />;

  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold">Past Diseases</h3>
      <Divider />
      <div className="space-y-4">
        <Input
          placeholder="Search diseases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <div className="flex justify-end">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setModalData({ name: "", severity: "mild", diagnosisDate: "", status: "active", notes: "" })}>
                <ClipboardPlus className="mr-2 h-4 w-4" /> Add Disease
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{modalData.id ? "Edit Disease" : "Add Disease"}</DialogTitle>
                <DialogDescription className="mt-1 text-sm leading-6">
                  {modalData.id ? "Update the disease information" : "Add a new disease to the medical history"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-4">
                <Input placeholder="Name" value={modalData.name} onChange={(e) => setModalData({ ...modalData, name: e.target.value })} />

                <Select value={modalData.severity} onValueChange={(v) => setModalData({ ...modalData, severity: v as PastDisease["severity"] })}>
                  <SelectTrigger><SelectValue placeholder="Severity" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>

                <DatePickerBirthDateExample
                  value={modalData.diagnosisDate ? new Date(modalData.diagnosisDate) : undefined}
                  onChange={(date) => {
                    if (date) {
                      const nextDay = new Date(date);
                      nextDay.setDate(date.getDate() + 1);
                      setModalData({ ...modalData, diagnosisDate: nextDay.toISOString().split('T')[0] });
                    } else {
                      setModalData({ ...modalData, diagnosisDate: "" });
                    }
                  }}
                />

                <Select value={modalData.status} onValueChange={(v) => setModalData({ ...modalData, status: v as PastDisease["status"] })}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Input placeholder="Notes" value={modalData.notes} onChange={(e) => setModalData({ ...modalData, notes: e.target.value })} />
              </div>

              <DialogFooter>
                <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <TableRoot>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Severity</TableHeaderCell>
              <TableHeaderCell>Diagnosis Date</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Notes</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentDiseases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 dark:text-gray-400">No diseases recorded</TableCell>
              </TableRow>
            ) : (
              currentDiseases.map((disease, index) => (
                <TableRow
                  key={disease.id}
                >
                  <TableCell>{disease.name}</TableCell>
                  <TableCell>{disease.severity}</TableCell>
                  <TableCell>{disease.diagnosisDate}</TableCell>
                  <TableCell>{disease.status}</TableCell>
                  <TableCell>{disease.notes || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setModalData({ id: disease.id, name: disease.name, severity: disease.severity, diagnosisDate: disease.diagnosisDate, status: disease.status, notes: disease.notes || "" });
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                      <Button
                        variant={confirmingId === disease.id ? "destructive" : "destructive"}
                        onClick={() => {
                          if (confirmingId === disease.id) {
                            handleDelete(disease.id)
                            setConfirmingId(null)
                          } else {
                            setConfirmingId(disease.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {confirmingId === disease.id ? "Confirmer ?" : "Supprimer"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableRoot>
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </Card>
  );
}