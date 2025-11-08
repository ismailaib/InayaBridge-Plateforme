import { Card } from "@/components/Card"
import { Button } from "@/components/Button"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/Select"
import { Appointment, updateAppointment } from "@/api/appointments"
import { Employee } from "@/api/employees"
import { Service } from "@/api/services"
import { CalendarAppointment } from "../helpers/types"
import { Edit, Check, X, RotateCw } from "lucide-react"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"


export default function ServiceDoctorSection({
  appointment,
  services,
  employees,
  onUpdate,
}: {
  appointment: CalendarAppointment
  services: Service[]
  employees: Employee[]
  onUpdate?: (updated: CalendarAppointment | null) => void
}) {
  const [localAppointment, setLocalAppointment] =
    useState<CalendarAppointment>(appointment)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [hoveredField, setHoveredField] = useState<string | null>(null)
  const [tempServiceId, setTempServiceId] = useState<string>(
    appointment.serviceId || ""
  )
  const [tempDoctorId, setTempDoctorId] = useState<string>(
    appointment.doctorProfileId || ""
  )
  const [loading, setLoading] = useState(false)

  const handleSave = async (field: "serviceId" | "doctorProfileId") => {
    setLoading(true)
    try {
      const updateData: Partial<Appointment> = {}
      if (field === "serviceId") {
        updateData.serviceId = tempServiceId
      } else {
        updateData.doctorProfileId = tempDoctorId
      }
      const res = await updateAppointment(localAppointment.id, updateData)
      setLocalAppointment((prev) => ({ ...prev, ...updateData }))
      onUpdate?.({ ...localAppointment, ...updateData })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setEditingField(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Service
        </h4>
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
                <Select
                  value={tempServiceId}
                  onValueChange={setTempServiceId}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => handleSave("serviceId")}
                  disabled={loading}
                  variant="ghost"
                  className="p-1 h-auto"
                >
                  {loading ? (
                    <RotateCw size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                </Button>
                <Button
                  onClick={() => setEditingField(null)}
                  variant="ghost"
                  className="p-1 h-auto text-red-500"
                >
                  <X size={16} />
                </Button>
              </motion.div>
            ) : (
              <motion.p
                key="service-display"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1"
              >
                {services.find((s) => s.id === localAppointment.serviceId)
                  ?.name || "N/A"}
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
                          setTempServiceId(localAppointment.serviceId || "")
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Doctor
        </h4>
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
                <Select
                  value={tempDoctorId}
                  onValueChange={setTempDoctorId}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => handleSave("doctorProfileId")}
                  disabled={loading}
                  variant="ghost"
                  className="p-1 h-auto"
                >
                  {loading ? (
                    <RotateCw size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                </Button>
                <Button
                  onClick={() => setEditingField(null)}
                  variant="ghost"
                  className="p-1 h-auto text-red-500"
                >
                  <X size={16} />
                </Button>
              </motion.div>
            ) : (
              <motion.p
                key="doctor-display"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1"
              >
                {employees.find((e) => e.id === localAppointment.doctorProfileId)
                  ?.firstName || "N/A"}{" "}
                {employees.find((e) => e.id === localAppointment.doctorProfileId)
                  ?.lastName || ""}
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
                          setTempDoctorId(localAppointment.doctorProfileId || "")
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  )
}
