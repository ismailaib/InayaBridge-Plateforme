import React from "react"
import CardsView from "./components/CardsView"
import CalendarView from "./components/CalendarView"
import { Button } from "@/components/Button"
import { Plus } from "lucide-react"
import Link from "next/link"

const page = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-row items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Géstion des rendez-vous
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Vous pouvez gérer vos rendez-vous ici. Vous pouvez créer, modifier
            ou supprimer des rendez-vous selon vos besoins.
          </p>
        </div>
        <div>
          <Link href="/appointment/create">
            <Button variant="primary" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau rendez-vous
            </Button>
          </Link>
        </div>
      </div>
      <div>
        {/* <CardsView /> */}
        <CalendarView />
      </div>
    </div>
  )
}

export default page
