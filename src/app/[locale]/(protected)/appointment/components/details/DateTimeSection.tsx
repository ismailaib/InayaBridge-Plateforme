"use client"

import { useState } from "react"
import { CalendarClock, Edit, Check, X, RotateCw } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cx } from "@/lib/utils"
import {
  getConsultationDotColor,
  getConsultationType,
  getStatusDotColor,
  getStatusLabel,
  formatTime,
  getValidDate,
} from "../helpers/details"
import { updateAppointment } from "@/api/appointments"
import type { Appointment, ConsultationType } from "@/api/appointments"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarAppointment } from "../helpers/types"

export const DateTimeSection = ({
  appointment,
  onUpdate,
}: {
  appointment: CalendarAppointment
  onUpdate?: (updated: Appointment) => void
}) => {
  const [editingField, setEditingField] = useState<string | null>(null)
  const [hoveredField, setHoveredField] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState<any>("")
  const [loading, setLoading] = useState(false)
  const [localAppointment, setLocalAppointment] = useState(appointment)

  const appointmentDate = getValidDate(localAppointment.date)
  const consultationType = getConsultationType(localAppointment.consultationType || localAppointment.consultationType)

  const typeCycle: ConsultationType[] = ["LOCAL", "IN_PERSON", "VIDEO"]

  const handleSave = async (field: string) => {
    try {
      setLoading(true)
      let updateData: any = {}

      if (field === "date") updateData.date = tempValue
      else if (field === "time") {
        updateData.startTime = tempValue.startTime
        updateData.endTime = tempValue.endTime
      }

      const res = await updateAppointment(localAppointment.id, updateData)
      setLocalAppointment({ ...localAppointment, ...updateData })
      onUpdate?.(res.data)

      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      setLoading(false)
      setEditingField(null)
    }
  }

  const toggleType = async () => {
    if (loading) return
    const currentIndex = typeCycle.indexOf((localAppointment.consultationType ?? typeCycle[0]) as ConsultationType)
    const nextType = typeCycle[(currentIndex + 1) % typeCycle.length]
    try {
      setLoading(true)
      const res = await updateAppointment(localAppointment.id, { consultationType: nextType })
      setLocalAppointment({ ...localAppointment, consultationType: nextType })
      onUpdate?.(res.data)

      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex flex-row items-center justify-between"
    >
      {/* Left: Date + Time */}
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <CalendarClock width={18} />
        </motion.div>
        <div className="flex flex-col gap-1">
          {/* DATE */}
          <div
            className="relative group"
            onMouseEnter={() => setHoveredField("date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <AnimatePresence mode="wait">
              {editingField === "date" ? (
                <motion.div
                  key="date-edit"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="date"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="border border-gray-300 dark:border-gray-700 rounded-md text-sm p-1 bg-transparent text-gray-900 dark:text-gray-50"
                  />
                  <button onClick={() => handleSave("date")} disabled={loading} className="text-green-600">
                    {loading ? <RotateCw size={16} className="animate-spin" /> : <Check size={16} />}
                  </button>
                  <button onClick={() => setEditingField(null)} className="text-red-500">
                    <X size={16} />
                  </button>
                </motion.div>
              ) : (
                <motion.h3
                  key="date-display"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="text-lg font-semibold text-gray-900 dark:text-gray-50 flex items-center gap-1"
                >
                  {appointmentDate ? format(appointmentDate, "EEEE d MMMM yyyy", { locale: fr }) : "--"}
                  <AnimatePresence>
                    {hoveredField === "date" && (
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                      >
                        <Edit
                          size={16}
                          className="ml-1 cursor-pointer text-gray-400 hover:text-gray-600"
                          onClick={() => {
                            setEditingField("date")
                            setTempValue(localAppointment.date)
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.h3>
              )}
            </AnimatePresence>
          </div>

          {/* TIME */}
          <div
            className="relative group"
            onMouseEnter={() => setHoveredField("time")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <AnimatePresence mode="wait">
              {editingField === "time" ? (
                <motion.div
                  key="time-edit"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="time"
                    value={tempValue.startTime}
                    onChange={(e) => setTempValue({ ...tempValue, startTime: e.target.value })}
                    className="border border-gray-300 dark:border-gray-700 rounded-md text-sm p-1 bg-transparent text-gray-900 dark:text-gray-50"
                  />
                  <input
                    type="time"
                    value={tempValue.endTime}
                    onChange={(e) => setTempValue({ ...tempValue, endTime: e.target.value })}
                    className="border border-gray-300 dark:border-gray-700 rounded-md text-sm p-1 bg-transparent text-gray-900 dark:text-gray-50"
                  />
                  <button onClick={() => handleSave("time")} disabled={loading} className="text-green-600">
                    {loading ? <RotateCw size={16} className="animate-spin" /> : <Check size={16} />}
                  </button>
                  <button onClick={() => setEditingField(null)} className="text-red-500">
                    <X size={16} />
                  </button>
                </motion.div>
              ) : (
                <motion.p
                  key="time-display"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1"
                >
                  {formatTime(localAppointment.startTime)}
                  {localAppointment.endTime && ` - ${formatTime(localAppointment.endTime)}`}
                  <AnimatePresence>
                    {hoveredField === "time" && (
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
                            setEditingField("time")
                            setTempValue({
                              startTime: localAppointment.startTime,
                              endTime: localAppointment.endTime,
                            })
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right: Consultation Type + Status (click to cycle) */}
      <div className="flex flex-row gap-2">
        {/* Type */}
        <motion.button
          onClick={toggleType}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cx(
            "flex items-center gap-1.5 border border-gray-200 dark:border-gray-900 rounded-full p-2 px-4 transition",
            loading && "opacity-60 cursor-wait"
          )}
        >
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cx("w-2 h-2 rounded-full", getConsultationDotColor(localAppointment.consultationType))}
          />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
            {consultationType.label}
          </span>
          {loading && <RotateCw className="h-3.5 w-3.5 animate-spin text-gray-400" />}
        </motion.button>

        {/* Status */}
        <div className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-900 rounded-full p-2 px-4"> <span className={cx("w-2 h-2 rounded-full", getStatusDotColor(appointment.status))} /> <span className="text-sm font-medium text-gray-900 dark:text-gray-50">{getStatusLabel(appointment.status)}</span> </div>
      </div>
    </motion.div>
  )
}