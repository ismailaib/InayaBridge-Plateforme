"use client"

import { Input } from '@/components/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select'
import { Search } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { getDoctorPatients, Patient } from '../api/patients'
import Details from './components/Details'
import TimeLine from './components/TimeLine'

const PatientRecordPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectOpen, setSelectOpen] = useState<boolean>(false)
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

  const searchInputRef = useRef<HTMLInputElement>(null)

  const refetchPatients = React.useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await getDoctorPatients()
      setPatients(data)

      // keep the current selection fresh
      if (selectedPatient) {
        const fresh = data.find(p => p.id === selectedPatient.id)
        setSelectedPatient(fresh ?? null)
      }
    } catch (err) {
      console.error('Failed to refetch patients', err)
    } finally {
      setLoading(false)
    }
  }, [selectedPatient])


  useEffect(() => {
    setLoading(true);
    getDoctorPatients()
      .then((res) => { setPatients(res.data); })
      .catch((err) => {
        console.error("Failed to fetch patients", err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPatients(patients.slice(0, 10))
      return
    }
    const query = searchQuery.toLowerCase()
    const filtered = patients.filter(
      (patient) =>
        patient?.first_name?.toLowerCase().includes(query) ||
        patient?.last_name?.toLowerCase().includes(query)
    )
    setFilteredPatients(filtered)
  }, [searchQuery, patients])

  const handlePatientSelect = (patientId: string): void => {
    const patient = patients.find((p) => String(p.id) === patientId)
    if (patient) setSelectedPatient(patient)
    setSelectOpen(false)
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value)
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="mb-4 flex flex-col items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Patient Record
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Here you can review every detail for a patient
          </p>
        </div>

        <div className="col-span-3 sm:col-span-3">
          <div className="relative mt-2 w-[350px]">
            <Select
              value={selectedPatient?.id?.toString() ?? undefined}
              onValueChange={handlePatientSelect}
              open={selectOpen}
              onOpenChange={setSelectOpen}
            >
              <SelectTrigger id="patient" name="patient">
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-auto">
                <div className="sticky top-0 z-10 bg-white p-2 dark:bg-gray-800">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      ref={searchInputRef}
                      placeholder="Search for a patient..."
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
                      onClick={() => handleSelectItemClick(String(patient?.id?.toString())) ?? ""}
                      value={patient?.id?.toString() ?? ""}
                    >
                      {patient.first_name} {patient.last_name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-2 text-sm text-gray-500">
                    No patients found
                  </div>
                )}

                {filteredPatients.length > 0 && !searchQuery && (
                  <div className="px-2 py-2 text-xs text-gray-500">
                    Type at least 3 characters
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 h-full">
        <div className="col-span-8 h-full">
          {/** @ts-ignore */}
          <Details patient={selectedPatient!} />
        </div>
        <div className="col-span-4 h-full">
          <div className="sticky top-4">
            <TimeLine patient={selectedPatient!} onSuccess={refetchPatients} />
          </div>
        </div>
      </div>

      {/* <Documents patient={selectedPatient!} /> */}
    </div>
  )
}

export default PatientRecordPage
