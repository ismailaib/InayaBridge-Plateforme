'use client'

import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export default function UnsavedChangesAlert() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-100 text-yellow-800 dark:bg-yellow-900/70 dark:text-yellow-200 shadow-md"
    >
      <AlertTriangle size={18} />
      <span>Vous avez des modifications non enregistrées</span>
    </motion.div>
  )
}
