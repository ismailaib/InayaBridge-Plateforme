"use client"

import { useState } from "react"
import { Card } from "@/components/Card"
import { Stethoscope, UserRound, Edit, Check, X, RotateCw } from "lucide-react"
import { updateAppointment } from "@/api/appointments"
import type { Appointment } from "@/api/appointments"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"
import { CalendarAppointment } from "../helpers/types"

export const ServiceDoctorSection = ({
  appointment,
  services,
  employees,
  onUpdate,
}: {
  appointment: CalendarAppointment
  services: { id: string; name: string }[]
  employees: { doctorId: string; firstName: string; lastName: string }[]
  onUpdate?: (updated: Appointment) => void
}) => {
  const [editingField, setEditingField] = useState<string | null>(null)
  const [hoveredField, setHoveredField] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState<any>("")
  const [loading, setLoading] = useState(false)
  const [localAppointment, setLocalAppointment] = useState(appointment)

  const selectedService = services.find((s) => s.id === localAppointment.serviceId)
  const selectedDoctor = employees.find((e) => e.doctorId === localAppointment.doctorProfileId)

  const handleSave = async (field: "service" | "doctor") => {
    if (loading) return
    try {
      setLoading(true)
      let updateData: any = {}
      if (field === "service") updateData.serviceId = tempValue
      else if (field === "doctor") updateData.doctorProfileId = tempValue

      const res = await updateAppointment(localAppointment.id, updateData)
      setLocalAppointment({ ...localAppointment, ...updateData })
      onUpdate?.(res.data)

      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      setLoading(false)
      setEditingField(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0}}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut"}}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Service */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Card className="p-4 h-full">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <Stethoscope className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-50">Service</h4>
            </div>

            <div
              className="relative group"
              onMouseEnter={() => setHoveredField("service")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <AnimatePresence mode="wait">
                {editingField === "service" ? (
                  <motion.div
                    key="service-edit"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="flex items-center gap-2"
                  >
                    <Select value={tempValue} onValueChange={setTempValue}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select" aria-label={tempValue} />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button onClick={() => handleSave("service")} disabled={loading} className="text-green-600">
                      {loading ? <RotateCw size={16} className="animate-spin" /> : <Check size={16} />}
                    </button>
                    <button onClick={() => setEditingField(null)} className="text-red-500">
                      <X size={16} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="service-display"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="flex items-center gap-1"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedService?.name || "--"}</p>
                    <AnimatePresence>
                      {hoveredField === "service" && (
                        <motion.div
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -5 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                        >
                          <Edit
                            size={14}
                            className="ml-1 cursor-pointer text-gray-400 hover:text-gray-600"
                            onClick={() => {
                              setEditingField("service")
                              setTempValue(localAppointment.serviceId || "")
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Doctor */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
      >
        <Card className="p-4 h-full">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <UserRound className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-50">Médecin</h4>
            </div>

            <div
              className="relative group"
              onMouseEnter={() => setHoveredField("doctor")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <AnimatePresence mode="wait">
                {editingField === "doctor" ? (
                  <motion.div
                    key="doctor-edit"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="flex items-center gap-2"
                  >
                    <Select value={tempValue} onValueChange={setTempValue}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select" aria-label={tempValue} />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((e) => (
                          <SelectItem key={e.doctorId} value={e.doctorId}>
                            {e.firstName} {e.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button onClick={() => handleSave("doctor")} disabled={loading} className="text-green-600">
                      {loading ? <RotateCw size={16} className="animate-spin" /> : <Check size={16} />}
                    </button>
                    <button onClick={() => setEditingField(null)} className="text-red-500">
                      <X size={16} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="doctor-display"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="flex items-center gap-1"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {selectedDoctor ? `${selectedDoctor.firstName} ${selectedDoctor.lastName}` : "--"}
                    </p>
                    <AnimatePresence>
                      {hoveredField === "doctor" && (
                        <motion.div
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -5 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                        >
                          <Edit
                            size={14}
                            className="ml-1 cursor-pointer text-gray-400 hover:text-gray-600"
                            onClick={() => {
                              setEditingField("doctor")
                              setTempValue(localAppointment.doctorProfileId || "")
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}