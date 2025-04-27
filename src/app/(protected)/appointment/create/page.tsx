"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/Button"
import { Divider } from "@/components/Divider"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/Select"
import { DatePicker } from "@/components/DatePicker"
import {
  RadioCardGroup,
  RadioCardIndicator,
  RadioCardItem,
} from "@/components/RadioCardGroup"
import { Search } from "lucide-react"

interface Patient {
  id: string
  firstName: string
  lastName: string
}

export default function RendezVousForm() {
  const [allPatients] = useState<Patient[]>([
    { id: "1", firstName: "John", lastName: "Doe" },
    { id: "2", firstName: "Jane", lastName: "Smith" },
    { id: "3", firstName: "Alice", lastName: "Johnson" },
    // Imagine 1000+ patients here
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(
    allPatients.slice(0, 10),
  )
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  )
  const [value, setValue] = React.useState<Date | undefined>(undefined)
  const [selectOpen, setSelectOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Filter patients when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      // Show limited number of patients when no search is active
      setFilteredPatients(allPatients.slice(0, 10))
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = allPatients.filter(
      (patient) =>
        patient.firstName.toLowerCase().includes(query) ||
        patient.lastName.toLowerCase().includes(query),
    )
    setFilteredPatients(filtered)
  }, [searchQuery, allPatients])

  // Custom handler to prevent dropdown items from capturing focus
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // Ensure search input maintains focus
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus()
      }
    }, 0)
  }

  // Handle dropdown open to focus search input
  useEffect(() => {
    if (selectOpen) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus()
        }
      }, 50)
    }
  }, [selectOpen])

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId)
    setSelectOpen(false)
    setSearchQuery("") // Reset search after selection
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
        Créer un rendez-vous
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Sélectionnez un patient existant ou ajoutez-en un nouveau.
      </p>

      <form className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
          {/* Patient selector with search */}
          <div className="col-span-3 sm:col-span-3">
            <Label htmlFor="patient" className="font-medium">
              Patient<span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-2">
              <Select
                value={selectedPatientId ?? undefined}
                onValueChange={handlePatientSelect}
                open={selectOpen}
                onOpenChange={setSelectOpen}
              >
                <SelectTrigger id="patient" name="patient">
                  <SelectValue placeholder="Sélectionner un patient" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-auto">
                  <div className="sticky top-0 z-10 bg-white p-2 dark:bg-gray-800">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        ref={searchInputRef}
                        placeholder="Rechercher un patient..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        className="pl-8 text-sm"
                        autoComplete="off"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          // Prevent dropdown from capturing arrow keys for navigation
                          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                            e.stopPropagation()
                          }
                        }}
                      />
                    </div>
                  </div>

                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((p) => (
                      <SelectItem
                        key={p.id}
                        className="cursor-pointer px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => handlePatientSelect(p.id)}
                        value={p.id}
                      >
                        {p.firstName} {p.lastName}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-2 text-sm text-gray-500">
                      Aucun patient trouvé
                    </div>
                  )}
                  {filteredPatients.length > 0 && !searchQuery && (
                    <div className="px-2 py-2 text-xs text-gray-500">
                      Saisissez au moins 3 caractères pour rechercher parmi tous
                      les patients
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date */}
          <div className="col-span-full sm:col-span-3">
            <Label htmlFor="date" className="font-medium">
              Date<span className="text-red-500">*</span>
            </Label>
            <DatePicker
              className="mt-2"
              showTimePicker
              value={value}
              onChange={(value) => {
                setValue(value)
              }}
            />
          </div>

          {/* Motif */}
          <div className="col-span-full sm:col-span-3">
            <Label htmlFor="motif" className="font-medium">
              Motif<span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="motif"
              name="motif"
              placeholder="Ex. Bilan sanguin"
              className="mt-2"
            />
          </div>

          <div className="col-span-full sm:col-span-3">
            <Label htmlFor="note" className="font-medium">
              Note
            </Label>
            <Input
              type="textarea"
              id="note"
              name="note"
              placeholder="Ex. Note"
              className="mt-2"
            />
          </div>

          {/* Lieu */}
          <div className="col-span-full sm:col-span-6">
            <Label htmlFor="lieu" className="font-medium">
              Lieu<span className="text-red-500">*</span>
            </Label>
            <div>
              <RadioCardGroup className="mt-2 flex flex-wrap gap-4">
                <RadioCardItem value="1" className="min-w-48 flex-1">
                  <div className="flex items-start gap-3">
                    <RadioCardIndicator className="mt-1" />
                    <div>
                      <span className="sm:text-sm">Cabinet principal</span>
                      <p className="mt-1 text-xs text-gray-500">description</p>
                    </div>
                  </div>
                </RadioCardItem>
                <RadioCardItem value="2" className="min-w-48 flex-1">
                  <div className="flex items-start gap-3">
                    <RadioCardIndicator className="mt-1" />
                    <div>
                      <span className="sm:text-sm">À domicile</span>
                      <p className="mt-1 text-xs text-gray-500">description</p>
                    </div>
                  </div>
                </RadioCardItem>
                <RadioCardItem value="3" className="min-w-48 flex-1">
                  <div className="flex items-start gap-3">
                    <RadioCardIndicator className="mt-1" />
                    <div>
                      <span className="sm:text-sm">Télécommunication</span>
                      <p className="mt-1 text-xs text-gray-500">description</p>
                    </div>
                  </div>
                </RadioCardItem>
              </RadioCardGroup>
            </div>
          </div>
        </div>

        <Divider />

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Button variant="secondary" type="button">
            Annuler
          </Button>
          <Button type="submit">Créer le rendez-vous</Button>
        </div>
      </form>
    </div>
  )
}
