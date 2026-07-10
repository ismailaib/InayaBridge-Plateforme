"use client"

import {
  Allergy,
  AllergyCreateDTO,
  AllergyUpdateDTO,
  createAllergy,
  deleteAllergy,
  getAllergiesByPatient,
  updateAllergy
} from "@/api/medic/Allergy"
import { showToast } from "@/app/[locale]/(protected)/dashboard/hooks/utils"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import LoadingState from "@/components/custom/LoadingState"
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/Dialog"
import { Divider } from "@/components/Divider"
import { Input } from "@/components/Input"
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRoot, TableRow } from "@/components/Table"
import { Edit, MilkOff, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

interface Props {
  patientId: string
}

export default function AllergiesTable({ patientId }: Props) {
  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalData, setModalData] = useState({ allergen: "", reaction: "", severity: "", id: "" })
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const rowsPerPage = 10

  // Fetch allergies for patient
  const fetchAllergies = async () => {
    setLoading(true)
    try {
      const { data } = await getAllergiesByPatient(patientId)
      setAllergies(data)
    } catch (err) {
      console.error("Failed to fetch allergies:", err)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (patientId)
      fetchAllergies()
  }, [patientId])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Save or update allergy
  const handleSave = async () => {
    if (!modalData.allergen.trim()) return
    try {
      if (modalData.id) {
        const updateData: AllergyUpdateDTO = {
          patientProfileId: patientId,
          allergen: modalData.allergen,
          reaction: modalData.reaction,
          severity: modalData.severity,
        }
        await updateAllergy(modalData.id, updateData)
        showToast("success", "Succès", "Allergy updated successfully")
      } else {
        const createData: AllergyCreateDTO = {
          patientProfileId: patientId,
          allergen: modalData.allergen,
          reaction: modalData.reaction,
          severity: modalData.severity,
        }
        await createAllergy(createData)
        showToast("success", "Succès", "Allergy created successfully")
      }
      await fetchAllergies()
      setIsModalOpen(false)
      setModalData({ allergen: "", reaction: "", severity: "", id: "" })
    } catch (err) {
      console.error("Failed to save allergy:", err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAllergy(id)
      await fetchAllergies()
      showToast("success", "Succès", "Allergy deleted successfully")
    } catch (err) {
      console.error("Failed to delete allergy:", err)
    }
  }

  const filteredAllergies = allergies.filter(allergy =>
    allergy.allergen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (allergy.reaction && allergy.reaction.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (allergy.severity && allergy.severity.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalPages = Math.ceil(filteredAllergies.length / rowsPerPage)
  const indexOfLast = currentPage * rowsPerPage
  const indexOfFirst = indexOfLast - rowsPerPage
  const currentAllergies = filteredAllergies.slice(indexOfFirst, indexOfLast)

  if (loading) return <LoadingState />

  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold">Allergies</h3>
      <Divider />
      <div className="space-y-4">
        <Input
          placeholder="Search allergies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <div className="flex justify-end">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setModalData({ allergen: "", reaction: "", severity: "", id: "" })}>
                <MilkOff className="mr-2 h-4 w-4" /> Add Allergy
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{modalData.id ? "Edit Allergy" : "Add Allergy"}</DialogTitle>
                <DialogDescription>
                  {modalData.id ? "Update the allergy information" : "Add a new allergy to the record"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 my-4">
                <Input
                  placeholder="Allergen"
                  value={modalData.allergen}
                  onChange={(e) => setModalData({ ...modalData, allergen: e.target.value })}
                />
                <Input
                  placeholder="Reaction"
                  value={modalData.reaction}
                  onChange={(e) => setModalData({ ...modalData, reaction: e.target.value })}
                />
                <Input
                  placeholder="Severity"
                  value={modalData.severity}
                  onChange={(e) => setModalData({ ...modalData, severity: e.target.value })}
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
      </div>
      <TableRoot>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Allergen</TableHeaderCell>
              <TableHeaderCell>Reaction</TableHeaderCell>
              <TableHeaderCell>Severity</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentAllergies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 dark:text-gray-400">
                  No allergies recorded
                </TableCell>
              </TableRow>
            ) : (
              currentAllergies.map((allergy, index) => (
                <TableRow
                  key={allergy.id}
                >

                  <TableCell>{allergy.allergen}</TableCell>
                  <TableCell>{allergy.reaction}</TableCell>
                  <TableCell>{allergy.severity}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setModalData({ id: allergy.id, allergen: allergy.allergen, reaction: allergy.reaction ?? "", severity: allergy.severity ?? "" });
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                      <Button
                        variant={confirmingId === allergy.id ? "destructive" : "destructive"}
                        onClick={() => {
                          if (confirmingId === allergy.id) {
                            handleDelete(allergy.id)
                            setConfirmingId(null)
                          } else {
                            setConfirmingId(allergy.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {confirmingId === allergy.id ? "Confirmer ?" : "Supprimer"}
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