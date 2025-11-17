"use client";

import { useEffect, useState } from "react";
import { Trash2, Edit, Plus, Syringe } from "lucide-react";
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/Dialog";
import { Button } from "@/components/Button";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRoot, TableRow } from "@/components/Table";
import { Input } from "@/components/Input";
import {
  Immunization, ImmunizationCreateDTO, ImmunizationUpdateDTO,
  getImmunizationsByPatient, createImmunization, updateImmunization, deleteImmunization
} from "@/api/medic/Immunization";
import { showToast } from "@/app/[locale]/(protected)/dashboard/hooks/utils";
import { Card } from "@/components/Card";
import { Divider } from "@/components/Divider";
import { DatePickerBirthDateExample } from "@/components/DateBirth";
import LoadingState from "@/components/custom/LoadingState";

export default function VaccinesTable({ patientId }: { patientId: string }) {
  const [vaccines, setVaccines] = useState<Immunization[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{ id?: string; vaccine: string; date: string; dose?: string; notes?: string }>({ vaccine: "", date: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const rowsPerPage = 10;

  // Fetch vaccines
  const fetchVaccines = async () => {
    setLoading(true);
    try {
      const { data } = await getImmunizationsByPatient(patientId);
      setVaccines(data);
    } catch (err) {
      console.error("Failed to fetch immunizations:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (patientId) fetchVaccines();
  }, [patientId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Save
  const handleSave = async () => {
    if (!modalData.vaccine.trim() || !modalData.date) return;

    setSaving(true);
    try {
      if (modalData.id) {
        await updateImmunization(modalData.id, {
          ...modalData,
          patientProfileId: patientId
        } as ImmunizationUpdateDTO);

        showToast("success", "Succès", "Vaccine updated successfully");
      } else {
        await createImmunization({
          ...modalData,
          patientProfileId: patientId
        } as ImmunizationCreateDTO);

        showToast("success", "Succès", "Vaccine created successfully");
      }

      await fetchVaccines();
      setIsModalOpen(false);
      setModalData({ vaccine: "", date: "" });
    } catch (err) {
      console.error("Failed to save vaccine:", err);
    }

    setSaving(false);
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await deleteImmunization(id);
      await fetchVaccines();
      showToast("success", "Succès", "Vaccine deleted successfully");
    } catch (err) {
      console.error("Failed to delete vaccine:", err);
    }
  };

  // Filtering
  const filtered = vaccines.filter(v =>
    v.vaccine.toLowerCase().includes(search.toLowerCase()) ||
    v.date.includes(search) ||
    (v.notes && v.notes.toLowerCase().includes(search.toLowerCase())) ||
    (v.dose && v.dose.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const currentRows = filtered.slice(indexOfLast - rowsPerPage, indexOfLast);

  if (loading) return <LoadingState />;

  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold">Vaccines</h3>
      <Divider />

      <div className="space-y-4">
        <Input
          placeholder="Search vaccines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />

        <div className="flex justify-end">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setModalData({ vaccine: "", date: "", dose: "", notes: "" })}>
                <Syringe className="mr-2 h-4 w-4" /> Add Vaccine
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{modalData.id ? "Edit Vaccine" : "Add Vaccine"}</DialogTitle>
                <DialogDescription>
                  {modalData.id ? "Update vaccine information" : "Add a new vaccine record"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-4">
                <Input
                  placeholder="Vaccine"
                  value={modalData.vaccine}
                  onChange={(e) => setModalData({ ...modalData, vaccine: e.target.value })}
                />

                <DatePickerBirthDateExample
                  value={modalData.date ? new Date(modalData.date) : undefined}
                  onChange={(date) => {
                    if (date) {
                      const nextDay = new Date(date);
                      nextDay.setDate(date.getDate() + 1);
                      setModalData({ ...modalData, date: nextDay.toISOString().split("T")[0] });
                    } else {
                      setModalData({ ...modalData, date: "" });
                    }
                  }}
                />

                <Input
                  placeholder="Dose (optional)"
                  value={modalData.dose || ""}
                  onChange={(e) => setModalData({ ...modalData, dose: e.target.value })}
                />

                <Input
                  placeholder="Notes (optional)"
                  value={modalData.notes || ""}
                  onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <TableRoot>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Vaccine</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Dose</TableHeaderCell>
              <TableHeaderCell>Notes</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 dark:text-gray-400">
                  No vaccines recorded
                </TableCell>
              </TableRow>
            ) : (
              currentRows.map(v => (
                <TableRow key={v.id}>
                  <TableCell>{v.vaccine}</TableCell>
                  <TableCell>{v.date}</TableCell>
                  <TableCell>{v.dose || "-"}</TableCell>
                  <TableCell>{v.notes || "-"}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setModalData({
                            id: v.id,
                            vaccine: v.vaccine,
                            date: v.date,
                            dose: v.dose,
                            notes: v.notes || ""
                          });
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (confirmId === v.id) {
                            handleDelete(v.id);
                            setConfirmId(null);
                          } else {
                            setConfirmId(v.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {confirmId === v.id ? "Confirm?" : "Delete"}
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
          <Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
            Previous
          </Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </Card>
  );
}
