"use client"

import React, { useEffect, useRef, useState } from 'react'
import TimeLine from './components/TimeLine'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select'
import { Search } from 'lucide-react'
import { Input } from '@/components/Input'
import Documents from './components/Documents'
import Details from './components/Details'

interface Patient {
  id: string
  firstName: string
  lastName: string
}

const PatientDossierPage: React.FC = () => {
  // State declarations
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [selectOpen, setSelectOpen] = useState<boolean>(false)
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [allPatients] = useState<Patient[]>([
    { id: "1", firstName: "John", lastName: "Doe" },
    { id: "2", firstName: "Jane", lastName: "Smith" },
    { id: "3", firstName: "Alice", lastName: "Johnson" },
    // Imagine 1000+ patients here
  ])

  // Refs
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
        patient.lastName.toLowerCase().includes(query)
    )
    setFilteredPatients(filtered)
  }, [searchQuery, allPatients])

  // Handler functions
  const handlePatientSelect = (patientId: string): void => {
    setSelectedPatientId(patientId)
    setSelectOpen(false)
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value)
    // Ensure search input maintains focus
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    // Prevent dropdown from capturing arrow keys for navigation
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.stopPropagation()
    }
  }

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>): void => {
    e.stopPropagation()
  }

  const handleSelectItemClick = (patientId: string): void => {
    handlePatientSelect(patientId)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="mb-4 flex flex-col items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Dossier Patient
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ici vous pouvez consulter tous les détails concernant un patient
          </p>
        </div>

        <div>
          {/* Patient selector with search */}
          <div className="col-span-3 sm:col-span-3">
            <div className="relative mt-2 w-[350px]">
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
                        onClick={handleInputClick}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                  </div>

                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <SelectItem
                        key={patient.id}
                        className="cursor-pointer px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => handleSelectItemClick(patient.id)}
                        value={patient.id}
                      >
                        {patient.firstName} {patient.lastName}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-2 text-sm text-gray-500">
                      Aucun patient trouvé
                    </div>
                  )}

                  {filteredPatients.length > 0 && !searchQuery && (
                    <div className="px-2 py-2 text-xs text-gray-500">
                      Saisissez au moins 3 caractères
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 h-full">
        <div className="col-span-8 h-full">
          <Details />
        </div>
        <div className="col-span-4 h-full">
          <div className="sticky top-4">
            <TimeLine />
          </div>
        </div>
      </div>
      <Documents />
    </div>
  )
}

export default PatientDossierPage