"use client"

import React from "react"
import Filter from "./components/Filter"
import { Button } from "@/components/Button"
import { HardDriveDownload } from "lucide-react"

const page = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="mb-4 flex flex-col items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Historique Des Consultations
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Içi vous pouvez consulter tous vos rendez-vous and génerer un rapport
          </p>
        </div>
        <Button className="flex flex-row gap-2"><HardDriveDownload width={18}/>Génerer Un Rapport</Button>
      </div>
      <Filter />
    </div>
  )
}

export default page
