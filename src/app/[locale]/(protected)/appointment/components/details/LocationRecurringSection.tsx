"use client"

import { useState } from "react"
import { Card } from "@/components/Card"
import { Switch } from "@/components/Switch"
import { MapPin, ClockFading } from "lucide-react"
import { updateAppointment } from "@/api/appointments"
import type { Appointment } from "@/api/appointments"
import { motion, AnimatePresence } from "framer-motion"
import { Edit, Check, X, RotateCw } from "lucide-react"
import { CalendarAppointment } from "../helpers/types"

export const LocationRecurringSection = ({
  appointment,
  onUpdate,
}: {
  appointment: CalendarAppointment
  onUpdate?: (updated: Appointment) => void
}) => {
  const [editingField, setEditingField] = useState<string | null>(null)
  const [hoveredField, setHoveredField] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [localAppointment, setLocalAppointment] = useState(appointment)

  const handleSaveLocation = async () => {
    try {
      setLoading(true)
      const updateData = { location: tempValue }
      const res = await updateAppointment(localAppointment.id, updateData)
      setLocalAppointment({ ...localAppointment, ...updateData })
      onUpdate?.(res.data)

      await new Promise((resolve) => setTimeout(resolve, 1500))
    } finally {
      setLoading(false)
      setEditingField(null)
    }
  }

  const handleToggleRecurring = async (checked: boolean) => {
    if (loading) return
    try {
      setLoading(true)
      const updateData = { recurring: checked }
      const res = await updateAppointment(localAppointment.id, updateData)
      setLocalAppointment({ ...localAppointment, ...updateData })
      onUpdate?.(res.data)

      // Simulate 3s loading delay after request
      await new Promise((resolve) => setTimeout(resolve, 3000))
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
      >
        <Card className="p-4 w-full">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-50">Lieu</h4>
          </div>
          <div
            className="relative group"
            onMouseEnter={() => setHoveredField("location")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <AnimatePresence mode="wait">
              {editingField === "location" ? (
                <motion.div
                  key="location-edit"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="border border-gray-300 dark:border-gray-700 rounded-md text-sm p-1 bg-transparent text-gray-900 dark:text-gray-50 w-full"
                    disabled={loading}
                  />
                  <button onClick={handleSaveLocation} disabled={loading} className="text-green-600">
                    {loading ? <RotateCw size={16} className="animate-spin" /> : <Check size={16} />}
                  </button>
                  <button onClick={() => setEditingField(null)} className="text-red-500">
                    <X size={16} />
                  </button>
                </motion.div>
              ) : (
                <motion.p
                  key="location-display"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1"
                >
                  {localAppointment.location || "Aucun lieu défini"}
                  <AnimatePresence>
                    {hoveredField === "location" && (
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
                            setEditingField("location")
                            setTempValue(localAppointment.location || "")
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.4 }}
      >
        <Card className="p-4 flex flex-row items-center justify-between w-full">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <ClockFading className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-50">Récurrent</h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{localAppointment.recurring ? "Oui" : "Non"}</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <Switch
              id="recurring-switch"
              checked={localAppointment.recurring}
              onCheckedChange={handleToggleRecurring}
              disabled={loading}
            />
          </motion.div>
        </Card>
      </motion.div>
    </motion.div>
  )
}