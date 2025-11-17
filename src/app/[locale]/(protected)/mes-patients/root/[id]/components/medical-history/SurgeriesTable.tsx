"use client"

import { useEffect, useState } from "react"
import { Trash2, Edit, Plus, BriefcaseMedical } from "lucide-react"
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/Dialog"
import { Button } from "@/components/Button"
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRoot, TableRow } from "@/components/Table"
import { Input } from "@/components/Input"
import {
  Surgery, SurgeryCreateDTO, SurgeryUpdateDTO,
  getSurgeriesByPatient, createSurgery, updateSurgery, deleteSurgery
} from "@/api/medic/Surgery"
import { showToast } from "@/app/[locale]/(protected)/dashboard/hooks/utils"
import { Card } from "@/components/Card"
import { Divider } from "@/components/Divider"
import { DatePickerBirthDateExample } from "@/components/DateBirth"

export default function SurgeriesTable({ patientId }: { patientId: string }) {
  const [surgeries, setSurgeries] = useState<Surgery[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalData, setModalData] = useState<{ id?: string; name: string; date: string; notes?: string }>({ name: "", date: "" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const rowsPerPage = 10

  const fetchSurgeries = async () => {
    setLoading(true)
    try {
      const { data } = await getSurgeriesByPatient(patientId)
      setSurgeries(data)
    } catch (err) {
      console.error("Failed to fetch surgeries:", err)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (patientId) fetchSurgeries()
  }, [patientId])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleSave = async () => {
    if (!modalData.name.trim() || !modalData.date) return
    setSaving(true)
    try {
      if (modalData.id) {
        await updateSurgery(modalData.id, { name: modalData.name, date: modalData.date, notes: modalData.notes, patientProfileId: patientId } as SurgeryUpdateDTO)
        showToast("success", "Succès", "Surgery updated successfully")
      } else {
        await createSurgery({ patientProfileId: patientId, name: modalData.name, date: modalData.date, notes: modalData.notes } as SurgeryCreateDTO)
        showToast("success", "Succès", "Surgery created successfully")
      }
      await fetchSurgeries()
      setIsModalOpen(false)
      setModalData({ name: "", date: "" })
    } catch (err) {
      console.error("Failed to save surgery:", err)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteSurgery(id)
      await fetchSurgeries()
      showToast("success", "Succès", "Surgery deleted successfully")
    } catch (err) {
      console.error("Failed to delete surgery:", err)
    }
  }

  const filteredSurgeries = surgeries.filter(surgery =>
    surgery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surgery.date.includes(searchTerm) ||
    (surgery.notes && surgery.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalPages = Math.ceil(filteredSurgeries.length / rowsPerPage)
  const indexOfLast = currentPage * rowsPerPage
  const indexOfFirst = indexOfLast - rowsPerPage
  const currentSurgeries = filteredSurgeries.slice(indexOfFirst, indexOfLast)

  if (loading) return <div></div>

  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold">Surgeries</h3>
      <Divider />
      <div className="space-y-4">
        <Input
          placeholder="Search surgeries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <div className="flex justify-end">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setModalData({ name: "", date: "", notes: "" })}>
                <BriefcaseMedical className="mr-2 h-4 w-4" /> Add Surgery
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{modalData.id ? "Edit Surgery" : "Add Surgery"}</DialogTitle>
                <DialogDescription className="mt-1 text-sm leading-6">
                  {modalData.id ? "Update the surgery information" : "Add a new surgery to the medical history"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-4">
                <Input placeholder="Name" value={modalData.name} onChange={(e) => setModalData({ ...modalData, name: e.target.value })} />

                <DatePickerBirthDateExample
                  value={modalData.date ? new Date(modalData.date) : undefined}
                  onChange={(date) => {
                    if (date) {
                      const nextDay = new Date(date);
                      nextDay.setDate(date.getDate() + 1);
                      setModalData({ ...modalData, date: nextDay.toISOString().split('T')[0] });
                    } else {
                      setModalData({ ...modalData, date: "" });
                    }
                  }}
                />

                <Input placeholder="Notes" value={modalData.notes || ""} onChange={(e) => setModalData({ ...modalData, notes: e.target.value })} />
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
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Notes</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentSurgeries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 dark:text-gray-400">No surgeries recorded</TableCell>
              </TableRow>
            ) : (
              currentSurgeries.map((surgery) => (
                <TableRow key={surgery.id}>
                  <TableCell>{surgery.name}</TableCell>
                  <TableCell>{surgery.date}</TableCell>
                  <TableCell>{surgery.notes || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => { setModalData({ id: surgery.id, name: surgery.name, date: surgery.date, notes: surgery.notes || "" }); setIsModalOpen(true) }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                      <Button
                        variant={confirmingId === surgery.id ? "destructive" : "destructive"}
                        onClick={() => {
                          if (confirmingId === surgery.id) {
                            handleDelete(surgery.id)
                            setConfirmingId(null)
                          } else {
                            setConfirmingId(surgery.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {confirmingId === surgery.id ? "Confirmer ?" : "Supprimer"}
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
  )
}