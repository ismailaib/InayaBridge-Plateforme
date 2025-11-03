"use client"

import { useState } from "react"
import { Divider } from "@/components/Divider"
import { updateAppointment } from "@/api/appointments"
import type { Appointment } from "@/api/appointments"
import { motion, AnimatePresence } from "framer-motion"
import { Edit, Check, X, RotateCw } from "lucide-react"
import { CalendarAppointment } from "../helpers/types"

export const MotifNotesSection = ({
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

  const handleSave = async (field: "motif" | "notes") => {
    try {
      setLoading(true)
      const updateData = field === "motif" ? { motif: tempValue } : { notes: tempValue }
      const res = await updateAppointment(localAppointment.id, updateData)
      setLocalAppointment({ ...localAppointment, ...updateData })
      onUpdate?.(res.data)

      // Simulate 3s loading delay after request
      await new Promise((resolve) => setTimeout(resolve, 3000))
    } finally {
      setLoading(false)
      setEditingField(null)
    }
  }

  if (!localAppointment.motif && !localAppointment.notes) return null

  return (
    <>
      <Divider />
      <motion.div
        initial={{ opacity: 0}}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-2"
      >
        {/* Motif */}
        {localAppointment.motif && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" , delay: 0.05 }}
            className="flex items-center gap-2"
          >
            <div
              className="relative group w-full"
              onMouseEnter={() => setHoveredField("motif")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <AnimatePresence mode="wait">
                {editingField === "motif" ? (
                  <motion.div
                    key="motif-edit"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="flex items-center gap-2 w-full"
                  >
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="border border-gray-300 dark:border-gray-700 rounded-md text-sm p-1 bg-transparent text-gray-900 dark:text-gray-50 w-full"
                      disabled={loading}
                    />
                    <button onClick={() => handleSave("motif")} disabled={loading} className="text-green-600">
                      {loading ? <RotateCw size={16} className="animate-spin" /> : <Check size={16} />}
                    </button>
                    <button onClick={() => setEditingField(null)} className="text-red-500">
                      <X size={16} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.h4
                    key="motif-display"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="text-sm font-semibold text-gray-900 dark:text-gray-50 flex items-center gap-1"
                  >
                    {localAppointment.motif}
                    <AnimatePresence>
                      {hoveredField === "motif" && (
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
                              setEditingField("motif")
                              setTempValue(localAppointment.motif || "")
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.h4>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Notes */}
        {localAppointment.notes && (
          <motion.div
            initial={{ opacity: 0}}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.6 }}
            className="flex flex-col gap-1"
          >
            <div
              className="relative group"
              onMouseEnter={() => setHoveredField("notes")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <AnimatePresence mode="wait">
                {editingField === "notes" ? (
                  <motion.div
                    key="notes-edit"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="flex flex-col gap-1 w-full"
                  >
                    <textarea
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      disabled={loading}
                      rows={3}
                      className="border border-gray-300 dark:border-gray-700 rounded-md text-sm p-1 bg-transparent text-gray-900 dark:text-gray-50 w-full"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleSave("notes")} disabled={loading} className="text-green-600">
                        {loading ? <RotateCw size={16} className="animate-spin" /> : <Check size={16} />}
                      </button>
                      <button onClick={() => setEditingField(null)} className="text-red-500">
                        <X size={16} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="notes-display"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="flex items-start gap-1"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {localAppointment.notes}
                    </p>
                    <AnimatePresence>
                      {hoveredField === "notes" && (
                        <motion.div
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -5 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                        >
                          <Edit
                            size={14}
                            className="ml-1 cursor-pointer text-gray-400 hover:text-gray-600 mt-1"
                            onClick={() => {
                              setEditingField("notes")
                              setTempValue(localAppointment.notes || "")
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  )
}