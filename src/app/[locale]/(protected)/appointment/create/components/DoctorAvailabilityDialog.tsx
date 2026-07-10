"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/Button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog"
import { Badge } from "@/components/Badge"
import { Calendar, Clock } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table"
import { getAvailabilitySlotsByDoctor } from "@/api/disponibility"
import LoadingState from "@/components/custom/LoadingState"

interface AvailabilitySlot {
  dayOfWeek: string
  active: boolean
  timeSlots: { from: string; to: string }[]
}

interface DoctorAvailabilityDialogProps {
  doctorId: string
}

const formatDay = (day: string) => {
  const map: Record<string, string> = {
    MONDAY: "Lundi",
    TUESDAY: "Mardi",
    WEDNESDAY: "Mercredi",
    THURSDAY: "Jeudi",
    FRIDAY: "Vendredi",
    SATURDAY: "Samedi",
    SUNDAY: "Dimanche",
  }
  return map[day] || day
}

export const DoctorAvailabilityDialog = ({ doctorId }: DoctorAvailabilityDialogProps) => {
  const [availabilityData, setAvailabilityData] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (doctorId) {
      setLoading(true)
      setError(null)
      getAvailabilitySlotsByDoctor(doctorId)
        .then((res: { data: any }) => {
          setAvailabilityData(res.data || [])
          setLoading(false)
        })
        .catch(() => {
          setError("Erreur lors du chargement des disponibilités")
          setLoading(false)
        })
    }
  }, [doctorId])

  return (
    <div className="flex justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="light" className="text-sm flex items-center gap-2">
            <Calendar width={18} />
            Voir les disponibilités
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Disponibilités du médecin</DialogTitle>
            <DialogDescription className="mt-1 text-sm leading-6">
              Consultez les jours et les horaires de disponibilité du médecin.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 overflow-x-auto">
            {loading ? (
              <p className="text-center text-gray-500"><LoadingState /></p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : availabilityData.length === 0 ? (
              <p className="text-center text-gray-500">Aucune disponibilité trouvée.</p>
            ) : (
              <TableRoot>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Jour</TableHeaderCell>
                      <TableHeaderCell>Statut</TableHeaderCell>
                      <TableHeaderCell>Horaires</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {availabilityData.map((day) => (
                      <TableRow
                        key={day.dayOfWeek}
                        className={`bg-gray-50 dark:bg-gray-950/40 hover:bg-gray-100 dark:hover:bg-gray-900`}
                      >
                        <TableCell className="font-medium">
                          {formatDay(day.dayOfWeek)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={day.active ? "success" : "neutral"}>
                            {day.active ? "Actif" : "Inactif"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-row gap-4">
                            {day.timeSlots.length > 0 ? (
                              day.timeSlots.map((slot, i) => (
                                <div
                                  key={i}
                                  className={`flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400`}
                                >
                                  <Clock size={12} />
                                  {slot.from.slice(0, 5)} - {slot.to.slice(0, 5)}
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                Aucun horaire défini
                              </p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableRoot>
            )}
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="secondary" className="w-full sm:w-fit">
                Fermer
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}